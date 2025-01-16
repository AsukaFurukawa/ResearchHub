const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../db');
const auth = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.path.includes('papers') ? 'papers' : 'datasets';
    cb(null, path.join(__dirname, `../uploads/${type}`));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = {
      papers: ['.pdf', '.doc', '.docx'],
      datasets: ['.csv', '.json', '.xlsx', '.zip']
    };
    const type = req.path.includes('papers') ? 'papers' : 'datasets';
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes[type].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Upload research paper
router.post('/papers', auth, upload.single('file'), async (req, res) => {
  const { title, abstract, projectId } = req.body;
  
  try {
    // Check if user has access to the project
    const projectAccess = await pool.query(
      `SELECT 1 FROM projects p
       WHERE p.id = $1 AND 
       (p.created_by = $2 OR 
        EXISTS (SELECT 1 FROM team_members tm WHERE tm.team_id = p.team_id AND tm.user_id = $2))`,
      [projectId, req.user.id]
    );

    if (projectAccess.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to add papers to this project' });
    }

    const fileUrl = req.file ? `/uploads/papers/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO research_papers (title, abstract, file_url, project_id, uploaded_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [title, abstract, fileUrl, projectId, req.user.id]
    );

    // Log activity
    await pool.query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'created', 'paper', result.rows[0].id]
    );

    res.status(201).json({ 
      id: result.rows[0].id,
      title,
      abstract,
      fileUrl,
      projectId
    });
  } catch (error) {
    console.error('Error uploading paper:', error);
    res.status(500).json({ message: 'Failed to upload paper' });
  }
});

// Add citation to paper
router.post('/papers/:id/citations', auth, async (req, res) => {
  const { citedTitle, citedAuthors, citedYear, doi } = req.body;
  
  try {
    // Check if user has access to the paper
    const paperAccess = await pool.query(
      `SELECT 1 FROM research_papers rp
       JOIN projects p ON rp.project_id = p.id
       WHERE rp.id = $1 AND 
       (p.created_by = $2 OR 
        EXISTS (SELECT 1 FROM team_members tm WHERE tm.team_id = p.team_id AND tm.user_id = $2))`,
      [req.params.id, req.user.id]
    );

    if (paperAccess.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to add citations to this paper' });
    }

    const result = await pool.query(
      `INSERT INTO citations (paper_id, cited_title, cited_authors, cited_year, doi)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [req.params.id, citedTitle, citedAuthors, citedYear, doi]
    );

    res.status(201).json({ 
      id: result.rows[0].id,
      citedTitle,
      citedAuthors,
      citedYear,
      doi
    });
  } catch (error) {
    console.error('Error adding citation:', error);
    res.status(500).json({ message: 'Failed to add citation' });
  }
});

// Upload dataset
router.post('/datasets', auth, upload.single('file'), async (req, res) => {
  const { name, description, projectId } = req.body;
  
  try {
    // Check if user has access to the project
    const projectAccess = await pool.query(
      `SELECT 1 FROM projects p
       WHERE p.id = $1 AND 
       (p.created_by = $2 OR 
        EXISTS (SELECT 1 FROM team_members tm WHERE tm.team_id = p.team_id AND tm.user_id = $2))`,
      [projectId, req.user.id]
    );

    if (projectAccess.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to add datasets to this project' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/datasets/${req.file.filename}`;

    const result = await pool.query(
      `INSERT INTO datasets (name, description, file_url, project_id, uploaded_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [name, description, fileUrl, projectId, req.user.id]
    );

    // Log activity
    await pool.query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'created', 'dataset', result.rows[0].id]
    );

    res.status(201).json({ 
      id: result.rows[0].id,
      name,
      description,
      fileUrl,
      projectId
    });
  } catch (error) {
    console.error('Error uploading dataset:', error);
    res.status(500).json({ message: 'Failed to upload dataset' });
  }
});

// Get project datasets
router.get('/projects/:projectId/datasets', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, 
        json_build_object(
          'id', u.id,
          'name', CONCAT(u.first_name, ' ', u.last_name),
          'email', u.email
        ) as uploader
       FROM datasets d
       JOIN users u ON d.uploaded_by = u.id
       JOIN projects p ON d.project_id = p.id
       WHERE d.project_id = $1 AND 
       (p.visibility = 'public' OR p.created_by = $2 OR 
        EXISTS (SELECT 1 FROM team_members tm WHERE tm.team_id = p.team_id AND tm.user_id = $2))
       ORDER BY d.created_at DESC`,
      [req.params.projectId, req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching datasets:', error);
    res.status(500).json({ message: 'Failed to fetch datasets' });
  }
});

module.exports = router; 
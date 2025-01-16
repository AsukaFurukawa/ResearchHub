const express = require('express');
const { Pool } = require('pg');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'paper') {
      cb(null, 'uploads/papers');
    } else if (file.fieldname === 'dataset') {
      cb(null, 'uploads/datasets');
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Get all research papers
router.get('/papers', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT rp.*, 
             u.full_name as author_name,
             p.title as project_title,
             COUNT(c.id) as citation_count
      FROM research_papers rp
      LEFT JOIN users u ON rp.created_by = u.id
      LEFT JOIN projects p ON rp.project_id = p.id
      LEFT JOIN citations c ON rp.id = c.paper_id
      GROUP BY rp.id, u.full_name, p.title
      ORDER BY rp.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching papers:', error);
    res.status(500).json({ error: 'Failed to fetch papers' });
  }
});

// Create new research paper
router.post('/papers', auth, upload.single('paper'), async (req, res) => {
  const { title, abstract, projectId } = req.body;
  const createdBy = req.user.id;
  const fileUrl = req.file ? `/uploads/papers/${req.file.filename}` : null;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      'INSERT INTO research_papers (title, abstract, project_id, created_by, file_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, abstract, projectId, createdBy, fileUrl]
    );

    // Log activity
    await client.query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [createdBy, 'create', 'paper', result.rows[0].id]
    );

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating paper:', error);
    res.status(500).json({ error: 'Failed to create paper' });
  } finally {
    client.release();
  }
});

// Get paper by ID
router.get('/papers/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT rp.*, 
             u.full_name as author_name,
             p.title as project_title,
             json_agg(c.*) FILTER (WHERE c.id IS NOT NULL) as citations
      FROM research_papers rp
      LEFT JOIN users u ON rp.created_by = u.id
      LEFT JOIN projects p ON rp.project_id = p.id
      LEFT JOIN citations c ON c.paper_id = rp.id
      WHERE rp.id = $1
      GROUP BY rp.id, u.full_name, p.title
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching paper:', error);
    res.status(500).json({ error: 'Failed to fetch paper' });
  }
});

// Add citation to paper
router.post('/papers/:id/citations', auth, async (req, res) => {
  const { citedTitle, citedAuthors, citedYear, citedDoi } = req.body;
  const paperId = req.params.id;

  try {
    const result = await pool.query(
      'INSERT INTO citations (paper_id, cited_title, cited_authors, cited_year, cited_doi) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [paperId, citedTitle, citedAuthors, citedYear, citedDoi]
    );

    // Log activity
    await pool.query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'add_citation', 'paper', paperId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding citation:', error);
    res.status(500).json({ error: 'Failed to add citation' });
  }
});

// Get all datasets
router.get('/datasets', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*, 
             u.full_name as uploader_name,
             p.title as project_title
      FROM datasets d
      LEFT JOIN users u ON d.uploaded_by = u.id
      LEFT JOIN projects p ON d.project_id = p.id
      ORDER BY d.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching datasets:', error);
    res.status(500).json({ error: 'Failed to fetch datasets' });
  }
});

// Upload new dataset
router.post('/datasets', auth, upload.single('dataset'), async (req, res) => {
  const { name, description, projectId } = req.body;
  const uploadedBy = req.user.id;
  const fileUrl = req.file ? `/uploads/datasets/${req.file.filename}` : null;

  if (!fileUrl) {
    return res.status(400).json({ error: 'Dataset file is required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      'INSERT INTO datasets (name, description, file_url, project_id, uploaded_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, fileUrl, projectId, uploadedBy]
    );

    // Log activity
    await client.query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [uploadedBy, 'upload', 'dataset', result.rows[0].id]
    );

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating dataset:', error);
    res.status(500).json({ error: 'Failed to create dataset' });
  } finally {
    client.release();
  }
});

module.exports = router; 
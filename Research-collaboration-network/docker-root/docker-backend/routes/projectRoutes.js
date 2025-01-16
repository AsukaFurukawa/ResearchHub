const express = require('express');
const { Pool } = require('pg');
const router = express.Router();
const auth = require('../middleware/auth');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Get all projects
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, 
             u.full_name as creator_name,
             t.name as team_name
      FROM projects p
      LEFT JOIN users u ON p.created_by = u.id
      LEFT JOIN teams t ON p.team_id = t.id
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create new project
router.post('/', auth, async (req, res) => {
  const { title, description, teamId, isPrivate } = req.body;
  const createdBy = req.user.id;

  try {
    const result = await pool.query(
      'INSERT INTO projects (title, description, team_id, created_by, is_private) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, teamId, createdBy, isPrivate]
    );

    // Log activity
    await pool.query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [createdBy, 'create', 'project', result.rows[0].id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Get project by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, 
             u.full_name as creator_name,
             t.name as team_name,
             json_agg(DISTINCT jsonb_build_object(
               'id', rp.id,
               'title', rp.title,
               'abstract', rp.abstract
             )) FILTER (WHERE rp.id IS NOT NULL) as research_papers,
             json_agg(DISTINCT jsonb_build_object(
               'id', d.id,
               'name', d.name,
               'description', d.description
             )) FILTER (WHERE d.id IS NOT NULL) as datasets
      FROM projects p
      LEFT JOIN users u ON p.created_by = u.id
      LEFT JOIN teams t ON p.team_id = t.id
      LEFT JOIN research_papers rp ON p.id = rp.project_id
      LEFT JOIN datasets d ON p.id = d.project_id
      WHERE p.id = $1
      GROUP BY p.id, u.full_name, t.name
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  const { title, description, teamId, isPrivate } = req.body;
  const projectId = req.params.id;
  const userId = req.user.id;

  try {
    // Check if user has permission
    const projectCheck = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND created_by = $2',
      [projectId, userId]
    );

    if (projectCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to update project' });
    }

    const result = await pool.query(
      'UPDATE projects SET title = $1, description = $2, team_id = $3, is_private = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [title, description, teamId, isPrivate, projectId]
    );

    // Log activity
    await pool.query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [userId, 'update', 'project', projectId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user.id;

  try {
    // Check if user has permission
    const projectCheck = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND created_by = $2',
      [projectId, userId]
    );

    if (projectCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to delete project' });
    }

    await pool.query('DELETE FROM projects WHERE id = $1', [projectId]);

    // Log activity
    await pool.query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [userId, 'delete', 'project', projectId]
    );

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router; 
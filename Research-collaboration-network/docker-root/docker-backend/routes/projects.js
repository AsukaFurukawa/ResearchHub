const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Create a new project
router.post('/', auth, async (req, res) => {
  const { title, description, category, visibility = 'private', teamId } = req.body;
  const creatorId = req.user.id;

  try {
    await pool.query('BEGIN');

    // Create project
    const projectResult = await pool.query(
      `INSERT INTO projects (title, description, category, visibility, team_id, created_by, progress) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id`,
      [title, description, category, visibility, teamId, creatorId, 0]
    );

    const projectId = projectResult.rows[0].id;

    // Log activity
    await pool.query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [creatorId, 'created', 'project', projectId]
    );

    await pool.query('COMMIT');

    // Fetch complete project details
    const result = await pool.query(
      `SELECT p.*, 
        json_build_object(
          'id', u.id,
          'name', CONCAT(u.first_name, ' ', u.last_name),
          'email', u.email,
          'avatar', u.avatar_url
        ) as creator,
        CASE WHEN t.id IS NOT NULL THEN
          json_build_object(
            'id', t.id,
            'name', t.name
          )
        ELSE NULL END as team,
        COALESCE(
          (SELECT json_agg(json_build_object(
            'id', rp.id,
            'title', rp.title,
            'citations', (SELECT COUNT(*) FROM citations WHERE paper_id = rp.id)
          ))
          FROM research_papers rp
          WHERE rp.project_id = p.id), '[]'
        ) as papers,
        COALESCE(
          (SELECT json_agg(json_build_object(
            'id', d.id,
            'name', d.name
          ))
          FROM datasets d
          WHERE d.project_id = p.id), '[]'
        ) as datasets
      FROM projects p
      LEFT JOIN users u ON p.created_by = u.id
      LEFT JOIN teams t ON p.team_id = t.id
      WHERE p.id = $1`,
      [projectId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Failed to create project' });
  }
});

// Get all projects
router.get('/', auth, async (req, res) => {
  const { category, search, visibility } = req.query;
  const userId = req.user.id;

  try {
    let query = `
      SELECT p.*, 
        json_build_object(
          'id', u.id,
          'name', CONCAT(u.first_name, ' ', u.last_name),
          'email', u.email,
          'avatar', u.avatar_url
        ) as creator,
        CASE WHEN t.id IS NOT NULL THEN
          json_build_object(
            'id', t.id,
            'name', t.name
          )
        ELSE NULL END as team,
        COALESCE(
          (SELECT json_agg(json_build_object(
            'id', rp.id,
            'title', rp.title,
            'citations', (SELECT COUNT(*) FROM citations WHERE paper_id = rp.id)
          ))
          FROM research_papers rp
          WHERE rp.project_id = p.id), '[]'
        ) as papers,
        COALESCE(
          (SELECT json_agg(json_build_object(
            'id', d.id,
            'name', d.name
          ))
          FROM datasets d
          WHERE d.project_id = p.id), '[]'
        ) as datasets
      FROM projects p
      LEFT JOIN users u ON p.created_by = u.id
      LEFT JOIN teams t ON p.team_id = t.id
      WHERE (p.visibility = 'public' OR p.created_by = $1 OR 
            EXISTS (SELECT 1 FROM team_members tm WHERE tm.team_id = p.team_id AND tm.user_id = $1))
    `;

    const params = [userId];
    let paramCount = 1;

    if (category) {
      paramCount++;
      query += ` AND p.category = $${paramCount}`;
      params.push(category);
    }

    if (search) {
      paramCount++;
      query += ` AND (p.title ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (visibility) {
      paramCount++;
      query += ` AND p.visibility = $${paramCount}`;
      params.push(visibility);
    }

    query += ` ORDER BY p.created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

// Get project by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, 
        json_build_object(
          'id', u.id,
          'name', CONCAT(u.first_name, ' ', u.last_name),
          'email', u.email,
          'avatar', u.avatar_url
        ) as creator,
        CASE WHEN t.id IS NOT NULL THEN
          json_build_object(
            'id', t.id,
            'name', t.name
          )
        ELSE NULL END as team,
        COALESCE(
          (SELECT json_agg(json_build_object(
            'id', rp.id,
            'title', rp.title,
            'citations', (SELECT COUNT(*) FROM citations WHERE paper_id = rp.id)
          ))
          FROM research_papers rp
          WHERE rp.project_id = p.id), '[]'
        ) as papers,
        COALESCE(
          (SELECT json_agg(json_build_object(
            'id', d.id,
            'name', d.name
          ))
          FROM datasets d
          WHERE d.project_id = p.id), '[]'
        ) as datasets
      FROM projects p
      LEFT JOIN users u ON p.created_by = u.id
      LEFT JOIN teams t ON p.team_id = t.id
      WHERE p.id = $1 AND 
        (p.visibility = 'public' OR p.created_by = $2 OR 
         EXISTS (SELECT 1 FROM team_members tm WHERE tm.team_id = p.team_id AND tm.user_id = $2))`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found or access denied' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Failed to fetch project' });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  const { title, description, category, visibility, progress } = req.body;
  
  try {
    // Check if user has permission to update
    const projectCheck = await pool.query(
      `SELECT created_by, team_id FROM projects WHERE id = $1`,
      [req.params.id]
    );

    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const project = projectCheck.rows[0];
    const isTeamLeader = project.team_id ? await pool.query(
      `SELECT 1 FROM team_members WHERE team_id = $1 AND user_id = $2 AND role = 'leader'`,
      [project.team_id, req.user.id]
    ) : { rows: [] };

    if (project.created_by !== req.user.id && isTeamLeader.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    await pool.query(
      `UPDATE projects 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           category = COALESCE($3, category),
           visibility = COALESCE($4, visibility),
           progress = COALESCE($5, progress)
       WHERE id = $6`,
      [title, description, category, visibility, progress, req.params.id]
    );

    // Log activity
    await pool.query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'updated', 'project', req.params.id]
    );

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user has permission to delete
    const projectCheck = await pool.query(
      `SELECT created_by, team_id FROM projects WHERE id = $1`,
      [req.params.id]
    );

    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const project = projectCheck.rows[0];
    const isTeamLeader = project.team_id ? await pool.query(
      `SELECT 1 FROM team_members WHERE team_id = $1 AND user_id = $2 AND role = 'leader'`,
      [project.team_id, req.user.id]
    ) : { rows: [] };

    if (project.created_by !== req.user.id && isTeamLeader.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await pool.query('BEGIN');

    // Delete project and related data (cascading will handle related records)
    await pool.query('DELETE FROM projects WHERE id = $1', [req.params.id]);

    // Log activity
    await pool.query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'deleted', 'project', req.params.id]
    );

    await pool.query('COMMIT');

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

module.exports = router; 
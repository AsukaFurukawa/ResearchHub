const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Create a new team
router.post('/', auth, async (req, res) => {
  const { name, description, memberIds = [] } = req.body;
  const creatorId = req.user.id;

  try {
    // Input validation
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Team name is required' });
    }

    await pool.query('BEGIN');

    // Create the team
    const teamResult = await pool.query(
      'INSERT INTO teams (name, description, created_by) VALUES ($1, $2, $3) RETURNING id',
      [name, description, creatorId]
    );
    const teamId = teamResult.rows[0].id;

    // Add creator as team leader
    await pool.query(
      'INSERT INTO team_members (team_id, user_id, role) VALUES ($1, $2, $3)',
      [teamId, creatorId, 'leader']
    );

    // Add other members if any
    if (memberIds && memberIds.length > 0) {
      for (const memberId of memberIds) {
        await pool.query(
          'INSERT INTO team_members (team_id, user_id, role) VALUES ($1, $2, $3)',
          [teamId, memberId, 'member']
        );
      }
    }

    // Log activity
    await pool.query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [creatorId, 'created', 'team', teamId]
    );

    await pool.query('COMMIT');

    // Fetch the complete team details
    const teamDetails = await pool.query(
      `SELECT t.*, 
        COALESCE(json_agg(
          json_build_object(
            'id', u.id,
            'name', CONCAT(u.first_name, ' ', u.last_name),
            'email', u.email,
            'avatar', u.avatar_url,
            'role', tm.role
          ) 
          FILTER (WHERE u.id IS NOT NULL)
        ), '[]') as members
      FROM teams t
      LEFT JOIN team_members tm ON t.id = tm.team_id
      LEFT JOIN users u ON tm.user_id = u.id
      WHERE t.id = $1
      GROUP BY t.id`,
      [teamId]
    );

    console.log('Team created successfully:', teamDetails.rows[0]);
    res.status(201).json(teamDetails.rows[0]);
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error creating team:', error);
    res.status(500).json({ 
      message: 'Failed to create team',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all teams for the current user
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, 
        json_agg(json_build_object(
          'id', u.id,
          'name', CONCAT(u.first_name, ' ', u.last_name),
          'email', u.email,
          'avatar', u.avatar_url,
          'role', tm.role
        )) as members
      FROM teams t
      LEFT JOIN team_members tm ON t.id = tm.team_id
      LEFT JOIN users u ON tm.user_id = u.id
      WHERE EXISTS (
        SELECT 1 FROM team_members 
        WHERE team_id = t.id AND user_id = $1
      )
      GROUP BY t.id
      ORDER BY t.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Failed to fetch teams' });
  }
});

// Search users for team member addition
router.get('/users/search', auth, async (req, res) => {
  const { q } = req.query;
  
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, avatar_url
       FROM users
       WHERE (LOWER(first_name) LIKE $1 OR 
              LOWER(last_name) LIKE $1 OR 
              LOWER(email) LIKE $1) AND
              id != $2
       LIMIT 10`,
      [`%${q.toLowerCase()}%`, req.user.id]
    );

    const users = result.rows.map(user => ({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      avatar: user.avatar_url
    }));

    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Failed to search users' });
  }
});

// Get team by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, 
        json_agg(json_build_object(
          'id', u.id,
          'name', CONCAT(u.first_name, ' ', u.last_name),
          'email', u.email,
          'avatar', u.avatar_url,
          'role', tm.role
        )) as members
      FROM teams t
      LEFT JOIN team_members tm ON t.id = tm.team_id
      LEFT JOIN users u ON tm.user_id = u.id
      WHERE t.id = $1 AND EXISTS (
        SELECT 1 FROM team_members 
        WHERE team_id = t.id AND user_id = $2
      )
      GROUP BY t.id`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ message: 'Failed to fetch team' });
  }
});

// Update team
router.put('/:id', auth, async (req, res) => {
  const { name, description } = req.body;
  
  try {
    // Check if user is team leader
    const leaderCheck = await pool.query(
      'SELECT 1 FROM team_members WHERE team_id = $1 AND user_id = $2 AND role = $3',
      [req.params.id, req.user.id, 'leader']
    );

    if (leaderCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Only team leaders can update team details' });
    }

    await pool.query(
      'UPDATE teams SET name = $1, description = $2 WHERE id = $3',
      [name, description, req.params.id]
    );

    // Log activity
    await pool.query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'updated', 'team', req.params.id]
    );

    res.json({ message: 'Team updated successfully' });
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ message: 'Failed to update team' });
  }
});

// Add member to team
router.post('/:id/members', auth, async (req, res) => {
  const { userId, role = 'member' } = req.body;
  
  try {
    // Check if user is team leader
    const leaderCheck = await pool.query(
      'SELECT 1 FROM team_members WHERE team_id = $1 AND user_id = $2 AND role = $3',
      [req.params.id, req.user.id, 'leader']
    );

    if (leaderCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Only team leaders can add members' });
    }

    await pool.query(
      'INSERT INTO team_members (team_id, user_id, role) VALUES ($1, $2, $3)',
      [req.params.id, userId, role]
    );

    // Log activity
    await pool.query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id, target_user_id) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'added_member', 'team', req.params.id, userId]
    );

    res.json({ message: 'Member added successfully' });
  } catch (error) {
    console.error('Error adding team member:', error);
    res.status(500).json({ message: 'Failed to add team member' });
  }
});

module.exports = router; 
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Create a new team
router.post('/', auth, async (req, res) => {
  const { name, description, maxMembers } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Create the team
    const teamResult = await client.query(
      'INSERT INTO teams (name, description, max_members, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, maxMembers, req.user.userId]
    );
    const team = teamResult.rows[0];

    // Add creator as team leader
    await client.query(
      'INSERT INTO team_members (team_id, user_id, role) VALUES ($1, $2, $3)',
      [team.id, req.user.userId, 'leader']
    );

    await client.query('COMMIT');

    res.json({
      message: 'Team created successfully',
      team: {
        ...team,
        currentMembers: 1,
        isLeader: true
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating team:', error);
    res.status(500).json({ message: 'Error creating team' });
  } finally {
    client.release();
  }
});

// Get all teams for current user
router.get('/my-teams', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, tm.role as member_role,
        (SELECT COUNT(*) FROM team_members WHERE team_id = t.id) as member_count
       FROM teams t
       JOIN team_members tm ON t.id = tm.team_id
       WHERE tm.user_id = $1`,
      [req.user.userId]
    );

    res.json(result.rows.map(team => ({
      ...team,
      isLeader: team.member_role === 'leader'
    })));
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Error fetching teams' });
  }
});

// Add member to team
router.post('/:teamId/members', auth, async (req, res) => {
  const { teamId } = req.params;
  const { userId } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check if user is team leader
    const leaderCheck = await client.query(
      'SELECT * FROM team_members WHERE team_id = $1 AND user_id = $2 AND role = $3',
      [teamId, req.user.userId, 'leader']
    );
    if (leaderCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Only team leaders can add members' });
    }

    // Check if team has space
    const teamCheck = await client.query(
      `SELECT t.max_members, COUNT(tm.id) as current_members
       FROM teams t
       LEFT JOIN team_members tm ON t.id = tm.team_id
       WHERE t.id = $1
       GROUP BY t.id, t.max_members`,
      [teamId]
    );
    
    if (teamCheck.rows[0].current_members >= teamCheck.rows[0].max_members) {
      return res.status(400).json({ message: 'Team is full' });
    }

    // Check if user exists
    const userCheck = await client.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add member
    await client.query(
      'INSERT INTO team_members (team_id, user_id) VALUES ($1, $2)',
      [teamId, userId]
    );

    await client.query('COMMIT');
    res.json({ message: 'Member added successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding team member:', error);
    res.status(500).json({ message: 'Error adding team member' });
  } finally {
    client.release();
  }
});

// Search users for adding to team
router.get('/search-users', auth, async (req, res) => {
  const { search } = req.query;
  
  try {
    const result = await pool.query(
      `SELECT id, email, first_name, last_name 
       FROM users 
       WHERE (email ILIKE $1 OR first_name ILIKE $1 OR last_name ILIKE $1)
       AND id != $2
       LIMIT 10`,
      [`%${search}%`, req.user.userId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Error searching users' });
  }
});

// Get team details with members
router.get('/:teamId', auth, async (req, res) => {
  const { teamId } = req.params;

  try {
    const teamResult = await pool.query(
      `SELECT t.*, 
        (SELECT COUNT(*) FROM team_members WHERE team_id = t.id) as member_count,
        (SELECT role FROM team_members WHERE team_id = t.id AND user_id = $1) as user_role
       FROM teams t
       WHERE t.id = $2`,
      [req.user.userId, teamId]
    );

    if (teamResult.rows.length === 0) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const membersResult = await pool.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, tm.role
       FROM team_members tm
       JOIN users u ON tm.user_id = u.id
       WHERE tm.team_id = $1`,
      [teamId]
    );

    res.json({
      ...teamResult.rows[0],
      members: membersResult.rows,
      isLeader: teamResult.rows[0].user_role === 'leader'
    });
  } catch (error) {
    console.error('Error fetching team details:', error);
    res.status(500).json({ message: 'Error fetching team details' });
  }
});

module.exports = router; 
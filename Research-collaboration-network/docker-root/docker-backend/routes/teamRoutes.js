const express = require('express');
const { Pool } = require('pg');
const router = express.Router();
const auth = require('../middleware/auth');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Get all teams
router.get('/', auth, async (req, res) => {
  const { search } = req.query;
  let query = `
    SELECT t.*,
           u.full_name as created_by_name,
           COUNT(DISTINCT tm.user_id) as member_count,
           EXISTS(
             SELECT 1 FROM team_members tm2 
             WHERE tm2.team_id = t.id AND tm2.user_id = $1
           ) as is_member
    FROM teams t
    LEFT JOIN users u ON t.created_by = u.id
    LEFT JOIN team_members tm ON t.id = tm.team_id
    WHERE 1=1
  `;
  const params = [req.user.id];

  if (search) {
    query += ` AND (t.name ILIKE $2 OR t.description ILIKE $2)`;
    params.push(`%${search}%`);
  }

  query += ` GROUP BY t.id, u.full_name ORDER BY t.created_at DESC`;

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// Create new team
router.post('/', auth, async (req, res) => {
  const { name, description, members } = req.body;
  const createdBy = req.user.id;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create team
    const teamResult = await client.query(
      'INSERT INTO teams (name, description, created_by) VALUES ($1, $2, $3) RETURNING *',
      [name, description, createdBy]
    );
    const team = teamResult.rows[0];

    // Add creator as team leader
    await client.query(
      'INSERT INTO team_members (team_id, user_id, role) VALUES ($1, $2, $3)',
      [team.id, createdBy, 'leader']
    );

    // Process other members
    if (members && members.length > 0) {
      for (const member of members) {
        // Check if user exists
        const userResult = await client.query('SELECT * FROM users WHERE email = $1', [member.email]);
        
        if (userResult.rows.length > 0) {
          // Add existing user as member
          await client.query(
            'INSERT INTO team_members (team_id, user_id, role) VALUES ($1, $2, $3)',
            [team.id, userResult.rows[0].id, member.role || 'member']
          );
        } else {
          // Create invitation for non-existing user
          const token = crypto.randomBytes(32).toString('hex');
          await client.query(
            'INSERT INTO team_invitations (team_id, email, role, token) VALUES ($1, $2, $3, $4)',
            [team.id, member.email, member.role || 'member', token]
          );

          // Send invitation email
          const inviteUrl = `${process.env.FRONTEND_URL}/teams/join/${token}`;
          await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: member.email,
            subject: `Invitation to join team ${team.name}`,
            html: `
              <p>You have been invited to join the team "${team.name}" on Research Hub.</p>
              <p>Click the link below to accept the invitation:</p>
              <a href="${inviteUrl}">${inviteUrl}</a>
            `,
          });
        }
      }
    }

    // Log activity
    await client.query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [createdBy, 'create', 'team', team.id]
    );

    await client.query('COMMIT');
    res.status(201).json(team);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'Failed to create team' });
  } finally {
    client.release();
  }
});

// Get team by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*,
             u.full_name as created_by_name,
             json_agg(json_build_object(
               'user_id', tm.user_id,
               'full_name', mu.full_name,
               'email', mu.email,
               'role', tm.role,
               'joined_at', tm.created_at
             )) FILTER (WHERE tm.user_id IS NOT NULL) as members,
             EXISTS(
               SELECT 1 FROM team_members tm2 
               WHERE tm2.team_id = t.id AND tm2.user_id = $2 AND tm2.role = 'leader'
             ) as is_leader
      FROM teams t
      LEFT JOIN users u ON t.created_by = u.id
      LEFT JOIN team_members tm ON t.id = tm.team_id
      LEFT JOIN users mu ON tm.user_id = mu.id
      WHERE t.id = $1
      GROUP BY t.id, u.full_name
    `, [req.params.id, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

// Update team
router.put('/:id', auth, async (req, res) => {
  const { name, description } = req.body;
  const teamId = req.params.id;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if user is team leader
    const leaderCheck = await client.query(
      'SELECT 1 FROM team_members WHERE team_id = $1 AND user_id = $2 AND role = $3',
      [teamId, req.user.id, 'leader']
    );

    if (leaderCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Only team leaders can update team details' });
    }

    const result = await client.query(
      'UPDATE teams SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [name, description, teamId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Log activity
    await client.query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'update', 'team', teamId]
    );

    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating team:', error);
    res.status(500).json({ error: 'Failed to update team' });
  } finally {
    client.release();
  }
});

// Add member to team
router.post('/:id/members', auth, async (req, res) => {
  const { email, role } = req.body;
  const teamId = req.params.id;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if user is team leader
    const leaderCheck = await client.query(
      'SELECT 1 FROM team_members WHERE team_id = $1 AND user_id = $2 AND role = $3',
      [teamId, req.user.id, 'leader']
    );

    if (leaderCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Only team leaders can add members' });
    }

    // Check if user exists
    const userResult = await client.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userResult.rows.length > 0) {
      // Check if already a member
      const memberCheck = await client.query(
        'SELECT * FROM team_members WHERE team_id = $1 AND user_id = $2',
        [teamId, userResult.rows[0].id]
      );

      if (memberCheck.rows.length > 0) {
        return res.status(400).json({ error: 'User is already a team member' });
      }

      // Add user as member
      const result = await client.query(
        'INSERT INTO team_members (team_id, user_id, role) VALUES ($1, $2, $3) RETURNING *',
        [teamId, userResult.rows[0].id, role || 'member']
      );

      // Log activity
      await client.query(
        'INSERT INTO activity_log (user_id, action, entity_type, entity_id, target_user_id) VALUES ($1, $2, $3, $4, $5)',
        [req.user.id, 'add_member', 'team', teamId, userResult.rows[0].id]
      );

      await client.query('COMMIT');
      res.status(201).json(result.rows[0]);
    } else {
      // Create invitation for non-existing user
      const token = crypto.randomBytes(32).toString('hex');
      await client.query(
        'INSERT INTO team_invitations (team_id, email, role, token) VALUES ($1, $2, $3, $4) RETURNING *',
        [teamId, email, role || 'member', token]
      );

      // Get team name
      const teamResult = await client.query('SELECT name FROM teams WHERE id = $1', [teamId]);
      const teamName = teamResult.rows[0].name;

      // Send invitation email
      const inviteUrl = `${process.env.FRONTEND_URL}/teams/join/${token}`;
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: `Invitation to join team ${teamName}`,
        html: `
          <p>You have been invited to join the team "${teamName}" on Research Hub.</p>
          <p>Click the link below to accept the invitation:</p>
          <a href="${inviteUrl}">${inviteUrl}</a>
        `,
      });

      await client.query('COMMIT');
      res.status(201).json({ message: 'Invitation sent successfully' });
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding team member:', error);
    res.status(500).json({ error: 'Failed to add team member' });
  } finally {
    client.release();
  }
});

// Remove member from team
router.delete('/:id/members/:userId', auth, async (req, res) => {
  const teamId = req.params.id;
  const userId = req.params.userId;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if user is team leader or removing themselves
    const leaderCheck = await client.query(
      'SELECT 1 FROM team_members WHERE team_id = $1 AND user_id = $2 AND role = $3',
      [teamId, req.user.id, 'leader']
    );

    if (leaderCheck.rows.length === 0 && req.user.id !== userId) {
      return res.status(403).json({ error: 'Only team leaders can remove other members' });
    }

    // Check if last leader is being removed
    if (req.user.id === userId) {
      const leaderCount = await client.query(
        'SELECT COUNT(*) FROM team_members WHERE team_id = $1 AND role = $2',
        [teamId, 'leader']
      );

      if (leaderCount.rows[0].count === '1') {
        return res.status(400).json({ error: 'Cannot remove last team leader' });
      }
    }

    const result = await client.query(
      'DELETE FROM team_members WHERE team_id = $1 AND user_id = $2 RETURNING *',
      [teamId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    // Log activity
    await client.query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id, target_user_id) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'remove_member', 'team', teamId, userId]
    );

    await client.query('COMMIT');
    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error removing team member:', error);
    res.status(500).json({ error: 'Failed to remove team member' });
  } finally {
    client.release();
  }
});

// Accept team invitation
router.post('/invitations/:token/accept', auth, async (req, res) => {
  const { token } = req.params;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Get invitation details
    const invitationResult = await client.query(
      'SELECT * FROM team_invitations WHERE token = $1 AND status = $2',
      [token, 'pending']
    );

    if (invitationResult.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid or expired invitation' });
    }

    const invitation = invitationResult.rows[0];

    // Check if user's email matches invitation
    const userResult = await client.query('SELECT email FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows[0].email !== invitation.email) {
      return res.status(403).json({ error: 'Invitation is for a different email address' });
    }

    // Add user as team member
    await client.query(
      'INSERT INTO team_members (team_id, user_id, role) VALUES ($1, $2, $3)',
      [invitation.team_id, req.user.id, invitation.role]
    );

    // Update invitation status
    await client.query(
      'UPDATE team_invitations SET status = $1, accepted_at = CURRENT_TIMESTAMP WHERE token = $2',
      ['accepted', token]
    );

    // Log activity
    await client.query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'join', 'team', invitation.team_id]
    );

    await client.query('COMMIT');
    res.json({ message: 'Successfully joined team' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error accepting team invitation:', error);
    res.status(500).json({ error: 'Failed to accept team invitation' });
  } finally {
    client.release();
  }
});

module.exports = router; 
const express = require('express');
const { Pool } = require('pg');
const auth = require('../middleware/auth');
const router = express.Router();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Get user dashboard stats
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get total projects count
    const projectsResult = await pool.query(
      'SELECT COUNT(*) as total FROM projects WHERE created_by = $1',
      [userId]
    );

    // Get total teams count
    const teamsResult = await pool.query(
      'SELECT COUNT(*) as total FROM team_members WHERE user_id = $1',
      [userId]
    );

    // Get total research papers count
    const papersResult = await pool.query(
      'SELECT COUNT(*) as total FROM research_papers WHERE uploaded_by = $1',
      [userId]
    );

    // Get upcoming events count
    const eventsResult = await pool.query(
      'SELECT COUNT(*) as total FROM event_registrations er ' +
      'JOIN events e ON er.event_id = e.id ' +
      'WHERE er.user_id = $1 AND e.end_date > CURRENT_TIMESTAMP',
      [userId]
    );

    res.json({
      totalProjects: parseInt(projectsResult.rows[0].total) || 0,
      totalTeams: parseInt(teamsResult.rows[0].total) || 0,
      totalPapers: parseInt(papersResult.rows[0].total) || 0,
      upcomingEvents: parseInt(eventsResult.rows[0].total) || 0,
      projectsGrowth: 35,
      teamsGrowth: 20,
      papersGrowth: 15,
      eventsGrowth: 25
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

module.exports = router; 
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Create a new event
router.post('/', auth, async (req, res) => {
  const { title, description, startDate, endDate, location, type, maxParticipants } = req.body;
  const creatorId = req.user.id;

  try {
    await pool.query('BEGIN');

    // Create event
    const eventResult = await pool.query(
      `INSERT INTO events (title, description, start_date, end_date, location, type, max_participants, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [title, description, startDate, endDate, location, type, maxParticipants, creatorId]
    );

    const eventId = eventResult.rows[0].id;

    // Log activity
    await pool.query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [creatorId, 'created', 'event', eventId]
    );

    await pool.query('COMMIT');

    // Fetch complete event details
    const result = await pool.query(
      `SELECT e.*, 
        json_build_object(
          'id', u.id,
          'name', CONCAT(u.first_name, ' ', u.last_name),
          'email', u.email,
          'avatar', u.avatar_url
        ) as creator,
        (SELECT COUNT(*) FROM event_participants WHERE event_id = e.id) as participant_count
       FROM events e
       JOIN users u ON e.created_by = u.id
       WHERE e.id = $1`,
      [eventId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Failed to create event' });
  }
});

// Get all events
router.get('/', auth, async (req, res) => {
  const { type, search, startDate, endDate } = req.query;
  
  try {
    let query = `
      SELECT e.*, 
        json_build_object(
          'id', u.id,
          'name', CONCAT(u.first_name, ' ', u.last_name),
          'email', u.email,
          'avatar', u.avatar_url
        ) as creator,
        (SELECT COUNT(*) FROM event_participants WHERE event_id = e.id) as participant_count,
        EXISTS(SELECT 1 FROM event_participants WHERE event_id = e.id AND user_id = $1) as is_registered
      FROM events e
      JOIN users u ON e.created_by = u.id
      WHERE 1=1
    `;

    const params = [req.user.id];
    let paramCount = 1;

    if (type) {
      paramCount++;
      query += ` AND e.type = $${paramCount}`;
      params.push(type);
    }

    if (search) {
      paramCount++;
      query += ` AND (e.title ILIKE $${paramCount} OR e.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (startDate) {
      paramCount++;
      query += ` AND e.start_date >= $${paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      query += ` AND e.end_date <= $${paramCount}`;
      params.push(endDate);
    }

    query += ` ORDER BY e.start_date ASC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
});

// Get event by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, 
        json_build_object(
          'id', u.id,
          'name', CONCAT(u.first_name, ' ', u.last_name),
          'email', u.email,
          'avatar', u.avatar_url
        ) as creator,
        (SELECT COUNT(*) FROM event_participants WHERE event_id = e.id) as participant_count,
        EXISTS(SELECT 1 FROM event_participants WHERE event_id = e.id AND user_id = $1) as is_registered,
        COALESCE(
          json_agg(
            json_build_object(
              'id', p.user_id,
              'name', CONCAT(pu.first_name, ' ', pu.last_name),
              'email', pu.email,
              'avatar', pu.avatar_url
            )
          ) FILTER (WHERE p.user_id IS NOT NULL), '[]'
        ) as participants
       FROM events e
       JOIN users u ON e.created_by = u.id
       LEFT JOIN event_participants p ON e.id = p.event_id
       LEFT JOIN users pu ON p.user_id = pu.id
       WHERE e.id = $1
       GROUP BY e.id, u.id`,
      [req.user.id, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Failed to fetch event' });
  }
});

// Register for event
router.post('/:id/register', auth, async (req, res) => {
  try {
    // Check if event exists and has space
    const eventCheck = await pool.query(
      `SELECT * FROM events 
       WHERE id = $1 AND 
       (max_participants IS NULL OR 
        (SELECT COUNT(*) FROM event_participants WHERE event_id = $1) < max_participants)`,
      [req.params.id]
    );

    if (eventCheck.rows.length === 0) {
      return res.status(400).json({ message: 'Event is full or does not exist' });
    }

    // Check if already registered
    const registrationCheck = await pool.query(
      'SELECT 1 FROM event_participants WHERE event_id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (registrationCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Register for event
    await pool.query(
      'INSERT INTO event_participants (event_id, user_id) VALUES ($1, $2)',
      [req.params.id, req.user.id]
    );

    // Log activity
    await pool.query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'registered', 'event', req.params.id]
    );

    res.json({ message: 'Successfully registered for event' });
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({ message: 'Failed to register for event' });
  }
});

// Cancel event registration
router.delete('/:id/register', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM event_participants WHERE event_id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ message: 'Not registered for this event' });
    }

    // Log activity
    await pool.query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'unregistered', 'event', req.params.id]
    );

    res.json({ message: 'Successfully cancelled event registration' });
  } catch (error) {
    console.error('Error cancelling event registration:', error);
    res.status(500).json({ message: 'Failed to cancel event registration' });
  }
});

module.exports = router; 
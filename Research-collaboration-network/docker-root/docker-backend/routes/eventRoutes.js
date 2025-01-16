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

// Get all events
router.get('/', auth, async (req, res) => {
  const { type, search, startDate, endDate } = req.query;
  let query = `
    SELECT e.*, 
           u.full_name as organizer_name,
           COUNT(DISTINCT er.user_id) as participant_count,
           EXISTS(
             SELECT 1 FROM event_registrations er2 
             WHERE er2.event_id = e.id AND er2.user_id = $1
           ) as is_registered
    FROM events e
    LEFT JOIN users u ON e.created_by = u.id
    LEFT JOIN event_registrations er ON e.id = er.event_id
    WHERE 1=1
  `;
  const params = [req.user.id];
  let paramCount = 2;

  if (type) {
    query += ` AND e.type = $${paramCount}`;
    params.push(type);
    paramCount++;
  }

  if (search) {
    query += ` AND (e.title ILIKE $${paramCount} OR e.description ILIKE $${paramCount})`;
    params.push(`%${search}%`);
    paramCount++;
  }

  if (startDate) {
    query += ` AND e.start_date >= $${paramCount}`;
    params.push(startDate);
    paramCount++;
  }

  if (endDate) {
    query += ` AND e.end_date <= $${paramCount}`;
    params.push(endDate);
    paramCount++;
  }

  query += ` GROUP BY e.id, u.full_name ORDER BY e.start_date ASC`;

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Create new event
router.post('/', auth, async (req, res) => {
  const { title, description, type, startDate, endDate, location, maxParticipants } = req.body;
  const createdBy = req.user.id;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      'INSERT INTO events (title, description, type, start_date, end_date, location, max_participants, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, description, type, startDate, endDate, location, maxParticipants, createdBy]
    );

    // Log activity
    await client.query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [createdBy, 'create', 'event', result.rows[0].id]
    );

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  } finally {
    client.release();
  }
});

// Get event by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, 
             u.full_name as organizer_name,
             json_agg(json_build_object(
               'user_id', er.user_id,
               'full_name', ru.full_name,
               'registration_date', er.created_at
             )) FILTER (WHERE er.user_id IS NOT NULL) as participants
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN event_registrations er ON e.id = er.event_id
      LEFT JOIN users ru ON er.user_id = ru.id
      WHERE e.id = $1
      GROUP BY e.id, u.full_name
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Register for event
router.post('/:id/register', auth, async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if event exists and has space
    const eventCheck = await client.query(`
      SELECT e.*, COUNT(er.user_id) as current_participants
      FROM events e
      LEFT JOIN event_registrations er ON e.id = er.event_id
      WHERE e.id = $1
      GROUP BY e.id
    `, [eventId]);

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = eventCheck.rows[0];
    if (event.max_participants && event.current_participants >= event.max_participants) {
      return res.status(400).json({ error: 'Event is full' });
    }

    // Check if already registered
    const registrationCheck = await client.query(
      'SELECT * FROM event_registrations WHERE event_id = $1 AND user_id = $2',
      [eventId, userId]
    );

    if (registrationCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Already registered for this event' });
    }

    const result = await client.query(
      'INSERT INTO event_registrations (event_id, user_id) VALUES ($1, $2) RETURNING *',
      [eventId, userId]
    );

    // Log activity
    await client.query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [userId, 'register', 'event', eventId]
    );

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error registering for event:', error);
    res.status(500).json({ error: 'Failed to register for event' });
  } finally {
    client.release();
  }
});

// Cancel event registration
router.delete('/:id/register', auth, async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      'DELETE FROM event_registrations WHERE event_id = $1 AND user_id = $2 RETURNING *',
      [eventId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    // Log activity
    await client.query(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [userId, 'unregister', 'event', eventId]
    );

    await client.query('COMMIT');
    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error cancelling registration:', error);
    res.status(500).json({ error: 'Failed to cancel registration' });
  } finally {
    client.release();
  }
});

// Get user's upcoming events
router.get('/user/upcoming', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, 
             u.full_name as organizer_name,
             er.created_at as registration_date
      FROM events e
      INNER JOIN event_registrations er ON e.id = er.event_id
      LEFT JOIN users u ON e.created_by = u.id
      WHERE er.user_id = $1 AND e.start_date > CURRENT_TIMESTAMP
      ORDER BY e.start_date ASC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming events' });
  }
});

module.exports = router; 
// Register
router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName, institution, department, designation, researchInterests } = req.body;

  try {
    // Check if user already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with all fields
    const result = await pool.query(
      `INSERT INTO users (
        first_name,
        last_name,
        email,
        password_hash,
        designation,
        institution,
        department,
        research_interests,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
      RETURNING id, email, first_name, last_name, institution, designation`,
      [
        firstName,
        lastName,
        email,
        hashedPassword,
        designation,
        institution,
        department,
        [researchInterests], // Convert to array since research_interests is TEXT[]
      ]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: result.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please login.',
      user: result.rows[0],
      token
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check admin credentials
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(
        { id: 1, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY }
      );
      return res.json({
        success: true,
        user: {
          id: 1,
          email: process.env.ADMIN_EMAIL,
          role: 'admin',
          first_name: 'Admin',
          last_name: 'User'
        },
        token
      });
    }

    // Find user
    const result = await pool.query(
      'SELECT id, email, password_hash, first_name, last_name, designation, institution FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    // Remove password hash from response
    delete user.password_hash;

    res.json({
      success: true,
      message: 'Login successful!',
      user,
      token
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

module.exports = router; 
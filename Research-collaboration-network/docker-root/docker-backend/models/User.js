// Updated User.js with password hashing and validation functionality
const { Pool } = require('pg');
const crypto = require('crypto');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://admin:password@postgres:5432/main_db',
});

class User {
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    try {
      const { rows } = await pool.query(query, [email]);
      return rows[0] || null;
    } catch (error) {
      throw new Error('Error finding user: ' + error.message);
    }
  }

  static async validatePassword(inputPassword, storedHash) {
    const inputHash = crypto
      .createHash('sha256')
      .update(inputPassword)
      .digest('hex');
    return inputHash === storedHash;
  }

  static async createUser(user) {
    const hashedPassword = crypto
      .createHash('sha256')
      .update(user.password)
      .digest('hex');

    const query = `
      INSERT INTO users (email, password, name, designation, age, department)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, name, designation, age, department;
    `;

    const values = [
      user.email,
      hashedPassword,
      user.name,
      user.designation,
      user.age,
      user.department,
    ];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error('Error creating user: ' + error.message);
    }
  }

  static async updateUser(userId, updates) {
    const setQuery = Object.keys(updates)
      .map((key, idx) => `${key} = $${idx + 2}`)
      .join(', ');
    const values = [userId, ...Object.values(updates)];

    const query = `
      UPDATE users
      SET ${setQuery}
      WHERE id = $1
      RETURNING id, email, name, designation, age, department;
    `;

    try {
      const { rows } = await pool.query(query, values);
      return rows[0] || null;
    } catch (error) {
      throw new Error('Error updating user: ' + error.message);
    }
  }

  static async deleteUser(userId) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    try {
      const { rows } = await pool.query(query, [userId]);
      return rows.length > 0;
    } catch (error) {
      throw new Error('Error deleting user: ' + error.message);
    }
  }
}

module.exports = User;

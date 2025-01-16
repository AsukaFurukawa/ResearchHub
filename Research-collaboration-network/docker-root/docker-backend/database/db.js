// const { Pool } = require('pg');

// const pool = new Pool({
//     user: process.env.POSTGRES_USER || 'admin',
//     host: 'postgres', // Matches service name in docker-compose.yml
//     database: process.env.POSTGRES_DB || 'main_db',
//     password: process.env.POSTGRES_PASSWORD || 'password',
//     port: 5432,
// });

// module.exports = {
//     query: (text, params) => pool.query(text, params),
// };

const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'research_app',
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};



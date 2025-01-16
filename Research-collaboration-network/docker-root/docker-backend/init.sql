-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    institution VARCHAR(255),
    department VARCHAR(255),
    research_interests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin user if not exists
INSERT INTO users (email, password_hash, first_name, last_name, role)
SELECT 
    'admin@researchhub.com',
    '$2b$10$ZKhyPVbqxKR5xmKXKxvZ8O5kK5v5q5q5q5q5q5q5q5q5q5q5q5',
    'Admin',
    'User',
    'admin'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'admin@researchhub.com'
); 
-- Populate Users with SHA256 hashed passwords (hash of 'password123')
INSERT INTO users (name, email, password, age, designation, department) VALUES
('Alice', 'alice@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 25, 'Manager', 'IT'),
('Bob', 'bob@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 22, 'Developer', 'Engineering'),
('Charlie', 'charlie@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 30, 'Analyst', 'Finance'),
('Diana', 'diana@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 28, 'Tester', 'QA'),
('Eve', 'eve@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 35, 'Lead', 'HR'),
('Frank', 'frank@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 29, 'Engineer', 'R&D'),
('Grace', 'grace@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 27, 'Scientist', 'Physics'),
('Hank', 'hank@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 32, 'Lead', 'AI Research'),
('Ivy', 'ivy@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 24, 'Developer', 'Software'),
('John', 'john@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 31, 'Manager', 'Product Development'),
('Karen', 'karen@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 26, 'Consultant', 'Marketing'),
('Leo', 'leo@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 33, 'Architect', 'Infrastructure'),
('Mona', 'mona@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 23, 'Researcher', 'Climate Science'),
('Nina', 'nina@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 34, 'Scientist', 'Biotechnology'),
('Oscar', 'oscar@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 36, 'Analyst', 'Data Science');

-- Populate Teams
INSERT INTO teams (name, created_by) VALUES
('Alpha Team', 1),
('Beta Team', 2),
('Gamma Team', 3),
('Delta Team', 4),
('Epsilon Team', 5),
('Zeta Team', 6),
('Theta Team', 7),
('Iota Team', 8),
('Kappa Team', 9),
('Lambda Team', 10);

-- Populate Team Members
INSERT INTO team_members (team_id, user_id, role) VALUES
(1, 1, 'Lead'),
(1, 2, 'Member'),
(1, 3, 'Member'),
(2, 4, 'Lead'),
(2, 5, 'Member'),
(2, 6, 'Member'),
(3, 7, 'Lead'),
(3, 8, 'Member'),
(3, 9, 'Member'),
(4, 10, 'Lead'),
(4, 11, 'Member'),
(4, 12, 'Member'),
(5, 13, 'Lead'),
(5, 14, 'Member'),
(5, 15, 'Member');

-- Populate Projects
INSERT INTO projects (name, description, team_id, created_by, category, status, start_date, end_date) VALUES
('Project A', 'AI Research on Neural Networks', 1, 1, 'Research', 'Active', '2024-01-01', '2024-12-31'),
('Project B', 'Blockchain Development', 2, 4, 'Development', 'Completed', '2023-05-01', '2023-11-30'),
('Project C', 'Hackathon Tool Design', 3, 7, 'Hackathon', 'Active', '2024-02-01', '2024-04-30'),
('Project D', 'Climate Change Analysis', 5, 13, 'Research', 'Active', '2024-03-01', '2025-03-01'),
('Project E', 'AI-Powered Chatbot', 1, 1, 'AI Development', 'Completed', '2023-06-01', '2023-12-01'),
('Project F', 'IoT Smart Agriculture', 3, 7, 'IoT', 'Active', '2024-01-15', '2024-08-15'),
('Project G', 'Energy Optimization Algorithms', 4, 10, 'Optimization', 'Active', '2024-05-01', '2025-05-01'),
('Project H', 'Quantum Computing Research', 6, 7, 'Research', 'Active', '2024-02-15', '2024-12-31'),
('Project I', 'Data Analytics Platform', 2, 4, 'Development', 'Completed', '2023-01-01', '2023-08-01'),
('Project J', 'Autonomous Drone Navigation', 5, 13, 'Robotics', 'Active', '2024-06-01', '2025-06-01');

-- Populate Citations
INSERT INTO citations (project_id, title, authors, publication_date, journal_name, url) VALUES
(1, 'Deep Learning in AI', 'John Doe, Jane Smith', '2024-06-01', 'AI Journal', 'https://aijournal.com/deep-learning'),
(1, 'Neural Networks Explained', 'Alice Brown', '2024-07-15', 'ML Today', 'https://mltoday.com/neural-networks'),
(4, 'Climate Change Effects', 'Nina White', '2024-09-01', 'Climate Research', 'https://climateresearch.com/effects'),
(6, 'IoT in Agriculture', 'Hank Johnson', '2024-08-01', 'IoT Journal', 'https://iotjournal.com/agriculture'),
(8, 'Quantum Computing Advances', 'Leo Carter', '2024-05-01', 'QC Today', 'https://qctoday.com/advances');

-- Populate Tools
INSERT INTO tools (project_id, name, version, url) VALUES
(1, 'TensorFlow', '2.11', 'https://tensorflow.org'),
(2, 'Hyperledger Fabric', '1.4', 'https://hyperledger.org'),
(3, 'Figma', '1.0', 'https://figma.com'),
(6, 'Arduino', '1.8.5', 'https://arduino.cc'),
(7, 'MATLAB', 'R2024a', 'https://mathworks.com');

-- Populate Repositories
INSERT INTO repositories (project_id, name, url, type) VALUES
(1, 'Neural Networks Repo', 'https://github.com/example/neural-networks', 'GitHub'),
(2, 'Blockchain Development Repo', 'https://bitbucket.org/example/blockchain', 'Bitbucket'),
(6, 'IoT Smart Agriculture Repo', 'https://github.com/example/iot-agriculture', 'GitHub'),
(7, 'Energy Optimization Repo', 'https://gitlab.com/example/energy-optimization', 'GitLab');

-- Populate News
INSERT INTO news (title, content, posted_by) VALUES
('AI in 2024', 'AI advancements continue to reshape industries.', 1),
('Blockchain Trends', 'Blockchain technology is evolving rapidly.', 3),
('IoT in Agriculture', 'IoT is driving smarter farming.', 6),
('Quantum Computing', 'Quantum Computing is gaining momentum.', 7);

-- Populate Conferences
INSERT INTO conferences (name, description, location, start_date, end_date, created_by) VALUES
('AI Summit 2024', 'A summit on the latest in AI research.', 'San Francisco', '2024-03-15', '2024-03-17', 1),
('Blockchain Expo', 'Exploring Blockchain solutions.', 'New York', '2024-05-10', '2024-05-12', 3),
('IoT World Congress', 'IoT innovations and technologies.', 'Barcelona', '2024-06-01', '2024-06-03', 6),
('Quantum Tech Conference', 'Advances in Quantum Computing.', 'Berlin', '2024-07-10', '2024-07-12', 7);

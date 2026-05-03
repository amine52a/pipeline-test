-- ============================================
-- MATCHY - Users table (auth foundation)
-- Target DB: matchy_db
-- ============================================

USE matchy_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('freelancer', 'client', 'admin') NOT NULL DEFAULT 'freelancer',
  avatar TEXT NULL,
  status ENUM('active', 'inactive', 'banned') NOT NULL DEFAULT 'active',
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default admin (password: admin123 -- change in production)
-- bcrypt hash of "admin123" with 10 rounds
INSERT IGNORE INTO users (full_name, email, password_hash, role, verified)
VALUES (
  'Admin Matchy',
  'admin@matchy.tn',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'admin',
  TRUE
);

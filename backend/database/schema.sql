-- ============================================================
--  Travel Sparsh — MySQL Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS travel_sparsh
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE travel_sparsh;

-- ── Users ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255)  NOT NULL,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  phone       VARCHAR(255)  DEFAULT NULL,
  password    VARCHAR(255)  NOT NULL,
  role        ENUM('user','admin') NOT NULL DEFAULT 'user',
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Airports ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS airports (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  iata_code   CHAR(3)      NOT NULL UNIQUE,
  name        VARCHAR(200) NOT NULL,
  city        VARCHAR(100) NOT NULL,
  state       VARCHAR(100) NOT NULL,
  country     VARCHAR(100) NOT NULL DEFAULT 'India',
  type        VARCHAR(50)  DEFAULT 'Domestic',
  status      ENUM('active', 'inactive') DEFAULT 'active',
  is_active   TINYINT(1)  NOT NULL DEFAULT 1,
  created_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Airlines ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS airlines (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(10)  NOT NULL UNIQUE,
  name        VARCHAR(150) NOT NULL,
  logo_url    VARCHAR(500) DEFAULT NULL,
  country     VARCHAR(100) DEFAULT 'India',
  type        VARCHAR(50)  DEFAULT 'LCC',
  routes      INT          DEFAULT 0,
  commission  DECIMAL(5,2) DEFAULT 0.00,
  status      ENUM('active','inactive','pending') DEFAULT 'active',
  contact     VARCHAR(200) DEFAULT NULL,
  is_domestic TINYINT(1)  NOT NULL DEFAULT 1,
  is_active   TINYINT(1)  NOT NULL DEFAULT 1,
  created_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Packages ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS packages (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(200) NOT NULL,
  description  TEXT         DEFAULT NULL,
  price        DECIMAL(10,2) NOT NULL DEFAULT 0,
  max_price    DECIMAL(10,2) NOT NULL DEFAULT 0,
  duration     VARCHAR(50)  DEFAULT NULL,
  destinations VARCHAR(500) DEFAULT NULL,
  type         VARCHAR(50)  DEFAULT 'Leisure',
  includes     TEXT         DEFAULT NULL,
  image_url    VARCHAR(500) DEFAULT NULL,
  is_active    TINYINT(1)  NOT NULL DEFAULT 1,
  status       ENUM('active', 'inactive') DEFAULT 'active',
  created_at   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;



-- ── Contact Enquiries ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  email           VARCHAR(255) NOT NULL,
  phone           VARCHAR(255) NOT NULL,
  trip_type       VARCHAR(50)  DEFAULT NULL,
  from_city       VARCHAR(100) DEFAULT NULL,
  to_city         VARCHAR(100) DEFAULT NULL,
  departure_date  DATE         DEFAULT NULL,
  return_date     DATE         DEFAULT NULL,
  adults          TINYINT UNSIGNED NOT NULL DEFAULT 1,
  children        TINYINT UNSIGNED NOT NULL DEFAULT 0,
  infants         TINYINT UNSIGNED NOT NULL DEFAULT 0,
  cabin_class     VARCHAR(50)  DEFAULT 'Economy',
  message         TEXT         DEFAULT NULL,
  status          ENUM('new','contacted','converted','closed') NOT NULL DEFAULT 'new',
  source          VARCHAR(100) DEFAULT 'website',
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- ── Newsletter Subscribers ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscribers (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email      VARCHAR(180) NOT NULL UNIQUE,
  is_active  TINYINT(1)  NOT NULL DEFAULT 1,
  created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Admin Activity Log ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_logs (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_id   INT UNSIGNED NOT NULL,
  action     VARCHAR(200) NOT NULL,
  entity     VARCHAR(100) DEFAULT NULL,
  entity_id  INT UNSIGNED DEFAULT NULL,
  details    TEXT         DEFAULT NULL,
  ip_address VARCHAR(45)  DEFAULT NULL,
  created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
--  Seed Data
-- ============================================================

-- Default admin user (password: Admin@123)
INSERT IGNORE INTO users (name, email, phone, password, role)
VALUES (
  'Admin',
  'admin@travelsparsh.com',
  '+919876543210',
  '$2b$10$wH8Xz9kQ8mYw6Q3u5Y6QvO2YF9vYJr0lC0m0XQzYlQZ1z6KXw2H7K',
  'admin'
);
-- Major Indian airports
INSERT IGNORE INTO airports (iata_code, name, city, state) VALUES
  ('DEL', 'Indira Gandhi International Airport', 'New Delhi', 'Delhi'),
  ('BOM', 'Chhatrapati Shivaji Maharaj International Airport', 'Mumbai', 'Maharashtra'),
  ('BLR', 'Kempegowda International Airport', 'Bangalore', 'Karnataka'),
  ('MAA', 'Chennai International Airport', 'Chennai', 'Tamil Nadu'),
  ('CCU', 'Netaji Subhash Chandra Bose International Airport', 'Kolkata', 'West Bengal'),
  ('HYD', 'Rajiv Gandhi International Airport', 'Hyderabad', 'Telangana'),
  ('COK', 'Cochin International Airport', 'Kochi', 'Kerala'),
  ('GOI', 'Goa International Airport', 'Goa', 'Goa'),
  ('PNQ', 'Pune Airport', 'Pune', 'Maharashtra'),
  ('AMD', 'Sardar Vallabhbhai Patel International Airport', 'Ahmedabad', 'Gujarat'),
  ('JAI', 'Jaipur International Airport', 'Jaipur', 'Rajasthan'),
  ('LKO', 'Chaudhary Charan Singh International Airport', 'Lucknow', 'Uttar Pradesh'),
  ('SXR', 'Sheikh ul-Alam Airport', 'Srinagar', 'Jammu & Kashmir'),
  ('IXC', 'Chandigarh Airport', 'Chandigarh', 'Punjab'),
  ('PAT', 'Jay Prakash Narayan Airport', 'Patna', 'Bihar'),
  ('BHO', 'Raja Bhoj Airport', 'Bhopal', 'Madhya Pradesh'),
  ('NAG', 'Dr. Babasaheb Ambedkar International Airport', 'Nagpur', 'Maharashtra'),
  ('VTZ', 'Visakhapatnam Airport', 'Visakhapatnam', 'Andhra Pradesh'),
  ('TRV', 'Trivandrum International Airport', 'Thiruvananthapuram', 'Kerala'),
  ('IXB', 'Bagdogra Airport', 'Siliguri', 'West Bengal'),
  ('GAU', 'Lokpriya Gopinath Bordoloi International Airport', 'Guwahati', 'Assam'),
  ('DED', 'Jolly Grant Airport', 'Dehradun', 'Uttarakhand'),
  ('UDR', 'Maharana Pratap Airport', 'Udaipur', 'Rajasthan'),
  ('IDR', 'Devi Ahilya Bai Holkar Airport', 'Indore', 'Madhya Pradesh');

-- Major airlines
INSERT IGNORE INTO airlines (code, name, is_domestic) VALUES
  ('6E', 'IndiGo', 1),
  ('AI', 'Air India', 1),
  ('UK', 'Vistara', 1),
  ('G8', 'GoAir', 1),
  ('I5', 'AirAsia India', 1),
  ('QP', 'Akasa Air', 1),
  ('EK', 'Emirates', 0),
  ('QR', 'Qatar Airways', 0),
  ('SQ', 'Singapore Airlines', 0),
  ('LH', 'Lufthansa', 0),
  ('BA', 'British Airways', 0),
  ('AF', 'Air France', 0),
  ('EY', 'Etihad Airways', 0),
  ('TK', 'Turkish Airlines', 0),
  ('KL', 'KLM', 0),
  ('NH', 'ANA', 0),
  ('CX', 'Cathay Pacific', 0),
  ('MH', 'Malaysia Airlines', 0),
  ('TG', 'Thai Airways', 0);

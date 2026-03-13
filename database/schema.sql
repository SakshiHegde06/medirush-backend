CREATE DATABASE IF NOT EXISTS medirush_db;
USE medirush_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(15) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('patient', 'doctor', 'admin') DEFAULT 'patient',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(15) NOT NULL,
  qualification VARCHAR(100),
  specialty VARCHAR(100),
  license_no VARCHAR(50) UNIQUE NOT NULL,
  hospital VARCHAR(150),
  experience INT DEFAULT 0,
  fee DECIMAL(10,2) DEFAULT 499.00,
  about TEXT,
  languages VARCHAR(200),
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_consultations INT DEFAULT 0,
  available BOOLEAN DEFAULT TRUE,
  status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  blood_group VARCHAR(5),
  dob DATE,
  gender ENUM('male', 'female', 'other'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  patient_name VARCHAR(100),
  doctor_name VARCHAR(100),
  hospital_name VARCHAR(150),
  specialty VARCHAR(100),
  disease VARCHAR(150),
  symptoms TEXT,
  description TEXT,
  date DATE NOT NULL,
  time VARCHAR(20) NOT NULL,
  status ENUM('pending', 'accepted', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
  token_paid BOOLEAN DEFAULT FALSE,
  reschedule_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id),
  FOREIGN KEY (doctor_id) REFERENCES users(id)
);

CREATE TABLE consultations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  patient_name VARCHAR(100),
  doctor_name VARCHAR(100),
  specialty VARCHAR(100),
  mode ENUM('Chat', 'Video', 'Audio') NOT NULL,
  reason TEXT,
  fee DECIMAL(10,2),
  status ENUM('pending', 'ongoing', 'completed') DEFAULT 'completed',
  follow_up_expiry DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id),
  FOREIGN KEY (doctor_id) REFERENCES users(id)
);

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  reference_id INT,
  reference_type ENUM('appointment', 'consultation'),
  amount DECIMAL(10,2) NOT NULL,
  method VARCHAR(50),
  status ENUM('pending', 'success', 'failed') DEFAULT 'success',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_id INT,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id),
  FOREIGN KEY (doctor_id) REFERENCES users(id)
);

INSERT INTO users (name, email, phone, password, role) VALUES
('Admin', 'admin@medirush_db.com', '9999999999', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');


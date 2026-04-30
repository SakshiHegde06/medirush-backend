-- Add consultation_chats table for 7-day follow-up chat
CREATE TABLE IF NOT EXISTS consultation_chats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  consultation_id INT NOT NULL,
  sender_id INT NOT NULL,
  sender_type ENUM('patient', 'doctor') NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- Add is_visible_to_patient and is_visible_to_doctor to consultations
ALTER TABLE consultations 
ADD COLUMN is_visible_to_patient BOOLEAN DEFAULT TRUE,
ADD COLUMN is_visible_to_doctor BOOLEAN DEFAULT TRUE;

-- Update existing consultations that are past expiry
UPDATE consultations 
SET is_visible_to_patient = FALSE, is_visible_to_doctor = FALSE 
WHERE follow_up_expiry < CURDATE();
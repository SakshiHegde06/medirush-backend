const express = require("express")
const router = express.Router()
const db = require("../config/db")
const { protect, patientOnly, doctorOnly } = require("../middleware/auth")

// Get chat messages for a consultation (only if within 7 days)
router.get("/:consultationId/chat", protect, async (req, res) => {
  try {
    const { consultationId } = req.params
    const userId = req.user.id
    
    // Check if user is part of this consultation
    const [consultation] = await db.query(
      "SELECT c.*, DATEDIFF(c.follow_up_expiry, CURDATE()) as days_left FROM consultations c WHERE c.id = ?",
      [consultationId]
    )
    
    if (!consultation.length) {
      return res.status(404).json({ message: "Consultation not found" })
    }
    
    const consult = consultation[0]
    
    // Check if user is patient or doctor of this consultation
    if (consult.patient_id !== userId && consult.doctor_id !== userId) {
      return res.status(403).json({ message: "Not authorized" })
    }
    
    // Check if still within follow-up period
    if (consult.days_left < 0) {
      return res.status(410).json({ message: "Follow-up period expired" })
    }
    
    // Get chat messages
    const [messages] = await db.query(
      "SELECT * FROM consultation_chats WHERE consultation_id = ? ORDER BY created_at ASC",
      [consultationId]
    )
    
    res.json({ 
      messages, 
      days_left: consult.days_left,
      doctor_name: consult.doctor_name,
      patient_name: consult.patient_name
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Send a chat message in a consultation
router.post("/:consultationId/chat", protect, async (req, res) => {
  try {
    const { consultationId } = req.params
    const { message } = req.body
    const userId = req.user.id
    
    if (!message?.trim()) {
      return res.status(400).json({ message: "Message is required" })
    }
    
    // Check consultation exists and user is part of it
    const [consultation] = await db.query(
      "SELECT c.*, DATEDIFF(c.follow_up_expiry, CURDATE()) as days_left FROM consultations c WHERE c.id = ?",
      [consultationId]
    )
    
    if (!consultation.length) {
      return res.status(404).json({ message: "Consultation not found" })
    }
    
    const consult = consultation[0]
    
    if (consult.patient_id !== userId && consult.doctor_id !== userId) {
      return res.status(403).json({ message: "Not authorized" })
    }
    
    if (consult.days_left < 0) {
      return res.status(410).json({ message: "Follow-up period expired" })
    }
    
    // Determine sender type
    const senderType = consult.patient_id === userId ? 'patient' : 'doctor'
    
    // Insert message
    await db.query(
      "INSERT INTO consultation_chats (consultation_id, sender_id, sender_type, message) VALUES (?, ?, ?, ?)",
      [consultationId, userId, senderType, message.trim()]
    )
    
    res.status(201).json({ message: "Message sent" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get active consultations for patient (within 7 days)
router.get("/my/active", protect, patientOnly, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.*, DATEDIFF(c.follow_up_expiry, CURDATE()) as days_left 
       FROM consultations c 
       WHERE c.patient_id = ? AND c.follow_up_expiry >= CURDATE() AND c.mode IN ('Video', 'Audio')
       ORDER BY c.created_at DESC`,
      [req.user.id]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get active consultations for doctor (within 7 days)
router.get("/doctor/active", protect, doctorOnly, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.*, DATEDIFF(c.follow_up_expiry, CURDATE()) as days_left 
       FROM consultations c 
       WHERE c.doctor_id = ? AND c.follow_up_expiry >= CURDATE() AND c.mode IN ('Video', 'Audio')
       ORDER BY c.created_at DESC`,
      [req.user.id]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Submit rating for a doctor
router.post("/:consultationId/rating", protect, patientOnly, async (req, res) => {
  try {
    const { consultationId } = req.params
    const { rating, feedback } = req.body
    const userId = req.user.id
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" })
    }
    
    // Check if consultation belongs to this patient
    const [consultation] = await db.query(
      "SELECT * FROM consultations WHERE id = ? AND patient_id = ?",
      [consultationId, userId]
    )
    
    if (!consultation.length) {
      return res.status(404).json({ message: "Consultation not found" })
    }
    
    const consult = consultation[0]
    
    // Check if already rated
    const [existing] = await db.query(
      "SELECT id FROM ratings WHERE patient_id = ? AND doctor_id = ?",
      [userId, consult.doctor_id]
    )
    
    if (existing.length) {
      return res.status(400).json({ message: "You have already rated this doctor" })
    }
    
    // Insert rating
    await db.query(
      "INSERT INTO ratings (patient_id, doctor_id, appointment_id, rating, feedback) VALUES (?, ?, ?, ?, ?)",
      [userId, consult.doctor_id, consultationId, rating, feedback || null]
    )
    
    // Update doctor average rating
    await db.query(
      `UPDATE doctors d SET rating = (
        SELECT AVG(r.rating) FROM ratings r WHERE r.doctor_id = d.user_id
      ) WHERE d.user_id = ?`,
      [consult.doctor_id]
    )
    
    res.status(201).json({ message: "Rating submitted successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get ratings for a doctor (visible to patients)
router.get("/doctor/:doctorId/ratings", async (req, res) => {
  try {
    const { doctorId } = req.params
    
    const [ratings] = await db.query(
      `SELECT r.*, u.name as patient_name 
       FROM ratings r 
       JOIN users u ON r.patient_id = u.id 
       WHERE r.doctor_id = ? 
       ORDER BY r.created_at DESC`,
      [doctorId]
    )
    
    // Calculate average
    const [[{ avg_rating, total }]] = await db.query(
      "SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM ratings WHERE doctor_id = ?",
      [doctorId]
    )
    
    res.json({
      ratings: ratings.map(r => ({
        id: r.id,
        rating: r.rating,
        feedback: r.feedback,
        patient_name: r.patient_name,
        created_at: r.created_at
      })),
      average_rating: avg_rating || 0,
      total_ratings: total || 0
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
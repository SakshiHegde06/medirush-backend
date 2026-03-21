const express = require("express")
const router = express.Router()
const db = require("../config/db")
const { protect, patientOnly } = require("../middleware/auth")

router.post("/", protect, patientOnly, async (req, res) => {
  try {
    const { doctor_id, doctor_name, specialty, mode, reason, fee, follow_up_expiry } = req.body
    const patient_id = req.user.id
    const [userRows] = await db.query("SELECT name FROM users WHERE id = ?", [patient_id])
    const patient_name = userRows[0]?.name || "Patient"
    await db.query(
      "INSERT INTO consultations (patient_id, doctor_id, patient_name, doctor_name, specialty, mode, reason, fee, follow_up_expiry, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed')",
      [patient_id, doctor_id, patient_name, doctor_name, specialty, mode, reason, fee, follow_up_expiry]
    )
    await db.query("UPDATE doctors SET total_consultations = total_consultations + 1 WHERE user_id = ?", [doctor_id])
    res.status(201).json({ message: "Consultation saved successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get("/my", protect, patientOnly, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM consultations WHERE patient_id = ? ORDER BY created_at DESC",
      [req.user.id]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get("/doctor", protect, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM consultations WHERE doctor_id = ? ORDER BY created_at DESC",
      [req.user.id]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get("/stats", protect, patientOnly, async (req, res) => {
  try {
    const [[{ token_spent }]] = await db.query(
      "SELECT COALESCE(SUM(amount), 0) as token_spent FROM payments WHERE user_id = ?",
      [req.user.id]
    )
    const [[{ consult_spent }]] = await db.query(
      "SELECT COALESCE(SUM(fee), 0) as consult_spent FROM consultations WHERE patient_id = ?",
      [req.user.id]
    )
    const [[{ total_consultations }]] = await db.query(
      "SELECT COUNT(*) as total_consultations FROM consultations WHERE patient_id = ?",
      [req.user.id]
    )
    const [[{ total_appointments }]] = await db.query(
      "SELECT COUNT(*) as total_appointments FROM appointments WHERE patient_id = ?",
      [req.user.id]
    )
    res.json({
      total_spent: Number(token_spent) + Number(consult_spent),
      token_spent: Number(token_spent),
      consult_spent: Number(consult_spent),
      total_consultations,
      total_appointments,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router

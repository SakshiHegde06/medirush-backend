const db = require("../config/db")

const submitRating = async (req, res) => {
  try {
    const { doctor_id, appointment_id, rating, feedback } = req.body
    const patient_id = req.user.id
    const [existing] = await db.query("SELECT id FROM ratings WHERE appointment_id = ? AND patient_id = ?", [appointment_id, patient_id])
    if (existing.length > 0) return res.status(409).json({ message: "You have already rated this appointment" })
    await db.query("INSERT INTO ratings (patient_id, doctor_id, appointment_id, rating, feedback) VALUES (?, ?, ?, ?, ?)",
      [patient_id, doctor_id, appointment_id, rating, feedback])
    const [[{ avg_rating, count }]] = await db.query(
      "SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM ratings WHERE doctor_id = ?", [doctor_id]
    )
    await db.query("UPDATE doctors SET rating = ?, total_consultations = ? WHERE user_id = ?",
      [parseFloat(avg_rating).toFixed(2), count, doctor_id])
    res.status(201).json({ message: "Rating submitted successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getDoctorRatings = async (req, res) => {
  try {
    const { doctorId } = req.params
    const [rows] = await db.query("SELECT * FROM ratings WHERE doctor_id = ? ORDER BY created_at DESC", [doctorId])
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { submitRating, getDoctorRatings }


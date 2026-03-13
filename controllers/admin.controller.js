const db = require("../config/db")

const getAllDoctors = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM doctors ORDER BY created_at DESC")
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const verifyDoctor = async (req, res) => {
  try {
    const { id } = req.params
    await db.query("UPDATE doctors SET status = 'verified' WHERE id = ?", [id])
    res.json({ message: "Doctor verified successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const removeDoctor = async (req, res) => {
  try {
    const { id } = req.params
    const [rows] = await db.query("SELECT user_id FROM doctors WHERE id = ?", [id])
    if (!rows.length) return res.status(404).json({ message: "Doctor not found" })
    await db.query("DELETE FROM doctors WHERE id = ?", [id])
    await db.query("DELETE FROM users WHERE id = ?", [rows[0].user_id])
    res.json({ message: "Doctor removed successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getDashboardStats = async (req, res) => {
  try {
    const [[{ total_doctors }]] = await db.query("SELECT COUNT(*) as total_doctors FROM doctors")
    const [[{ pending_doctors }]] = await db.query("SELECT COUNT(*) as pending_doctors FROM doctors WHERE status = 'pending'")
    const [[{ total_patients }]] = await db.query("SELECT COUNT(*) as total_patients FROM patients")
    const [[{ total_appointments }]] = await db.query("SELECT COUNT(*) as total_appointments FROM appointments")
    res.json({ total_doctors, pending_doctors, total_patients, total_appointments })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getAllDoctors, verifyDoctor, removeDoctor, getDashboardStats }

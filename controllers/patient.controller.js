const db = require("../config/db")

const getPatientProfile = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM patients WHERE user_id = ?", [req.user.id])
    if (!rows.length) return res.status(404).json({ message: "Patient not found" })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getPatientHistory = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM appointments WHERE patient_id = ? AND status = 'completed' ORDER BY created_at DESC",
      [req.user.id]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getAllPatients = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM patients")
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getPatientProfile, getPatientHistory, getAllPatients }

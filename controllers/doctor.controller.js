const db = require("../config/db")

const getAllDoctors = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM doctors WHERE status = 'verified'")
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getDoctorProfile = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM doctors WHERE user_id = ?", [req.user.id])
    if (!rows.length) return res.status(404).json({ message: "Doctor not found" })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const updateDoctorProfile = async (req, res) => {
  try {
    const { fee, about, available, languages } = req.body
    await db.query("UPDATE doctors SET fee = ?, about = ?, available = ?, languages = ? WHERE user_id = ?",
      [fee, about, available, languages, req.user.id])
    res.json({ message: "Profile updated successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getAllDoctors, getDoctorProfile, updateDoctorProfile }

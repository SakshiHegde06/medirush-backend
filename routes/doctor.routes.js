const express = require("express")
const router = express.Router()
const { protect, doctorOnly } = require("../middleware/auth")
const { getAllDoctors, getDoctorProfile, updateDoctorProfile } = require("../controllers/doctor.controller")
const db = require("../config/db")

router.get("/", getAllDoctors)
router.get("/profile", protect, doctorOnly, getDoctorProfile)
router.put("/profile", protect, doctorOnly, updateDoctorProfile)

router.put("/online-availability", protect, doctorOnly, async (req, res) => {
  try {
    const { online_available, online_hours, online_days } = req.body
    await db.query(
      "UPDATE doctors SET online_available = ?, online_hours = ?, online_days = ? WHERE user_id = ?",
      [online_available ? 1 : 0, online_hours, online_days, req.user.id]
    )
    res.json({ message: "Online availability updated successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router

const express = require("express")
const router = express.Router()
const { protect, adminOnly } = require("../middleware/auth")
const { getAllDoctors, verifyDoctor, removeDoctor, getDashboardStats } = require("../controllers/admin.controller")

router.get("/doctors", protect, adminOnly, getAllDoctors)
router.put("/doctors/:id/verify", protect, adminOnly, verifyDoctor)
router.delete("/doctors/:id", protect, adminOnly, removeDoctor)
router.get("/stats", protect, adminOnly, getDashboardStats)

router.get('/consultations', protect, adminOnly, async (req, res) => {
  try {
    const db = require('../config/db')
    const [rows] = await db.query('SELECT c.*, u.phone as patient_phone FROM consultations c LEFT JOIN users u ON c.patient_id = u.id ORDER BY c.created_at DESC')
    res.json(rows)
  } catch(err) { res.status(500).json({ message: err.message }) }
})

module.exports = router


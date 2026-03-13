const express = require("express")
const router = express.Router()
const { protect, adminOnly } = require("../middleware/auth")
const { getAllDoctors, verifyDoctor, removeDoctor, getDashboardStats } = require("../controllers/admin.controller")

router.get("/doctors", protect, adminOnly, getAllDoctors)
router.put("/doctors/:id/verify", protect, adminOnly, verifyDoctor)
router.delete("/doctors/:id", protect, adminOnly, removeDoctor)
router.get("/stats", protect, adminOnly, getDashboardStats)

module.exports = router

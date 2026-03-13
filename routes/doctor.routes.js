const express = require("express")
const router = express.Router()
const { protect, adminOnly, doctorOnly } = require("../middleware/auth")
const { getAllDoctors, getDoctorProfile, updateDoctorProfile } = require("../controllers/doctor.controller")

router.get("/", getAllDoctors)
router.get("/profile", protect, doctorOnly, getDoctorProfile)
router.put("/profile", protect, doctorOnly, updateDoctorProfile)

module.exports = router

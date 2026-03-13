const express = require("express")
const router = express.Router()
const { protect, adminOnly, patientOnly } = require("../middleware/auth")
const { getPatientProfile, getPatientHistory, getAllPatients } = require("../controllers/patient.controller")

router.get("/profile", protect, patientOnly, getPatientProfile)
router.get("/history", protect, patientOnly, getPatientHistory)
router.get("/all", protect, adminOnly, getAllPatients)

module.exports = router

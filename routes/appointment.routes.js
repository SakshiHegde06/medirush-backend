const express = require("express")
const router = express.Router()
const { protect, adminOnly, doctorOnly, patientOnly } = require("../middleware/auth")
const { bookAppointment, getMyAppointments, getDoctorAppointments, updateAppointmentStatus, rescheduleAppointment, getAllAppointments } = require("../controllers/appointment.controller")

router.post("/", protect, patientOnly, bookAppointment)
router.get("/my", protect, patientOnly, getMyAppointments)
router.get("/doctor", protect, doctorOnly, getDoctorAppointments)
router.get("/all", protect, adminOnly, getAllAppointments)
router.put("/:id/status", protect, doctorOnly, updateAppointmentStatus)
router.put("/:id/reschedule", protect, patientOnly, rescheduleAppointment)

module.exports = router

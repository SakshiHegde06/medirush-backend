const express = require("express")
const router = express.Router()
const { registerPatient, loginPatient, registerDoctor, loginDoctor, loginAdmin } = require("../controllers/auth.controller")

router.post("/patient/register", registerPatient)
router.post("/patient/login", loginPatient)
router.post("/doctor/register", registerDoctor)
router.post("/doctor/login", loginDoctor)
router.post("/admin/login", loginAdmin)

module.exports = router

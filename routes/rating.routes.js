const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/auth")
const { submitRating, getDoctorRatings } = require("../controllers/rating.controller")

router.post("/", protect, submitRating)
router.get("/:doctorId", getDoctorRatings)

module.exports = router

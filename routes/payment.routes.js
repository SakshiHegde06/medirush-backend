const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/auth")
const { createPayment, getMyPayments } = require("../controllers/payment.controller")

router.post("/", protect, createPayment)
router.get("/my", protect, getMyPayments)

module.exports = router

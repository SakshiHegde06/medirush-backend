const express = require("express")
const router = express.Router()
const db = require("../config/db")
const { protect, doctorOnly } = require("../middleware/auth")

router.post("/slots", protect, doctorOnly, async (req, res) => {
  try {
    const { slots } = req.body
    const doctor_id = req.user.id
    for (const [day, times] of Object.entries(slots)) {
      const slotJson = JSON.stringify(times)
      await db.query(
        "INSERT INTO doctor_slots (doctor_id, day, slots) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE slots = ?, updated_at = NOW()",
        [doctor_id, day, slotJson, slotJson]
      )
    }
    res.json({ message: "Availability saved successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get("/slots/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params
    const [rows] = await db.query("SELECT day, slots FROM doctor_slots WHERE doctor_id = ?", [doctorId])
    const result = {}
    rows.forEach(r => {
      try {
        result[r.day] = typeof r.slots === "string" ? JSON.parse(r.slots) : r.slots
      } catch {
        result[r.day] = []
      }
    })
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get already booked slots for a doctor on a specific date
router.get("/booked/:doctorId/:date", async (req, res) => {
  try {
    const { doctorId, date } = req.params
    const [rows] = await db.query(
      "SELECT time FROM appointments WHERE doctor_id = ? AND date = ? AND status NOT IN ('rejected', 'cancelled')",
      [doctorId, date]
    )
    const bookedTimes = rows.map(r => r.time)
    res.json({ bookedSlots: bookedTimes })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router

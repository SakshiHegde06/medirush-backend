const db = require("../config/db")

const createPayment = async (req, res) => {
  try {
    const { reference_id, reference_type, amount, method } = req.body
    const user_id = req.user.id
    await db.query(
      "INSERT INTO payments (user_id, reference_id, reference_type, amount, method, status) VALUES (?, ?, ?, ?, ?, 'success')",
      [user_id, reference_id, reference_type, amount, method]
    )
    res.status(201).json({ message: "Payment recorded successfully", status: "success" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getMyPayments = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC", [req.user.id])
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { createPayment, getMyPayments }

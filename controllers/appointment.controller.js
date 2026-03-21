const db = require("../config/db")

const bookAppointment = async (req, res) => {
  try {
    const { doctor_id, patient_name, doctor_name, hospital_name, specialty, disease, symptoms, description, date, time } = req.body
    const patient_id = req.user.id
    const [conflict] = await db.query(
      "SELECT id FROM appointments WHERE doctor_id = ? AND date = ? AND time = ? AND status NOT IN ('rejected','cancelled')",
      [doctor_id, date, time]
    )
    if (conflict.length > 0) {
      return res.status(409).json({ message: "This time slot is already booked. Please choose another slot." })
    }
    await db.query(
      "INSERT INTO appointments (patient_id, doctor_id, patient_name, doctor_name, hospital_name, specialty, disease, symptoms, description, date, time, token_paid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true)",
      [patient_id, doctor_id, patient_name, doctor_name, hospital_name, specialty, disease, JSON.stringify(symptoms), description, date, time]
    )
    res.status(201).json({ message: "Appointment booked successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getMyAppointments = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM appointments WHERE patient_id = ? ORDER BY created_at DESC", [req.user.id])
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getDoctorAppointments = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM appointments WHERE doctor_id = ? ORDER BY created_at DESC", [req.user.id])
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    await db.query("UPDATE appointments SET status = ? WHERE id = ?", [status, id])
    const [rows] = await db.query("SELECT * FROM appointments WHERE id = ?", [id])
    const apt = rows[0]
    if (apt) {
      const io = req.app.get("io")
      const connectedUsers = req.app.get("connectedUsers")
      const patientSocketId = connectedUsers[apt.patient_id]
      if (patientSocketId) {
        io.to(patientSocketId).emit("appointment_notification", {
          message: status === "accepted"
            ? `Dr. ${apt.doctor_name} accepted your appointment!`
            : `Dr. ${apt.doctor_name} declined your appointment.`,
          status,
        })
      }
    }
    res.json({ message: `Appointment ${status}` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params
    const patient_id = req.user.id
    const [rows] = await db.query("SELECT * FROM appointments WHERE id = ? AND patient_id = ?", [id, patient_id])
    if (!rows.length) return res.status(404).json({ message: "Appointment not found" })
    const apt = rows[0]
    if (apt.status === "completed") return res.status(400).json({ message: "Cannot cancel a completed appointment" })
    if (apt.status === "cancelled") return res.status(400).json({ message: "Already cancelled" })
    const aptDateTime = new Date(`${apt.date}T${apt.time}`)
    const hoursLeft = (aptDateTime - new Date()) / (1000 * 60 * 60)
    if (hoursLeft < 24) return res.status(400).json({ message: "Cannot cancel within 24 hours. Token is non-refundable." })
    await db.query("UPDATE appointments SET status = 'cancelled' WHERE id = ?", [id])
    const io = req.app.get("io")
    const connectedUsers = req.app.get("connectedUsers")
    const doctorSocketId = connectedUsers[apt.doctor_id]
    if (doctorSocketId) {
      io.to(doctorSocketId).emit("appointment_notification", {
        message: `${apt.patient_name} cancelled their appointment on ${apt.date} at ${apt.time}`,
        status: "cancelled",
      })
    }
    res.json({ message: "Appointment cancelled successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const markCompleted = async (req, res) => {
  try {
    const { id } = req.params
    const [rows] = await db.query("SELECT * FROM appointments WHERE id = ?", [id])
    if (!rows.length) return res.status(404).json({ message: "Appointment not found" })
    const apt = rows[0]
    if (apt.status === "cancelled") return res.status(400).json({ message: "Cannot complete a cancelled appointment" })
    if (apt.status === "completed") return res.status(400).json({ message: "Appointment already completed" })
    await db.query("UPDATE appointments SET status = 'completed' WHERE id = ?", [id])
    await db.query("UPDATE doctors SET total_consultations = total_consultations + 1 WHERE user_id = ?", [apt.doctor_id])
    const io = req.app.get("io")
    const connectedUsers = req.app.get("connectedUsers")
    const patientSocketId = connectedUsers[apt.patient_id]
    if (patientSocketId) {
      io.to(patientSocketId).emit("appointment_notification", {
        message: `Your appointment with Dr. ${apt.doctor_name} is completed! Please rate your experience.`,
        status: "completed",
      })
    }
    res.json({ message: "Appointment marked as completed" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params
    const { date, time } = req.body
    const [rows] = await db.query("SELECT * FROM appointments WHERE id = ?", [id])
    if (!rows.length) return res.status(404).json({ message: "Appointment not found" })
    const apt = rows[0]
    const hoursLeft = (new Date(`${apt.date}T${apt.time}`) - new Date()) / (1000 * 60 * 60)
    if (hoursLeft < 24) return res.status(400).json({ message: "Cannot reschedule within 24 hours" })
    const [conflict] = await db.query(
      "SELECT id FROM appointments WHERE doctor_id = ? AND date = ? AND time = ? AND status NOT IN ('rejected','cancelled') AND id != ?",
      [apt.doctor_id, date, time, id]
    )
    if (conflict.length > 0) return res.status(409).json({ message: "That slot is already booked." })
    await db.query("UPDATE appointments SET date = ?, time = ? WHERE id = ?", [date, time, id])
    res.json({ message: "Appointment rescheduled successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getAllAppointments = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM appointments ORDER BY created_at DESC")
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  bookAppointment, getMyAppointments, getDoctorAppointments,
  updateAppointmentStatus, cancelAppointment, markCompleted,
  rescheduleAppointment, getAllAppointments
}

const db = require("../config/db")

const bookAppointment = async (req, res) => {
  try {
    const { doctor_id, patient_name, doctor_name, hospital_name, specialty, disease, symptoms, description, date, time } = req.body
    const patient_id = req.user.id
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
    const [doctorRows] = await db.query("SELECT id FROM doctors WHERE user_id = ?", [req.user.id])
    if (!doctorRows.length) return res.status(404).json({ message: "Doctor not found" })
    const [rows] = await db.query("SELECT * FROM appointments WHERE doctor_id = ? ORDER BY created_at DESC", [req.user.id])
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body
    const { id } = req.params
    await db.query("UPDATE appointments SET status = ? WHERE id = ?", [status, id])
    res.json({ message: `Appointment ${status} successfully` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const rescheduleAppointment = async (req, res) => {
  try {
    const { date, time } = req.body
    const { id } = req.params
    const [rows] = await db.query("SELECT * FROM appointments WHERE id = ? AND patient_id = ?", [id, req.user.id])
    if (!rows.length) return res.status(404).json({ message: "Appointment not found" })
    const apt = rows[0]
    const aptDate = new Date(`${apt.date}T${apt.time}`)
    const now = new Date()
    const diff = (aptDate - now) / (1000 * 60 * 60)
    if (diff < 24) return res.status(400).json({ message: "Cannot reschedule within 24 hours of appointment" })
    await db.query("UPDATE appointments SET date = ?, time = ?, reschedule_count = reschedule_count + 1 WHERE id = ?", [date, time, id])
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

const markCompleted = async (req, res) => {
  try {
    const { id } = req.params
    const [rows] = await db.query("SELECT * FROM appointments WHERE id = ?", [id])
    if (!rows.length) return res.status(404).json({ message: "Appointment not found" })
    const apt = rows[0]
    await db.query("UPDATE appointments SET status = 'completed' WHERE id = ?", [id])
    await db.query("UPDATE doctors SET total_consultations = total_consultations + 1 WHERE user_id = ?", [apt.doctor_id])
    res.json({ message: "Appointment marked as completed" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { markCompleted, bookAppointment, getMyAppointments, getDoctorAppointments, updateAppointmentStatus, rescheduleAppointment, getAllAppointments }



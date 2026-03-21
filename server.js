const express = require("express")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")
require("dotenv").config()
require("./config/db")

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
})

// Store connected users: userId -> socketId
const connectedUsers = {}

io.on("connection", (socket) => {
  console.log("New socket connection:", socket.id)

  // Register user with their userId
  socket.on("register", (userId) => {
    connectedUsers[userId] = socket.id
    console.log(`User ${userId} registered with socket ${socket.id}`)
  })

  // Patient calling doctor
  socket.on("call_doctor", (data) => {
    // data: { doctorUserId, patientName, patientId, mode, doctorId }
    const doctorSocketId = connectedUsers[data.doctorUserId]
    if (doctorSocketId) {
      io.to(doctorSocketId).emit("incoming_call", {
        patientName: data.patientName,
        patientId: data.patientId,
        mode: data.mode,
        doctorId: data.doctorId,
        roomId: data.roomId,
      })
      console.log(`Call from ${data.patientName} to doctor socket ${doctorSocketId}`)
    } else {
      socket.emit("doctor_offline", { message: "Doctor is currently offline" })
    }
  })

  // Doctor accepts call
  socket.on("accept_call", (data) => {
    const patientSocketId = connectedUsers[data.patientId]
    if (patientSocketId) {
      io.to(patientSocketId).emit("call_accepted", { roomId: data.roomId })
    }
  })

  // Doctor rejects call
  socket.on("reject_call", (data) => {
    const patientSocketId = connectedUsers[data.patientId]
    if (patientSocketId) {
      io.to(patientSocketId).emit("call_rejected")
    }
  })

  // Appointment notifications
  socket.on("appointment_update", (data) => {
    // data: { patientId, doctorName, status }
    const patientSocketId = connectedUsers[data.patientId]
    if (patientSocketId) {
      io.to(patientSocketId).emit("appointment_notification", {
        message: data.status === "accepted"
          ? `Dr. ${data.doctorName} accepted your appointment!`
          : `Dr. ${data.doctorName} declined your appointment.`,
        status: data.status,
      })
    }
  })

  socket.on("disconnect", () => {
    // Remove from connected users
    for (const [userId, socketId] of Object.entries(connectedUsers)) {
      if (socketId === socket.id) {
        delete connectedUsers[userId]
        console.log(`User ${userId} disconnected`)
        break
      }
    }
  })
})

// Make io accessible in routes
app.set("io", io)
app.set("connectedUsers", connectedUsers)

app.use(cors())
app.use(express.json())

app.use("/api/auth", require("./routes/auth.routes"))
app.use("/api/appointments", require("./routes/appointment.routes"))
app.use("/api/doctors", require("./routes/doctor.routes"))
app.use("/api/patients", require("./routes/patient.routes"))
app.use("/api/admin", require("./routes/admin.routes"))
app.use("/api/ratings", require("./routes/rating.routes"))
app.use("/api/payments", require("./routes/payment.routes"))
app.use("/api/slots", require("./routes/slots.routes"))
app.use("/api/consultations", require("./routes/consultation.routes"))

app.get("/", (req, res) => res.json({ message: "MediRush API running!", version: "1.0.0" }))
app.use(require("./middleware/errorHandler"))

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))


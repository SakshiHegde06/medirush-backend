const express = require("express")
const cors = require("cors")
require("dotenv").config()
require("./config/db")

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/auth", require("./routes/auth.routes"))
app.use("/api/appointments", require("./routes/appointment.routes"))
app.use("/api/doctors", require("./routes/doctor.routes"))
app.use("/api/patients", require("./routes/patient.routes"))
app.use("/api/admin", require("./routes/admin.routes"))
app.use("/api/ratings", require("./routes/rating.routes"))
app.use("/api/payments", require("./routes/payment.routes"))

app.get("/", (req, res) => res.json({ message: "🏥 MediRush API running!", version: "1.0.0" }))
app.use(require("./middleware/errorHandler"))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))

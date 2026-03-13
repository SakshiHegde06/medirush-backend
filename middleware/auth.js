const jwt = require("jsonwebtoken")
require("dotenv").config()

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.status(401).json({ message: "No token, access denied" })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ message: "Invalid or expired token" })
  }
}

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Admin access only" })
  next()
}

const doctorOnly = (req, res, next) => {
  if (req.user?.role !== "doctor") return res.status(403).json({ message: "Doctor access only" })
  next()
}

const patientOnly = (req, res, next) => {
  if (req.user?.role !== "patient") return res.status(403).json({ message: "Patient access only" })
  next()
}

module.exports = { protect, adminOnly, doctorOnly, patientOnly }

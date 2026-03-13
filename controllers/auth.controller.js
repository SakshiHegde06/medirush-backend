const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const db = require("../config/db")
require("dotenv").config()

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )

const registerPatient = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body
    if (!name || !email || !phone || !password)
      return res.status(400).json({ message: "All fields are required" })
    const [existing] = await db.query("SELECT id FROM users WHERE email = ? OR phone = ?", [email, phone])
    if (existing.length > 0)
      return res.status(409).json({ message: "Email or phone already registered" })
    const hashed = await bcrypt.hash(password, 10)
    const [result] = await db.query(
      "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, 'patient')",
      [name, email, phone, hashed]
    )
    const userId = result.insertId
    await db.query("INSERT INTO patients (user_id, name, email, phone) VALUES (?, ?, ?, ?)", [userId, name, email, phone])
    const user = { id: userId, email, role: "patient" }
    res.status(201).json({ message: "Patient registered successfully", token: generateToken(user), user: { id: userId, name, email, phone, role: "patient" } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body
    const [rows] = await db.query("SELECT * FROM users WHERE email = ? AND role = 'patient'", [email])
    if (rows.length === 0) return res.status(404).json({ message: "Patient not found" })
    const user = rows[0]
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: "Invalid password" })
    res.json({ message: "Login successful", token: generateToken(user), user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const registerDoctor = async (req, res) => {
  try {
    const { name, email, phone, password, qualification, specialty, license_no, hospital, experience, fee, about, languages } = req.body
    if (!name || !email || !phone || !password || !license_no || !specialty)
      return res.status(400).json({ message: "Required fields missing" })
    const [existing] = await db.query("SELECT id FROM users WHERE email = ? OR phone = ?", [email, phone])
    if (existing.length > 0)
      return res.status(409).json({ message: "Email or phone already registered" })
    const [licCheck] = await db.query("SELECT id FROM doctors WHERE license_no = ?", [license_no])
    if (licCheck.length > 0)
      return res.status(409).json({ message: "License number already registered" })
    const hashed = await bcrypt.hash(password, 10)
    const [result] = await db.query(
      "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, 'doctor')",
      [name, email, phone, hashed]
    )
    const userId = result.insertId
    await db.query(
      "INSERT INTO doctors (user_id, name, email, phone, qualification, specialty, license_no, hospital, experience, fee, about, languages) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [userId, name, email, phone, qualification, specialty, license_no, hospital, experience || 0, fee || 499, about || "", languages || "English"]
    )
    res.status(201).json({ message: "Doctor registered. Pending admin verification." })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body
    const [rows] = await db.query("SELECT * FROM users WHERE email = ? AND role = 'doctor'", [email])
    if (rows.length === 0) return res.status(404).json({ message: "Doctor not found" })
    const user = rows[0]
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: "Invalid password" })
    const [docRows] = await db.query("SELECT * FROM doctors WHERE user_id = ?", [user.id])
    const doctor = docRows[0]
    if (doctor.status === "pending")
      return res.status(403).json({ message: "Your account is pending admin verification" })
    res.json({ message: "Login successful", token: generateToken(user), user: { id: user.id, name: user.name, email: user.email, role: "doctor", doctor } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body
    const [rows] = await db.query("SELECT * FROM users WHERE email = ? AND role = 'admin'", [email])
    if (rows.length === 0) return res.status(404).json({ message: "Admin not found" })
    const user = rows[0]
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: "Invalid password" })
    res.json({ message: "Admin login successful", token: generateToken(user), user: { id: user.id, name: user.name, email: user.email, role: "admin" } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { registerPatient, loginPatient, registerDoctor, loginDoctor, loginAdmin }

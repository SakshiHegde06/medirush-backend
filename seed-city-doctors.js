const bcrypt = require("bcryptjs")
const db = require("./config/db")

const doctors = [
  { name: "Dr. Sunita Patil", email: "sunita.patil@hinduja.com", phone: "9702002001", spec: "General Medicine", lic: "MH-2014-10101", hospital: "Hinduja Hospital", exp: 11, fee: 449, rating: 4.6, cons: 3800, langs: "English, Hindi, Marathi" },
  { name: "Dr. Rajan Sharma", email: "rajan.sharma@lilavati.com", phone: "9702002002", spec: "General Medicine", lic: "MH-2016-10102", hospital: "Lilavati Hospital", exp: 8, fee: 499, rating: 4.5, cons: 2100, langs: "English, Hindi, Marathi" },
  { name: "Dr. Meena Joshi", email: "meena.joshi@nanavati.com", phone: "9702002003", spec: "General Medicine", lic: "MH-2013-10103", hospital: "Nanavati Hospital", exp: 13, fee: 399, rating: 4.7, cons: 4200, langs: "English, Hindi, Marathi, Gujarati" },
  { name: "Dr. Amit Kulkarni", email: "amit.kulkarni@bombay.com", phone: "9702002004", spec: "General Medicine", lic: "MH-2017-10104", hospital: "Bombay Hospital", exp: 7, fee: 449, rating: 4.4, cons: 1900, langs: "English, Hindi, Marathi" },
  { name: "Dr. Priya Wagh", email: "priya.wagh@breach.com", phone: "9702002005", spec: "General Medicine", lic: "MH-2015-10105", hospital: "Breach Candy Hospital", exp: 10, fee: 549, rating: 4.6, cons: 3100, langs: "English, Hindi, Marathi, Gujarati" },
  // Delhi General Medicine
  { name: "Dr. Suresh Tyagi", email: "suresh.tyagi@aiims.com", phone: "9811002001", spec: "General Medicine", lic: "DL-2013-10201", hospital: "AIIMS Delhi", exp: 13, fee: 399, rating: 4.7, cons: 5200, langs: "English, Hindi, Punjabi" },
  { name: "Dr. Nisha Malhotra", email: "nisha.malhotra@maxdl.com", phone: "9811002002", spec: "General Medicine", lic: "DL-2015-10202", hospital: "Max Hospital Saket", exp: 10, fee: 449, rating: 4.6, cons: 3800, langs: "English, Hindi" },
  // Hyderabad General Medicine
  { name: "Dr. Ramya Reddy", email: "ramya.reddy@yashoda.com", phone: "9940002001", spec: "General Medicine", lic: "TS-2014-10301", hospital: "Yashoda Hospital", exp: 11, fee: 399, rating: 4.6, cons: 3500, langs: "English, Telugu, Hindi" },
  { name: "Dr. Krishna Rao", email: "krishna.rao@kims.com", phone: "9940002002", spec: "General Medicine", lic: "TS-2016-10302", hospital: "KIMS Hospital", exp: 8, fee: 449, rating: 4.5, cons: 2200, langs: "English, Telugu, Urdu" },
  // Chennai General Medicine
  { name: "Dr. Vijay Kumar", email: "vijay.kumar@kauvery.com", phone: "9841002001", spec: "General Medicine", lic: "TN-2014-10401", hospital: "Kauvery Hospital", exp: 11, fee: 399, rating: 4.6, cons: 3600, langs: "English, Tamil" },
  { name: "Dr. Lakshmi Nair", email: "lakshmi.nair@billroth.com", phone: "9841002002", spec: "General Medicine", lic: "TN-2016-10402", hospital: "Billroth Hospital", exp: 8, fee: 349, rating: 4.4, cons: 2100, langs: "English, Tamil, Malayalam" },
  // Pune General Medicine
  { name: "Dr. Prasad Deshpande", email: "prasad.deshpande@rubyhall.com", phone: "9201002001", spec: "General Medicine", lic: "MH-2014-10501", hospital: "Ruby Hall Clinic", exp: 11, fee: 399, rating: 4.6, cons: 3800, langs: "English, Marathi, Hindi" },
  { name: "Dr. Smita Kulkarni", email: "smita.kulkarni@sahyadri.com", phone: "9201002002", spec: "General Medicine", lic: "MH-2016-10502", hospital: "Sahyadri Hospital", exp: 8, fee: 449, rating: 4.5, cons: 2400, langs: "English, Marathi" },
]

async function seed() {
  const hash = await bcrypt.hash("Doctor@123", 10)
  let success = 0
  let skipped = 0
  for (const doc of doctors) {
    try {
      const [existing] = await db.query("SELECT id FROM users WHERE email = ? OR phone = ?", [doc.email, doc.phone])
      if (existing.length > 0) { skipped++; continue }
      const [result] = await db.query("INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, 'doctor')", [doc.name, doc.email, doc.phone, hash])
      const userId = result.insertId
      await db.query(
        "INSERT INTO doctors (user_id, name, email, phone, qualification, specialty, license_no, hospital, experience, fee, rating, total_consultations, status, available, languages, about) VALUES (?, ?, ?, ?, 'MBBS, MD', ?, ?, ?, ?, ?, ?, ?, 'verified', true, ?, ?)",
        [userId, doc.name, doc.email, doc.phone, doc.spec, doc.lic, doc.hospital, doc.exp, doc.fee, doc.rating, doc.cons, doc.langs, `${doc.exp}+ years experienced ${doc.spec} specialist at ${doc.hospital}.`]
      )
      success++
      console.log(`✅ Added: ${doc.name} - ${doc.hospital}`)
    } catch (err) {
      console.log(`❌ Failed: ${doc.name} — ${err.message}`)
    }
  }
  console.log(`\n🎉 Done! ${success} added, ${skipped} skipped.`)
  process.exit()
}
seed()

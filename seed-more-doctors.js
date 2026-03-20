const bcrypt = require("bcryptjs")
const db = require("./config/db")

const doctors = [
  // MUMBAI
  { name: "Dr. Rahul Mehta", email: "rahul.mehta@lilavati.com", phone: "9702001001", spec: "Cardiology", lic: "MH-2013-20001", hospital: "Lilavati Hospital", exp: 13, fee: 849, rating: 4.8, cons: 4100, langs: "English, Hindi, Marathi" },
  { name: "Dr. Priya Desai", email: "priya.desai@kokilaben.com", phone: "9702001002", spec: "Gastroenterology", lic: "MH-2015-30001", hospital: "Kokilaben Hospital", exp: 10, fee: 749, rating: 4.7, cons: 3200, langs: "English, Hindi, Marathi, Gujarati" },
  { name: "Dr. Amit Shah", email: "amit.shah@hinduja.com", phone: "9702001003", spec: "Neurology", lic: "MH-2012-40001", hospital: "Hinduja Hospital", exp: 14, fee: 899, rating: 4.9, cons: 5100, langs: "English, Hindi, Marathi, Gujarati" },
  { name: "Dr. Sneha Joshi", email: "sneha.joshi@nanavati.com", phone: "9702001004", spec: "Dermatology", lic: "MH-2017-60001", hospital: "Nanavati Hospital", exp: 8, fee: 599, rating: 4.5, cons: 2100, langs: "English, Hindi, Marathi" },
  { name: "Dr. Vikram Nair", email: "vikram.nair@wockhardt.com", phone: "9702001005", spec: "Pulmonology", lic: "MH-2016-50001", hospital: "Wockhardt Hospital", exp: 9, fee: 649, rating: 4.6, cons: 2800, langs: "English, Hindi, Malayalam" },
  { name: "Dr. Kavya Iyer", email: "kavya.iyer@bombay.com", phone: "9702001006", spec: "General Medicine", lic: "MH-2014-10001", hospital: "Bombay Hospital", exp: 11, fee: 449, rating: 4.5, cons: 3900, langs: "English, Hindi, Tamil" },
  { name: "Dr. Rohan Kapoor", email: "rohan.kapoor@breach.com", phone: "9702001007", spec: "Psychiatry", lic: "MH-2018-70001", hospital: "Breach Candy Hospital", exp: 7, fee: 699, rating: 4.4, cons: 1600, langs: "English, Hindi, Marathi" },

  // DELHI
  { name: "Dr. Suneel Sharma", email: "suneel.sharma@aiims.com", phone: "9811001001", spec: "Neurology", lic: "DL-2010-40001", hospital: "AIIMS Delhi", exp: 18, fee: 999, rating: 4.9, cons: 8200, langs: "English, Hindi, Punjabi" },
  { name: "Dr. Meera Gupta", email: "meera.gupta@apollodl.com", phone: "9811001002", spec: "Cardiology", lic: "DL-2013-20001", hospital: "Apollo Hospital Delhi", exp: 13, fee: 849, rating: 4.8, cons: 4800, langs: "English, Hindi" },
  { name: "Dr. Arjun Singh", email: "arjun.singh@fortisdl.com", phone: "9811001003", spec: "Gastroenterology", lic: "DL-2015-30001", hospital: "Fortis Escorts", exp: 10, fee: 749, rating: 4.6, cons: 3100, langs: "English, Hindi, Punjabi" },
  { name: "Dr. Pooja Malhotra", email: "pooja.malhotra@max.com", phone: "9811001004", spec: "Dermatology", lic: "DL-2017-60001", hospital: "Max Hospital Saket", exp: 8, fee: 649, rating: 4.5, cons: 2200, langs: "English, Hindi" },
  { name: "Dr. Karan Bhatia", email: "karan.bhatia@blk.com", phone: "9811001005", spec: "Urology", lic: "DL-2014-80001", hospital: "BLK Super Speciality", exp: 12, fee: 799, rating: 4.7, cons: 3800, langs: "English, Hindi, Punjabi" },
  { name: "Dr. Nisha Verma", email: "nisha.verma@gangaram.com", phone: "9811001006", spec: "Psychiatry", lic: "DL-2016-70001", hospital: "Sir Ganga Ram Hospital", exp: 9, fee: 649, rating: 4.5, cons: 2500, langs: "English, Hindi" },
  { name: "Dr. Tarun Khanna", email: "tarun.khanna@indraprastha.com", phone: "9811001007", spec: "General Medicine", lic: "DL-2012-10001", hospital: "Indraprastha Apollo", exp: 14, fee: 499, rating: 4.6, cons: 5200, langs: "English, Hindi, Punjabi" },

  // HYDERABAD
  { name: "Dr. Ravi Kumar", email: "ravi.kumar@apollohyd.com", phone: "9940001001", spec: "Cardiology", lic: "TS-2013-20001", hospital: "Apollo Hospital Jubilee Hills", exp: 13, fee: 799, rating: 4.8, cons: 4300, langs: "English, Telugu, Hindi" },
  { name: "Dr. Padma Reddy", email: "padma.reddy@kims.com", phone: "9940001002", spec: "Gastroenterology", lic: "TS-2015-30001", hospital: "KIMS Hospital", exp: 10, fee: 649, rating: 4.6, cons: 2900, langs: "English, Telugu, Urdu" },
  { name: "Dr. Suresh Rao", email: "suresh.rao@yashoda.com", phone: "9940001003", spec: "Neurology", lic: "TS-2012-40001", hospital: "Yashoda Hospital", exp: 14, fee: 849, rating: 4.7, cons: 4800, langs: "English, Telugu, Hindi" },
  { name: "Dr. Anitha Sharma", email: "anitha.sharma@care.com", phone: "9940001004", spec: "Dermatology", lic: "TS-2017-60001", hospital: "Care Hospital", exp: 8, fee: 549, rating: 4.5, cons: 2100, langs: "English, Telugu, Hindi" },
  { name: "Dr. Kishore Babu", email: "kishore.babu@omega.com", phone: "9940001005", spec: "Psychiatry", lic: "TS-2016-70001", hospital: "Omega Hospital", exp: 9, fee: 599, rating: 4.4, cons: 1900, langs: "English, Telugu, Urdu" },
  { name: "Dr. Lakshmi Prasad", email: "lakshmi.prasad@nizam.com", phone: "9940001006", spec: "General Medicine", lic: "TS-2011-10001", hospital: "Nizam Institute", exp: 15, fee: 449, rating: 4.7, cons: 5800, langs: "English, Telugu, Hindi, Urdu" },

  // CHENNAI
  { name: "Dr. Senthil Kumar", email: "senthil.kumar@apollochn.com", phone: "9841001001", spec: "Cardiology", lic: "TN-2013-20001", hospital: "Apollo Hospital Chennai", exp: 13, fee: 849, rating: 4.9, cons: 5100, langs: "English, Tamil, Telugu" },
  { name: "Dr. Kavitha Rajan", email: "kavitha.rajan@fortismalar.com", phone: "9841001002", spec: "Gastroenterology", lic: "TN-2015-30001", hospital: "Fortis Malar Hospital", exp: 10, fee: 699, rating: 4.7, cons: 3200, langs: "English, Tamil" },
  { name: "Dr. Murali Krishnan", email: "murali.krishnan@miot.com", phone: "9841001003", spec: "Musculoskeletal", lic: "TN-2012-90001", hospital: "MIOT Hospital", exp: 14, fee: 799, rating: 4.8, cons: 4600, langs: "English, Tamil, Telugu" },
  { name: "Dr. Priya Sundar", email: "priya.sundar@vijaya.com", phone: "9841001004", spec: "General Medicine", lic: "TN-2016-10001", hospital: "Vijaya Hospital", exp: 9, fee: 399, rating: 4.5, cons: 3100, langs: "English, Tamil" },
  { name: "Dr. Arun Babu", email: "arun.babu@gleneagles.com", phone: "9841001005", spec: "Neurology", lic: "TN-2014-40001", hospital: "Gleneagles Global Health City", exp: 12, fee: 849, rating: 4.7, cons: 3900, langs: "English, Tamil, Telugu" },
  { name: "Dr. Meenakshi Iyer", email: "meenakshi.iyer@srm.com", phone: "9841001006", spec: "Psychiatry", lic: "TN-2018-70001", hospital: "SRM Hospital", exp: 7, fee: 599, rating: 4.4, cons: 1700, langs: "English, Tamil" },

  // PUNE
  { name: "Dr. Suhas Joshi", email: "suhas.joshi@rubyhall.com", phone: "9201001001", spec: "Cardiology", lic: "MH-2013-20101", hospital: "Ruby Hall Clinic", exp: 13, fee: 799, rating: 4.8, cons: 4200, langs: "English, Marathi, Hindi" },
  { name: "Dr. Anjali Kulkarni", email: "anjali.kulkarni@jehangir.com", phone: "9201001002", spec: "Gastroenterology", lic: "MH-2015-30101", hospital: "Jehangir Hospital", exp: 10, fee: 649, rating: 4.6, cons: 3100, langs: "English, Marathi, Hindi" },
  { name: "Dr. Nikhil Patil", email: "nikhil.patil@sahyadri.com", phone: "9201001003", spec: "Neurology", lic: "MH-2012-40101", hospital: "Sahyadri Hospital", exp: 14, fee: 849, rating: 4.7, cons: 4500, langs: "English, Marathi, Hindi" },
  { name: "Dr. Smita Deshpande", email: "smita.deshpande@deenanath.com", phone: "9201001004", spec: "Dermatology", lic: "MH-2017-60101", hospital: "Deenanath Mangeshkar Hospital", exp: 8, fee: 599, rating: 4.5, cons: 2300, langs: "English, Marathi" },
  { name: "Dr. Rahul Chitale", email: "rahul.chitale@columbiaasia.com", phone: "9201001005", spec: "General Medicine", lic: "MH-2014-10101", hospital: "Columbia Asia Pune", exp: 11, fee: 449, rating: 4.6, cons: 3800, langs: "English, Marathi, Hindi" },
  { name: "Dr. Varsha Gokhale", email: "varsha.gokhale@poona.com", phone: "9201001006", spec: "Psychiatry", lic: "MH-2016-70101", hospital: "Poona Hospital", exp: 9, fee: 599, rating: 4.4, cons: 2100, langs: "English, Marathi, Hindi" },
]

async function seed() {
  const hash = await bcrypt.hash("Doctor@123", 10)
  let success = 0
  let skipped = 0

  for (const doc of doctors) {
    try {
      const [existing] = await db.query("SELECT id FROM users WHERE email = ? OR phone = ?", [doc.email, doc.phone])
      if (existing.length > 0) { skipped++; continue }

      const [result] = await db.query(
        "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, 'doctor')",
        [doc.name, doc.email, doc.phone, hash]
      )
      const userId = result.insertId
      await db.query(
        "INSERT INTO doctors (user_id, name, email, phone, qualification, specialty, license_no, hospital, experience, fee, rating, total_consultations, status, available, languages, about) VALUES (?, ?, ?, ?, 'MBBS, MD', ?, ?, ?, ?, ?, ?, ?, 'verified', true, ?, ?)",
        [userId, doc.name, doc.email, doc.phone, doc.spec, doc.lic, doc.hospital, doc.exp, doc.fee, doc.rating, doc.cons, doc.langs,
          `${doc.exp}+ years experienced ${doc.spec} specialist at ${doc.hospital}.`]
      )
      success++
      console.log(`Added: ${doc.name} (${doc.spec}) - ${doc.hospital}`)
    } catch (err) {
      console.log(`Failed: ${doc.name} — ${err.message}`)
    }
  }
  console.log(`\nDone! ${success} doctors added, ${skipped} skipped.`)
  process.exit()
}

seed()

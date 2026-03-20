const db = require("./config/db")

async function updateLanguages() {
  const updates = [
    // Bangalore doctors → English + Kannada + Hindi
    { pattern: "Bangalore", languages: "English, Kannada, Hindi" },
    { pattern: "Jayanagar", languages: "English, Kannada, Hindi" },
    { pattern: "Hebbal", languages: "English, Kannada, Hindi" },
    { pattern: "Kengeri", languages: "English, Kannada" },
    { pattern: "Bannerghatta", languages: "English, Kannada, Hindi" },
    { pattern: "Bommasandra", languages: "English, Kannada" },
    { pattern: "Koramangala", languages: "English, Kannada, Hindi" },
    { pattern: "Devarabisanahalli", languages: "English, Kannada" },
    { pattern: "Lakkasandra", languages: "English, Kannada, Hindi" },
    { pattern: "Infantry", languages: "English, Kannada, Hindi" },
    { pattern: "Millers", languages: "English, Kannada, Hindi" },
    { pattern: "Queens", languages: "English, Kannada" },
    { pattern: "Shivajinagar", languages: "English, Kannada, Hindi" },
    { pattern: "Manipal", languages: "English, Kannada, Hindi" },
    { pattern: "NIMHANS", languages: "English, Kannada, Hindi" },
    { pattern: "Sparsh", languages: "English, Kannada, Hindi" },
    { pattern: "Cloudnine", languages: "English, Kannada" },
    { pattern: "Vikram", languages: "English, Kannada, Hindi" },
    { pattern: "Bowring", languages: "English, Kannada, Hindi" },
    { pattern: "Aster", languages: "English, Kannada, Hindi" },
    { pattern: "Sakra", languages: "English, Kannada" },
    { pattern: "BGS", languages: "English, Kannada, Hindi" },
    { pattern: "Apollo Hospital Jayanagar", languages: "English, Kannada, Hindi, Tamil" },
    { pattern: "St. Johns", languages: "English, Kannada, Hindi, Tamil" },
    // Mumbai doctors → English + Hindi + Marathi
    { pattern: "Mumbai", languages: "English, Hindi, Marathi" },
    { pattern: "Lilavati", languages: "English, Hindi, Marathi, Gujarati" },
    { pattern: "Kokilaben", languages: "English, Hindi, Marathi" },
    { pattern: "Hinduja", languages: "English, Hindi, Marathi" },
    { pattern: "Nanavati", languages: "English, Hindi, Marathi, Gujarati" },
    { pattern: "Wockhardt", languages: "English, Hindi, Marathi" },
    { pattern: "Fortis Mulund", languages: "English, Hindi, Marathi" },
    { pattern: "Bombay", languages: "English, Hindi, Marathi" },
    { pattern: "Breach Candy", languages: "English, Hindi, Marathi, Gujarati" },
    // Delhi doctors → English + Hindi + Punjabi
    { pattern: "Delhi", languages: "English, Hindi, Punjabi" },
    { pattern: "AIIMS", languages: "English, Hindi" },
    { pattern: "Max Hospital", languages: "English, Hindi, Punjabi" },
    { pattern: "BLK", languages: "English, Hindi" },
    { pattern: "Ganga Ram", languages: "English, Hindi, Punjabi" },
    { pattern: "Safdarjung", languages: "English, Hindi" },
    { pattern: "Indraprastha", languages: "English, Hindi, Punjabi" },
    // Hyderabad doctors → English + Telugu + Hindi + Urdu
    { pattern: "Hyderabad", languages: "English, Telugu, Hindi, Urdu" },
    { pattern: "Jubilee", languages: "English, Telugu, Hindi" },
    { pattern: "KIMS", languages: "English, Telugu, Hindi" },
    { pattern: "Yashoda", languages: "English, Telugu, Hindi, Urdu" },
    { pattern: "Care Hospital", languages: "English, Telugu, Hindi" },
    { pattern: "Omega", languages: "English, Telugu, Hindi" },
    { pattern: "Medicover", languages: "English, Telugu, Hindi" },
    { pattern: "Sunshine", languages: "English, Telugu, Hindi" },
    { pattern: "Nizam", languages: "English, Telugu, Hindi, Urdu" },
    // Chennai doctors → English + Tamil + Telugu
    { pattern: "Chennai", languages: "English, Tamil, Telugu" },
    { pattern: "Fortis Malar", languages: "English, Tamil" },
    { pattern: "MIOT", languages: "English, Tamil, Telugu" },
    { pattern: "Vijaya", languages: "English, Tamil" },
    { pattern: "Gleneagles", languages: "English, Tamil, Telugu" },
    { pattern: "SRM", languages: "English, Tamil" },
    { pattern: "Kauvery", languages: "English, Tamil" },
    { pattern: "Billroth", languages: "English, Tamil, Telugu" },
    // Pune doctors → English + Hindi + Marathi
    { pattern: "Pune", languages: "English, Marathi, Hindi" },
    { pattern: "Ruby Hall", languages: "English, Marathi, Hindi" },
    { pattern: "Jehangir", languages: "English, Marathi, Hindi" },
    { pattern: "KEM Hospital Pune", languages: "English, Marathi, Hindi" },
    { pattern: "Sahyadri", languages: "English, Marathi, Hindi" },
    { pattern: "Deenanath", languages: "English, Marathi, Hindi" },
    { pattern: "Columbia Asia Pune", languages: "English, Marathi, Hindi" },
    { pattern: "Poona", languages: "English, Marathi, Hindi" },
    { pattern: "Inamdar", languages: "English, Marathi, Hindi" },
  ]

  let updated = 0
  for (const u of updates) {
    const [result] = await db.query(
      "UPDATE doctors SET languages = ? WHERE hospital LIKE ? AND languages = 'English'",
      [u.languages, `%${u.pattern}%`]
    )
    if (result.affectedRows > 0) {
      console.log(`✅ Updated ${result.affectedRows} doctors at ${u.pattern} → ${u.languages}`)
      updated += result.affectedRows
    }
  }

  console.log(`\n🎉 Total updated: ${updated} doctors`)
  process.exit()
}

updateLanguages()

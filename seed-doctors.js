const bcrypt = require("bcryptjs")
const db = require("./config/db")

const doctors = [
  // GENERAL MEDICINE
  { name: "Dr. Anil Kumar", email: "anil.kumar@apollo.com", phone: "9801001001", spec: "General Medicine", lic: "KA-2015-10001", hospital: "Apollo Hospital Jayanagar", exp: 12, fee: 399, rating: 4.6, cons: 3200 },
  { name: "Dr. Sunita Rao", email: "sunita.rao@vikram.com", phone: "9801001002", spec: "General Medicine", lic: "KA-2018-10002", hospital: "Vikram Hospital Bangalore", exp: 7, fee: 349, rating: 4.4, cons: 1800 },
  { name: "Dr. Mohan Gowda", email: "mohan.gowda@bowring.com", phone: "9801001003", spec: "General Medicine", lic: "KA-2012-10003", hospital: "Bowring Hospital Bangalore", exp: 15, fee: 299, rating: 4.3, cons: 5100 },
  { name: "Dr. Rekha Shetty", email: "rekha.shetty@cloudnine.com", phone: "9801001004", spec: "General Medicine", lic: "KA-2019-10004", hospital: "Cloudnine Hospital Bangalore", exp: 6, fee: 449, rating: 4.5, cons: 1200 },
  { name: "Dr. Prakash Naik", email: "prakash.naik@stjohns.com", phone: "9801001005", spec: "General Medicine", lic: "KA-2010-10005", hospital: "St. Johns Medical College", exp: 18, fee: 499, rating: 4.7, cons: 6800 },

  // CARDIOLOGY
  { name: "Dr. Suresh Menon", email: "suresh.menon@manipal.com", phone: "9801002001", spec: "Cardiology", lic: "KA-2013-20001", hospital: "Manipal Hospital Bangalore", exp: 14, fee: 799, rating: 4.8, cons: 4200 },
  { name: "Dr. Deepa Krishnan", email: "deepa.krishnan@narayana.com", phone: "9801002002", spec: "Cardiology", lic: "KA-2016-20002", hospital: "Narayana Health City", exp: 10, fee: 699, rating: 4.7, cons: 2900 },
  { name: "Dr. Rajesh Pillai", email: "rajesh.pillai@fortis.com", phone: "9801002003", spec: "Cardiology", lic: "KA-2014-20003", hospital: "Fortis Hospital Bannerghatta", exp: 12, fee: 749, rating: 4.6, cons: 3500 },
  { name: "Dr. Anitha Rao", email: "anitha.rao@aster.com", phone: "9801002004", spec: "Cardiology", lic: "KA-2017-20004", hospital: "Aster CMI Hospital", exp: 9, fee: 649, rating: 4.5, cons: 2100 },
  { name: "Dr. Venkat Reddy", email: "venkat.reddy@sakra.com", phone: "9801002005", spec: "Cardiology", lic: "KA-2011-20005", hospital: "Sakra World Hospital", exp: 16, fee: 899, rating: 4.9, cons: 5600 },

  // GASTROENTEROLOGY
  { name: "Dr. Priya Hegde", email: "priya.hegde@apollo.com", phone: "9801003001", spec: "Gastroenterology", lic: "KA-2016-30001", hospital: "Apollo Hospital Jayanagar", exp: 9, fee: 599, rating: 4.7, cons: 2600 },
  { name: "Dr. Karthik Shenoy", email: "karthik.shenoy@fortis.com", phone: "9801003002", spec: "Gastroenterology", lic: "KA-2014-30002", hospital: "Fortis Hospital Bannerghatta", exp: 11, fee: 549, rating: 4.5, cons: 3100 },
  { name: "Dr. Nalini Pai", email: "nalini.pai@sakra.com", phone: "9801003003", spec: "Gastroenterology", lic: "KA-2018-30003", hospital: "Sakra World Hospital", exp: 7, fee: 499, rating: 4.4, cons: 1500 },
  { name: "Dr. Shiva Kumar", email: "shiva.kumar@aster.com", phone: "9801003004", spec: "Gastroenterology", lic: "KA-2012-30004", hospital: "Aster CMI Hospital", exp: 14, fee: 649, rating: 4.8, cons: 4200 },
  { name: "Dr. Usha Nair", email: "usha.nair@stjohns.com", phone: "9801003005", spec: "Gastroenterology", lic: "KA-2015-30005", hospital: "St. Johns Medical College", exp: 12, fee: 599, rating: 4.6, cons: 3400 },

  // NEUROLOGY
  { name: "Dr. Ramesh Bhat", email: "ramesh.bhat@nimhans.com", phone: "9801004001", spec: "Neurology", lic: "KA-2010-40001", hospital: "NIMHANS Bangalore", exp: 18, fee: 899, rating: 4.9, cons: 7200 },
  { name: "Dr. Vidya Murthy", email: "vidya.murthy@manipal.com", phone: "9801004002", spec: "Neurology", lic: "KA-2014-40002", hospital: "Manipal Hospital Bangalore", exp: 12, fee: 799, rating: 4.7, cons: 4100 },
  { name: "Dr. Arun Prasad", email: "arun.prasad@narayana.com", phone: "9801004003", spec: "Neurology", lic: "KA-2016-40003", hospital: "Narayana Health City", exp: 10, fee: 749, rating: 4.6, cons: 2800 },
  { name: "Dr. Smitha Kamath", email: "smitha.kamath@sparsh.com", phone: "9801004004", spec: "Neurology", lic: "KA-2017-40004", hospital: "Sparsh Hospital Bangalore", exp: 8, fee: 699, rating: 4.5, cons: 1900 },
  { name: "Dr. Ganesh Iyer", email: "ganesh.iyer@columbia.com", phone: "9801004005", spec: "Neurology", lic: "KA-2013-40005", hospital: "Columbia Asia Hebbal", exp: 13, fee: 849, rating: 4.8, cons: 3700 },

  // PULMONOLOGY
  { name: "Dr. Meera Shetty", email: "meera.shetty@fortis.com", phone: "9801005001", spec: "Pulmonology", lic: "KA-2015-50001", hospital: "Fortis Hospital Bannerghatta", exp: 11, fee: 599, rating: 4.6, cons: 2900 },
  { name: "Dr. Sunil Rao", email: "sunil.rao@vikram.com", phone: "9801005002", spec: "Pulmonology", lic: "KA-2017-50002", hospital: "Vikram Hospital Bangalore", exp: 8, fee: 549, rating: 4.4, cons: 1700 },
  { name: "Dr. Lakshmi Devi", email: "lakshmi.devi@sakra.com", phone: "9801005003", spec: "Pulmonology", lic: "KA-2013-50003", hospital: "Sakra World Hospital", exp: 13, fee: 649, rating: 4.7, cons: 3800 },
  { name: "Dr. Harish Gowda", email: "harish.gowda@bgs.com", phone: "9801005004", spec: "Pulmonology", lic: "KA-2016-50004", hospital: "BGS Gleneagles Hospital", exp: 9, fee: 499, rating: 4.5, cons: 2200 },
  { name: "Dr. Pooja Kulkarni", email: "pooja.kulkarni@aster.com", phone: "9801005005", spec: "Pulmonology", lic: "KA-2019-50005", hospital: "Aster CMI Hospital", exp: 6, fee: 599, rating: 4.3, cons: 1100 },

  // DERMATOLOGY
  { name: "Dr. Nandini Sharma", email: "nandini.sharma@apollo.com", phone: "9801006001", spec: "Dermatology", lic: "KA-2016-60001", hospital: "Apollo Hospital Jayanagar", exp: 9, fee: 499, rating: 4.6, cons: 2400 },
  { name: "Dr. Vivek Patel", email: "vivek.patel@narayana.com", phone: "9801006002", spec: "Dermatology", lic: "KA-2014-60002", hospital: "Narayana Health City", exp: 11, fee: 549, rating: 4.7, cons: 3200 },
  { name: "Dr. Asha Reddy", email: "asha.reddy@columbia.com", phone: "9801006003", spec: "Dermatology", lic: "KA-2018-60003", hospital: "Columbia Asia Hebbal", exp: 7, fee: 449, rating: 4.4, cons: 1600 },
  { name: "Dr. Ravi Shankar", email: "ravi.shankar@aster.com", phone: "9801006004", spec: "Dermatology", lic: "KA-2012-60004", hospital: "Aster CMI Hospital", exp: 14, fee: 599, rating: 4.8, cons: 4100 },
  { name: "Dr. Divya Menon", email: "divya.menon@cloudnine.com", phone: "9801006005", spec: "Dermatology", lic: "KA-2019-60005", hospital: "Cloudnine Hospital", exp: 6, fee: 399, rating: 4.3, cons: 900 },

  // PSYCHIATRY
  { name: "Dr. Kavitha Rao", email: "kavitha.rao@nimhans.com", phone: "9801007001", spec: "Psychiatry", lic: "KA-2013-70001", hospital: "NIMHANS Bangalore", exp: 13, fee: 699, rating: 4.8, cons: 3600 },
  { name: "Dr. Santosh Kumar", email: "santosh.kumar@bowring.com", phone: "9801007002", spec: "Psychiatry", lic: "KA-2015-70002", hospital: "Bowring Hospital Bangalore", exp: 11, fee: 599, rating: 4.6, cons: 2800 },
  { name: "Dr. Suma Bhat", email: "suma.bhat@manipal.com", phone: "9801007003", spec: "Psychiatry", lic: "KA-2017-70003", hospital: "Manipal Hospital Bangalore", exp: 8, fee: 649, rating: 4.5, cons: 1900 },
  { name: "Dr. Naveen Hegde", email: "naveen.hegde@stjohns.com", phone: "9801007004", spec: "Psychiatry", lic: "KA-2011-70004", hospital: "St. Johns Medical College", exp: 15, fee: 749, rating: 4.7, cons: 4500 },
  { name: "Dr. Preeti Nair", email: "preeti.nair@vikram.com", phone: "9801007005", spec: "Psychiatry", lic: "KA-2019-70005", hospital: "Vikram Hospital Bangalore", exp: 6, fee: 499, rating: 4.3, cons: 800 },

  // UROLOGY
  { name: "Dr. Girish Kamath", email: "girish.kamath@manipal.com", phone: "9801008001", spec: "Urology", lic: "KA-2014-80001", hospital: "Manipal Hospital Bangalore", exp: 12, fee: 649, rating: 4.7, cons: 3100 },
  { name: "Dr. Rohan Shetty", email: "rohan.shetty@fortis.com", phone: "9801008002", spec: "Urology", lic: "KA-2016-80002", hospital: "Fortis Hospital Bannerghatta", exp: 9, fee: 599, rating: 4.5, cons: 2200 },
  { name: "Dr. Latha Gowda", email: "latha.gowda@cloudnine.com", phone: "9801008003", spec: "Urology", lic: "KA-2018-80003", hospital: "Cloudnine Hospital", exp: 7, fee: 549, rating: 4.4, cons: 1400 },
  { name: "Dr. Madhu Rao", email: "madhu.rao@bowring.com", phone: "9801008004", spec: "Urology", lic: "KA-2012-80004", hospital: "Bowring Hospital Bangalore", exp: 14, fee: 499, rating: 4.6, cons: 3800 },
  { name: "Dr. Sanjay Pillai", email: "sanjay.pillai@sakra.com", phone: "9801008005", spec: "Urology", lic: "KA-2015-80005", hospital: "Sakra World Hospital", exp: 11, fee: 699, rating: 4.8, cons: 2900 },

  // MUSCULOSKELETAL (Orthopedics)
  { name: "Dr. Ajay Reddy", email: "ajay.reddy@sparsh.com", phone: "9801009001", spec: "Musculoskeletal", lic: "KA-2013-90001", hospital: "Sparsh Hospital Bangalore", exp: 13, fee: 699, rating: 4.8, cons: 3900 },
  { name: "Dr. Bhavana Shenoy", email: "bhavana.shenoy@hosmat.com", phone: "9801009002", spec: "Musculoskeletal", lic: "KA-2015-90002", hospital: "HOSMAT Hospital", exp: 11, fee: 649, rating: 4.6, cons: 3100 },
  { name: "Dr. Chetan Nayak", email: "chetan.nayak@manipal.com", phone: "9801009003", spec: "Musculoskeletal", lic: "KA-2017-90003", hospital: "Manipal Hospital Bangalore", exp: 8, fee: 599, rating: 4.5, cons: 2000 },
  { name: "Dr. Deepika Rao", email: "deepika.rao@narayana.com", phone: "9801009004", spec: "Musculoskeletal", lic: "KA-2012-90004", hospital: "Narayana Health City", exp: 15, fee: 749, rating: 4.9, cons: 5200 },
  { name: "Dr. Eshan Kumar", email: "eshan.kumar@bgs.com", phone: "9801009005", spec: "Musculoskeletal", lic: "KA-2019-90005", hospital: "BGS Gleneagles Hospital", exp: 6, fee: 499, rating: 4.3, cons: 900 },

  // INFECTIOUS DISEASE
  { name: "Dr. Faisal Khan", email: "faisal.khan@stjohns.com", phone: "9801010001", spec: "Infectious Disease", lic: "KA-2014-11001", hospital: "St. Johns Medical College", exp: 12, fee: 599, rating: 4.7, cons: 3300 },
  { name: "Dr. Geetha Iyer", email: "geetha.iyer@bowring.com", phone: "9801010002", spec: "Infectious Disease", lic: "KA-2016-11002", hospital: "Bowring Hospital Bangalore", exp: 9, fee: 499, rating: 4.5, cons: 2100 },
  { name: "Dr. Harsha Patel", email: "harsha.patel@vikram.com", phone: "9801010003", spec: "Infectious Disease", lic: "KA-2018-11003", hospital: "Vikram Hospital Bangalore", exp: 7, fee: 449, rating: 4.4, cons: 1500 },
  { name: "Dr. Indira Murthy", email: "indira.murthy@apollo.com", phone: "9801010004", spec: "Infectious Disease", lic: "KA-2011-11004", hospital: "Apollo Hospital Jayanagar", exp: 16, fee: 699, rating: 4.8, cons: 4800 },
  { name: "Dr. Jagadish Nair", email: "jagadish.nair@aster.com", phone: "9801010005", spec: "Infectious Disease", lic: "KA-2015-11005", hospital: "Aster CMI Hospital", exp: 11, fee: 549, rating: 4.6, cons: 2700 },

  // ENDOCRINOLOGY
  { name: "Dr. Kamala Devi", email: "kamala.devi@manipal.com", phone: "9801011001", spec: "Endocrinology", lic: "KA-2013-12001", hospital: "Manipal Hospital Bangalore", exp: 13, fee: 699, rating: 4.7, cons: 3600 },
  { name: "Dr. Lokesh Rao", email: "lokesh.rao@fortis.com", phone: "9801011002", spec: "Endocrinology", lic: "KA-2015-12002", hospital: "Fortis Hospital Bannerghatta", exp: 11, fee: 649, rating: 4.6, cons: 2900 },
  { name: "Dr. Mamatha Shetty", email: "mamatha.shetty@narayana.com", phone: "9801011003", spec: "Endocrinology", lic: "KA-2017-12003", hospital: "Narayana Health City", exp: 8, fee: 599, rating: 4.5, cons: 1800 },
  { name: "Dr. Naresh Gowda", email: "naresh.gowda@sakra.com", phone: "9801011004", spec: "Endocrinology", lic: "KA-2012-12004", hospital: "Sakra World Hospital", exp: 15, fee: 749, rating: 4.8, cons: 4500 },
  { name: "Dr. Omprakash Hegde", email: "omprakash.hegde@stjohns.com", phone: "9801011005", spec: "Endocrinology", lic: "KA-2019-12005", hospital: "St. Johns Medical College", exp: 6, fee: 499, rating: 4.3, cons: 800 },
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
        "INSERT INTO doctors (user_id, name, email, phone, qualification, specialty, license_no, hospital, experience, fee, rating, total_consultations, status, available, about) VALUES (?, ?, ?, ?, 'MBBS, MD', ?, ?, ?, ?, ?, ?, ?, 'verified', true, ?)",
        [userId, doc.name, doc.email, doc.phone, doc.spec, doc.lic, doc.hospital, doc.exp, doc.fee, doc.rating, doc.cons,
          `${doc.exp}+ years experienced ${doc.spec} specialist at ${doc.hospital}. Dedicated to providing quality patient care.`]
      )
      success++
      console.log(`✅ Added: ${doc.name} (${doc.spec})`)
    } catch (err) {
      console.log(`❌ Failed: ${doc.name} — ${err.message}`)
    }
  }
  console.log(`\n🎉 Done! ${success} doctors added, ${skipped} skipped.`)
  process.exit()
}

seed()

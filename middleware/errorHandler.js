const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message)
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  })
}

module.exports = errorHandler

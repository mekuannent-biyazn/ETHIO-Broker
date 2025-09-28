const errorhandler = (err, req, res, next) => {
  // Duplicate key error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]; // e.g., "phone"
    return res.status(400).json({
      success: false,
      message: `${field} already exists: ${err.keyValue[field]}`,
    });
  }

  // Validation errors (Mongoose schema validation)
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors)
        .map((val) => val.message)
        .join(", "),
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

const notfound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorhandler, notfound };

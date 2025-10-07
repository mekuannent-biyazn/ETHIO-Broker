const express = require("express");
const userRoute = require("./routes/user");
const propertyRouter = require("./routes/property");
const connectDB = require("./config/db");
const { errorhandler, notfound } = require("./middleware/errorMiddleware");
const cors = require("cors");
require("dotenv").config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000; // THIS LINE IS CRITICAL

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRoute);
app.use("/api/property", propertyRouter);

// Error handling middleware (must be last)
app.use(notfound);
app.use(errorhandler);

app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});
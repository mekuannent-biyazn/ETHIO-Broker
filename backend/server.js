const express = require("express");
const userRoute = require("./routes/User");
const propertyRouter = require("./routes/property");
const connectDB = require("./config/db");
const { errorhandler, notfound } = require("./middleware/errorMiddleware");

require("dotenv").config();
connectDB();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use("/", userRoute);
app.use("/api", propertyRouter);

app.use(errorhandler);
app.use(notfound);

app.listen(PORT, () => {
  console.log(`server is running on: http://localhost:${PORT}`);
});

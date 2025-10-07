const express = require("express");
const userRoute = require("./routes/User");
const propertyRouter = require("./routes/property");
const { errorhandler, notfound } = require("./middleware/errorMiddleware");
const cors = require("cors");

const app = express();

app.use(express.json());
aapp.use(cors());

app.use("/api/users", userRoute);
app.use("/api/property", propertyRouter);

app.use(errorhandler);
app.use(notfound);

module.exports = app;

const connectDB = require("./config/db");
const app = require("./app");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT;

(async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`server is running on: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to connect to the database: ${error.message}`);
    process.exit(1);
  }
})();

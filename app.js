const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./database/database");

const authRoute = require("./routes/authRoute");
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("", authRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server running on port 3000");
});

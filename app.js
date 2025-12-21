const express = require("express");
const app = express();
require("dotenv").config();
const { connectDB } = require("./database/database");

const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoute);
app.use("/api", productRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server running on port 3000");
});

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const expenseRoutes= require("./routes/expenseRoutes");

connectDB();

const app =
express();

app.use(cors());

app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/expense",expenseRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});

// app.listen(
// 5000,
// ()=>{
// console.log(
// "Server Running"
// );
// });
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

app.listen(
5000,
()=>{
console.log(
"Server Running"
);
});
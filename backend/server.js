require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");

const app = express();
connectDB();

app.use(express.json());
app.use(
  cors({
    origin: "http://frontend:8080",
//    origin: ["http://localhost:5173", "http://localhost:5175", "http://192.168.131.83:8080" ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

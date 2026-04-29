require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/database");
const config = require("./config/config");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = config.port;

connectDB();

// ✅ CORS FIX (IMPORTANT)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://pos-frontend-five-xi.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root Endpoint
app.get("/", (req, res) => {
  res.json({ message: "Hello from POS Server!" });
});

// Routes
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/order", require("./routes/orderRoute"));
app.use("/api/table", require("./routes/tableRoute"));
app.use("/api/payment", require("./routes/paymentRoute"));
app.use("/api/category", require("./routes/categoryRoute"));
app.use("/api/dish", require("./routes/dishRoute"));
app.use("/api/stats", require("./routes/statsRoute"));

// Error Handler
app.use(globalErrorHandler);

// Server
app.listen(PORT, () => {
  console.log(`☑️ POS Server is listening on port ${PORT}`);
});
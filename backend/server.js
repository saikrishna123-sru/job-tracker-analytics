const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobs");

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const PRIMARY_MONGO_URI = process.env.MONGO_URI || "";
const LOCAL_MONGO_URI = "mongodb://127.0.0.1:27017/jobtracker";

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;

  res.status(dbConnected ? 200 : 503).json({
    server: "ok",
    dbConnected,
  });
});

app.use((req, res, next) => {
  if (req.path === "/api/health") return next();

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message:
        "Database connection unavailable. Check MONGO_URI or start local MongoDB on mongodb://127.0.0.1:27017.",
    });
  }

  return next();
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

async function connectToDatabase() {
  const candidates = [];

  if (PRIMARY_MONGO_URI) {
    candidates.push({ uri: PRIMARY_MONGO_URI, label: "MONGO_URI" });
  }

  if (!PRIMARY_MONGO_URI || PRIMARY_MONGO_URI !== LOCAL_MONGO_URI) {
    candidates.push({ uri: LOCAL_MONGO_URI, label: "local fallback" });
  }

  for (const { uri, label } of candidates) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
      console.log(`MongoDB connected using ${label}`);
      return true;
    } catch (err) {
      console.log(`MongoDB connection failed (${label}): ${err.message}`);
    }
  }

  return false;
}

async function startServer() {
  const dbConnected = await connectToDatabase();

  app.listen(PORT, () => {
    console.log("Server running on port", PORT);

    if (!dbConnected) {
      console.log(
        "Server started without database connection. API routes will return 503 until MongoDB is reachable."
      );
    }
  });
}

startServer();

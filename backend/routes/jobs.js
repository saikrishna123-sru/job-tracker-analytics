const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

function ensureDbReady(res) {
  if (mongoose.connection.readyState === 1) return true;

  res.status(503).json(
    "Database is not connected. Please start MongoDB locally or update your MONGO_URI."
  );
  return false;
}

function sendServerError(res, err) {
  if (String(err?.message || "").includes("buffering timed out")) {
    return res
      .status(503)
      .json(
        "Database connection timed out. Please start MongoDB locally or fix MONGO_URI/IP whitelist."
      );
  }

  return res.status(500).json(err.message);
}

// GET USER JOBS
router.get("/", auth, async (req, res) => {
  try {
    if (!ensureDbReady(res)) return;
    const jobs = await Job.find({ userId: req.userId });
    res.json(jobs);
  } catch (err) {
    sendServerError(res, err);
  }
});

// CREATE
router.post("/", auth, async (req, res) => {
  try {
    if (!ensureDbReady(res)) return;

    const { company, role, applicationDate } = req.body;
    if (!company || !role || !applicationDate) {
      return res
        .status(400)
        .json("Company, role and application date are required");
    }

    const job = await Job.create({
      ...req.body,
      userId: req.userId,
    });
    res.json(job);
  } catch (err) {
    sendServerError(res, err);
  }
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  try {
    if (!ensureDbReady(res)) return;

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    res.json(job);
  } catch (err) {
    sendServerError(res, err);
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    if (!ensureDbReady(res)) return;

    await Job.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    res.json("Deleted");
  } catch (err) {
    sendServerError(res, err);
  }
});

module.exports = router;

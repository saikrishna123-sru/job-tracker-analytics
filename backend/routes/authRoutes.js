const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const JWT_SECRET = process.env.JWT_SECRET || "secret123";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

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

function getEmailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 0);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

// REGISTER
router.post("/register", async (req, res) => {
  try {
    if (!ensureDbReady(res)) return;

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json("Email and password are required");
    }

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json("User already exists");

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashed,
    });

    res.json(user);
  } catch (err) {
    sendServerError(res, err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    if (!ensureDbReady(res)) return;

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json("Wrong password");

    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    res.json({
      token,
      email: user.email,
    });
  } catch (err) {
    sendServerError(res, err);
  }
});

// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  try {
    if (!ensureDbReady(res)) return;

    const { email } = req.body;

    if (!email) return res.status(400).json("Email is required");

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "If that email is registered, a password reset link has been sent.",
      });
    }

    const token = jwt.sign(
      { id: user._id, type: "password-reset" },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;
    const transporter = getEmailTransporter();

    if (!transporter) {
      console.log(`Reset link for ${email}: ${resetLink}`);
      return res.json({
        message: "Reset link generated. Email service is not configured on the server.",
        resetLink,
      });
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: "Reset your Job Tracker password",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2 style="margin-bottom: 8px;">Reset Password</h2>
          <p>You requested to reset your Job Tracker password.</p>
          <p>
            <a href="${resetLink}" style="display:inline-block;background:#111827;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none;">
              Reset Password
            </a>
          </p>
          <p>This link expires in 15 minutes.</p>
        </div>
      `,
    });

    res.json({ message: "Password reset link sent to your email." });
  } catch (err) {
    sendServerError(res, err);
  }
});

// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  try {
    if (!ensureDbReady(res)) return;

    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json("Token and new password are required");
    }

    if (password.length < 6) {
      return res.status(400).json("Password must be at least 6 characters");
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== "password-reset") {
      return res.status(400).json("Invalid reset token");
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(decoded.id, { password: hashed });

    if (!user) return res.status(404).json("User not found");

    res.json("Password updated successfully.");
  } catch (err) {
    res.status(400).json("Invalid or expired reset link");
  }
});

module.exports = router;

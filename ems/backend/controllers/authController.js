const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function sanitize(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    position: user.position,
    department: user.department,
    bio: user.bio,
    initials: user.initials(),
  };
}

// POST /api/auth/register  (admin-only in practice, but open here for seeding/demo)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, position, department } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role === "admin" ? "admin" : "employee",
      position,
      department,
    });

    const token = signToken(user);
    res.status(201).json({ token, user: sanitize(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login  { email, password, portal: "admin" | "employee" }
exports.login = async (req, res) => {
  try {
    const { email, password, portal } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (portal && user.role !== portal) {
      return res.status(403).json({ message: `This account cannot access the ${portal} portal` });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    res.json({ token, user: sanitize(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
exports.me = async (req, res) => {
  res.json({ user: sanitize(req.user) });
};

// PUT /api/auth/me
exports.updateMe = async (req, res) => {
  try {
    const { name, position, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { name, position, bio } },
      { new: true }
    );
    res.json({ user: sanitize(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const match = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!match) return res.status(400).json({ message: "Current password is incorrect" });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sanitize = sanitize;

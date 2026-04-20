const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Guide = require('../models/Guide');

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── Visitor Registration ─────────────────────────────────────────────────────
exports.registerVisitor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { fullName, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password: hashed, role: 'visitor' });
    const token = signToken(user._id, user.role);

    res.status(201).json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── Visitor Login ────────────────────────────────────────────────────────────
exports.loginVisitor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, role: 'visitor' });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user._id, user.role);
    res.json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── Guide Registration ───────────────────────────────────────────────────────
exports.registerGuide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { fullName, email, password, jobTitle, experience, bio } = req.body;
  try {
    const exists = await Guide.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const guide = await Guide.create({
      fullName, email, password: hashed, jobTitle,
      experience: experience || '',
      bio: bio || '',
      status: 'pending',
    });

    res.status(201).json({
      message: 'Registration submitted. Awaiting admin approval.',
      guide: { id: guide._id, fullName: guide.fullName, email: guide.email, status: guide.status },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── Guide Login ──────────────────────────────────────────────────────────────
exports.loginGuide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const guide = await Guide.findOne({ email });
    if (!guide) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, guide.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    if (guide.status === 'pending') {
      return res.status(403).json({ message: 'Your account is pending admin approval.' });
    }
    if (guide.status === 'rejected') {
      return res.status(403).json({ message: 'Your account has been rejected. Contact support.' });
    }

    const token = signToken(guide._id, 'guide');
    res.json({
      token,
      user: { id: guide._id, fullName: guide.fullName, email: guide.email, role: 'guide', status: guide.status },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── Admin Login ──────────────────────────────────────────────────────────────
exports.loginAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(admin._id, 'admin');
    res.json({
      token,
      user: { id: admin._id, fullName: admin.fullName, email: admin.email, role: 'admin' },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const Pepper = require('../models/Pepper');
const { validationResult } = require('express-validator');

// POST /api/peppers — manager only
exports.addPepper = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, description, imageUrl, origin, color, heatLevel } = req.body;

  try {
    const exists = await Pepper.findOne({ name: { $regex: `^${name.trim()}$`, $options: 'i' } });
    if (exists) return res.status(409).json({ message: 'A pepper with this name already exists' });

    const pepper = await Pepper.create({
      name: name.trim(),
      description: description.trim(),
      imageUrl: imageUrl || '',
      origin: origin || '',
      color: color || '',
      heatLevel: heatLevel || 'Medium',
      createdBy: req.user.id,
    });

    res.status(201).json(pepper);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/peppers?search= — visitor (and admin)
exports.getPeppers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search && search.trim()) {
      // Partial, case-insensitive name match
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    const peppers = await Pepper.find(query)
      .select('name description imageUrl origin color heatLevel createdAt')
      .sort({ name: 1 });

    res.json(peppers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/peppers/:id — visitor (and admin)
exports.getPepper = async (req, res) => {
  try {
    const pepper = await Pepper.findById(req.params.id).populate('createdBy', 'fullName');
    if (!pepper) return res.status(404).json({ message: 'Pepper not found' });
    res.json(pepper);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /api/peppers/:id — manager only
exports.deletePepper = async (req, res) => {
  try {
    const pepper = await Pepper.findByIdAndDelete(req.params.id);
    if (!pepper) return res.status(404).json({ message: 'Pepper not found' });
    res.json({ message: 'Pepper deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

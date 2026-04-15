const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { addPepper, getPeppers, getPepper, updatePepper, deletePepper } = require('../controllers/pepperController');
const { protect, requireRole } = require('../middleware/auth');

const pepperValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('scoville').notEmpty().withMessage('Scoville value is required'),
  body('heatLevel').optional().isIn(['None', 'Mild', 'Medium', 'Hot', 'Very Hot', 'Extreme'])
    .withMessage('Invalid heat level'),
];

// Fully public — no auth required
router.get('/',    getPeppers);
router.get('/:id', getPepper);

// Admin only
router.post('/',      protect, requireRole('admin'), pepperValidation, addPepper);
router.put('/:id',    protect, requireRole('admin'), pepperValidation, updatePepper);
router.delete('/:id', protect, requireRole('admin'), deletePepper);

module.exports = router;

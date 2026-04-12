const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  registerVisitor, loginVisitor,
  registerGuide, loginGuide,
  loginAdmin,
} = require('../controllers/authController');

const emailRule   = body('email').isEmail().withMessage('Valid email required');
const passRule    = body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters');
const nameRule    = body('fullName').notEmpty().withMessage('Full name is required');
const confirmRule = body('confirmPassword').custom((val, { req }) => {
  if (val !== req.body.password) throw new Error('Passwords do not match');
  return true;
});

// Visitor
router.post('/visitor/register', [nameRule, emailRule, passRule, confirmRule], registerVisitor);
router.post('/visitor/login',    [emailRule, passRule], loginVisitor);

// Guide
router.post('/guide/register', [
  nameRule, emailRule, passRule, confirmRule,
  body('jobTitle').notEmpty().withMessage('Job title is required'),
], registerGuide);
router.post('/guide/login', [emailRule, passRule], loginGuide);

// Admin
router.post('/admin/login', [emailRule, passRule], loginAdmin);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getUsers, deleteUser } = require('../controllers/userController');
const { protect, requireRole } = require('../middleware/auth');

router.get('/',      protect, requireRole('admin'), getUsers);
router.delete('/:id', protect, requireRole('admin'), deleteUser);

module.exports = router;

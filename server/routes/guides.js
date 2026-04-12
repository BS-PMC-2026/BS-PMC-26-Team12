const express = require('express');
const router = express.Router();
const { getGuides, updateGuideStatus, deleteGuide } = require('../controllers/guideController');
const { protect, requireRole } = require('../middleware/auth');

router.get('/',              protect, requireRole('admin'), getGuides);
router.patch('/:id/status',  protect, requireRole('admin'), updateGuideStatus);
router.delete('/:id',        protect, requireRole('admin'), deleteGuide);

module.exports = router;

const router = require('express').Router();
const { protect, requireRole } = require('../middleware/auth');
const c = require('../controllers/tourOrderController');

router.post('/',   protect, requireRole('visitor'), c.bookTour);
router.get('/my',  protect, requireRole('visitor'), c.getMyBookings);

module.exports = router;

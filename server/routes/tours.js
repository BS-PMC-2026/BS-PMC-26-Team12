const router = require('express').Router();
const { protect, requireRole } = require('../middleware/auth');
const c = require('../controllers/tourController');

router.get('/',        protect, c.getTours);
router.get('/my',      protect, requireRole('guide'), c.getMyTours);
router.get('/:id',     protect, c.getTour);
router.post('/',       protect, requireRole('guide'), c.createTour);
router.put('/:id',     protect, requireRole('guide'), c.updateTour);

module.exports = router;

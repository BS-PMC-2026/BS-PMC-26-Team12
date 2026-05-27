const router = require('express').Router();
const { protect, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/feedbackController');

router.post('/',              protect, requireRole('visitor'),         ctrl.submitFeedback);
router.get('/my',             protect, requireRole('visitor'),         ctrl.getMyFeedback);
router.get('/tour/:tourId',   protect, requireRole('guide', 'admin'),  ctrl.getTourFeedback);
router.get('/',               protect, requireRole('admin'),           ctrl.getAllFeedback);
router.delete('/:id',         protect, requireRole('admin'),           ctrl.deleteFeedback);

module.exports = router;

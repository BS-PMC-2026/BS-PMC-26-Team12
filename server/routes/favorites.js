const router = require('express').Router();
const { protect, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/favoritesController');

router.get('/',            protect, requireRole('visitor'), ctrl.getFavorites);
router.post('/:tourId',    protect, requireRole('visitor'), ctrl.addFavorite);
router.delete('/:tourId',  protect, requireRole('visitor'), ctrl.removeFavorite);

module.exports = router;

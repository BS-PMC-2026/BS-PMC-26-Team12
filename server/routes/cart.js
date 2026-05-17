const router = require('express').Router();
const { protect } = require('../middleware/auth');
const c = require('../controllers/cartController');

router.get('/',        protect, c.getCart);
router.post('/',       protect, c.addToCart);
router.put('/:id',     protect, c.updateCartItem);
router.delete('/:id',  protect, c.removeFromCart);

module.exports = router;

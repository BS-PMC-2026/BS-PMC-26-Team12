const router = require('express').Router();
const { protect, requireRole } = require('../middleware/auth');
const c = require('../controllers/orderController');

router.post('/',        protect, requireRole('visitor'), c.checkout);
router.get('/',         protect, requireRole('admin'), c.getOrders);
router.put('/:id',      protect, requireRole('admin'), c.updateOrderStatus);
router.get('/my',       protect, requireRole('visitor'), c.getMyOrders);

module.exports = router;

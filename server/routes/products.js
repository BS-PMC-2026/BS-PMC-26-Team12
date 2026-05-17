const router = require('express').Router();
const { protect, requireRole } = require('../middleware/auth');
const c = require('../controllers/productController');

router.get('/',     protect, c.getProducts);
router.get('/:id',  protect, c.getProduct);
router.post('/',    protect, requireRole('admin'), c.createProduct);
router.put('/:id',  protect, requireRole('admin'), c.updateProduct);
router.delete('/:id', protect, requireRole('admin'), c.deleteProduct);

module.exports = router;

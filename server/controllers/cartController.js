const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    const items = await CartItem.find({ userId: req.user.id }).populate('productId');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) return res.status(400).json({ message: 'productId is required' });
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < quantity)
      return res.status(400).json({ message: 'Not enough stock available' });

    let item = await CartItem.findOne({ userId: req.user.id, productId });
    if (item) {
      if (product.stock < item.quantity + quantity)
        return res.status(400).json({ message: 'Not enough stock available' });
      item.quantity += quantity;
      await item.save();
    } else {
      item = await CartItem.create({ userId: req.user.id, productId, quantity });
    }
    await item.populate('productId');
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1) return res.status(400).json({ message: 'quantity must be at least 1' });
  try {
    const item = await CartItem.findOne({ _id: req.params.id, userId: req.user.id });
    if (!item) return res.status(404).json({ message: 'Cart item not found' });

    const product = await Product.findById(item.productId);
    if (product.stock < quantity)
      return res.status(400).json({ message: 'Not enough stock available' });

    item.quantity = quantity;
    await item.save();
    await item.populate('productId');
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const item = await CartItem.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

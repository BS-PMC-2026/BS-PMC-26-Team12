const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

exports.checkout = async (req, res) => {
  try {
    const { selectedItemIds } = req.body;

    let cartItems = await CartItem.find({ userId: req.user.id }).populate('productId');
    if (!cartItems.length) return res.status(400).json({ message: 'Cart is empty' });

    if (selectedItemIds?.length) {
      cartItems = cartItems.filter(item => selectedItemIds.includes(item._id.toString()));
      if (!cartItems.length)
        return res.status(400).json({ message: 'None of the selected items were found in your cart' });
    }

    for (const item of cartItems) {
      if (item.productId.stock < item.quantity)
        return res.status(400).json({ message: `Insufficient stock for ${item.productId.name}` });
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
    const order = await Order.create({ userId: req.user.id, totalAmount });

    const orderItems = await OrderItem.insertMany(
      cartItems.map(item => ({
        orderId: order._id,
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      }))
    );

    for (const item of cartItems) {
      await Product.findByIdAndUpdate(item.productId._id, { $inc: { stock: -item.quantity } });
    }
    await CartItem.deleteMany({ _id: { $in: cartItems.map(i => i._id) } });

    res.status(201).json({ order, orderItems });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'fullName email').sort({ createdAt: -1 });
    const result = await Promise.all(
      orders.map(async o => {
        const items = await OrderItem.find({ orderId: o._id }).populate('productId', 'name price');
        return { ...o.toObject(), items };
      })
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const valid = ['pending', 'shipped', 'completed', 'cancelled'];
  if (!valid.includes(status)) return res.status(400).json({ message: 'Invalid status' });
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const result = await Promise.all(
      orders.map(async o => {
        const items = await OrderItem.find({ orderId: o._id }).populate('productId', 'name price imageUrl');
        return { ...o.toObject(), items };
      })
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

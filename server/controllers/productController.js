const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  const { name, description, price, stock, imageUrl } = req.body;
  if (!name || !description || price == null || stock == null)
    return res.status(400).json({ message: 'name, description, price, and stock are required' });
  if (price < 0 || stock < 0)
    return res.status(400).json({ message: 'price and stock must be non-negative' });
  try {
    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price,
      stock,
      imageUrl: imageUrl || '',
      createdBy: req.user.id,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { search, maxPrice, inStock } = req.query;
    const query = {};
    if (search) query.name = { $regex: search.trim(), $options: 'i' };
    if (maxPrice) query.price = { $lte: Number(maxPrice) };
    if (inStock === 'true') query.stock = { $gt: 0 };
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'fullName');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { name, description, price, stock, imageUrl } = req.body;
  if (!name || !description || price == null || stock == null)
    return res.status(400).json({ message: 'name, description, price, and stock are required' });
  if (price < 0 || stock < 0)
    return res.status(400).json({ message: 'price and stock must be non-negative' });
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name: name.trim(), description: description.trim(), price, stock, imageUrl: imageUrl || '' },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

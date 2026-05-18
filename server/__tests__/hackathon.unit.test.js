const Product = require('../models/Product');
const Tour = require('../models/Tour');
const CartItem = require('../models/CartItem');
const { getProducts, getProduct } = require('../controllers/productController');
const { getTours, getTour } = require('../controllers/tourController');
const { addToCart, removeFromCart } = require('../controllers/cartController');

jest.mock('../models/Product');
jest.mock('../models/Tour');
jest.mock('../models/CartItem');

function createRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

beforeEach(() => jest.clearAllMocks());

// unit test 1
test('getProducts returns all products without authentication', async () => {
  const req = { query: {} };
  const res = createRes();
  const products = [{ _id: 'p1', name: 'Hot Sauce', price: 5 }];
  Product.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(products) });

  await getProducts(req, res);

  expect(Product.find).toHaveBeenCalledWith({});
  expect(res.json).toHaveBeenCalledWith(products);
});

// unit test
test('getProducts filters results by search query', async () => {
  const req = { query: { search: 'sauce' } };
  const res = createRes();
  Product.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });

  await getProducts(req, res);

  expect(Product.find).toHaveBeenCalledWith({ name: { $regex: 'sauce', $options: 'i' } });
});

// unit test
test('getProduct returns a single product without authentication', async () => {
  const req = { params: { id: 'p1' } };
  const res = createRes();
  const product = { _id: 'p1', name: 'Hot Sauce', price: 5, createdBy: { fullName: 'Admin' } };
  Product.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(product) });

  await getProduct(req, res);

  expect(res.json).toHaveBeenCalledWith(product);
});

// unit test
test('getProduct returns 404 when product does not exist', async () => {
  const req = { params: { id: 'nonexistent' } };
  const res = createRes();
  Product.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });

  await getProduct(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
});

// unit test
test('getTours returns all upcoming tours without authentication', async () => {
  const req = { query: {} };
  const res = createRes();
  const tours = [{ _id: 't1', title: 'Pepper Farm Tour', price: 20 }];
  Tour.find.mockReturnValue({
    populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue(tours) }),
  });

  await getTours(req, res);

  expect(res.json).toHaveBeenCalledWith(tours);
});

// unit test
test('getTour returns a single tour without authentication', async () => {
  const req = { params: { id: 't1' } };
  const res = createRes();
  const tour = { _id: 't1', title: 'Pepper Farm Tour', price: 20 };
  Tour.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(tour) });

  await getTour(req, res);

  expect(res.json).toHaveBeenCalledWith(tour);
});

// unit test
test('addToCart returns 400 when product has insufficient stock', async () => {
  const req = { body: { productId: 'p1', quantity: 10 }, user: { id: 'u1' } };
  const res = createRes();
  Product.findById.mockResolvedValue({ _id: 'p1', stock: 2 });

  await addToCart(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ message: 'Not enough stock available' });
});

// unit test
test('removeFromCart returns 404 when cart item does not belong to user', async () => {
  const req = { params: { id: 'item1' }, user: { id: 'u1' } };
  const res = createRes();
  CartItem.findOneAndDelete.mockResolvedValue(null);

  await removeFromCart(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ message: 'Cart item not found' });
});

const Product = require('../models/Product');
const { createProduct, getProducts, updateProduct } = require('../controllers/productController');

jest.mock('../models/Product');

function createRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

beforeEach(() => { jest.clearAllMocks(); });

// unit test
test('createProduct returns 400 when required fields are missing', async () => {
  const req = { body: { name: 'Sauce' }, user: { id: 'mgr1' } };
  const res = createRes();
  await createProduct(req, res);
  expect(res.status).toHaveBeenCalledWith(400);
});

// unit test
test('createProduct creates and returns product', async () => {
  const req = { body: { name: 'Hot Sauce', description: 'Spicy', price: 9.99, stock: 50 }, user: { id: 'mgr1' } };
  const res = createRes();
  const product = { _id: 'p1', name: 'Hot Sauce', price: 9.99, stock: 50 };
  Product.create.mockResolvedValue(product);
  await createProduct(req, res);
  expect(res.json).toHaveBeenCalledWith(product);
});

// unit test
test('getProducts returns all products', async () => {
  const req = { query: {} };
  const res = createRes();
  const products = [{ _id: 'p1', name: 'Hot Sauce' }];
  const sortMock = jest.fn().mockResolvedValue(products);
  Product.find.mockReturnValue({ sort: sortMock });
  await getProducts(req, res);
  expect(res.json).toHaveBeenCalledWith(products);
});

// unit test
test('updateProduct returns 400 when price is negative', async () => {
  const req = { params: { id: 'p1' }, body: { name: 'Sauce', description: 'Spicy', price: -1, stock: 10 } };
  const res = createRes();
  await updateProduct(req, res);
  expect(res.status).toHaveBeenCalledWith(400);
});

// unit test
test('updateProduct returns 404 when product not found', async () => {
  const req = { params: { id: 'p-missing' }, body: { name: 'Sauce', description: 'Spicy', price: 5, stock: 10 } };
  const res = createRes();
  Product.findByIdAndUpdate.mockReturnValue({ new: true, runValidators: true });
  Product.findByIdAndUpdate.mockResolvedValue(null);
  await updateProduct(req, res);
  expect(res.status).toHaveBeenCalledWith(404);
});

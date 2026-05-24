jest.mock('../../models/Product');

const Product = require('../../models/Product');
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../../controllers/productController');

function res() {
  const r = {};
  r.status = jest.fn().mockReturnValue(r);
  r.json = jest.fn().mockReturnValue(r);
  return r;
}

beforeEach(() => jest.clearAllMocks());

// createProduct
test('createProduct: 201 on success', async () => {
  const product = { _id: 'p1', name: 'Sauce', price: 10, stock: 5 };
  Product.create.mockResolvedValue(product);
  const r = res();
  await createProduct({ body: { name: 'Sauce', description: 'Hot', price: 10, stock: 5 }, user: { id: 'u1' } }, r);
  expect(r.status).toHaveBeenCalledWith(201);
  expect(r.json).toHaveBeenCalledWith(product);
});

test('createProduct: 400 when required fields are missing', async () => {
  const r = res();
  await createProduct({ body: { name: 'Sauce' }, user: { id: 'u1' } }, r);
  expect(r.status).toHaveBeenCalledWith(400);
});

test('createProduct: 400 when price is negative', async () => {
  const r = res();
  await createProduct({ body: { name: 'Sauce', description: 'Hot', price: -1, stock: 5 }, user: { id: 'u1' } }, r);
  expect(r.status).toHaveBeenCalledWith(400);
});

// getProducts
test('getProducts: returns all products with no filters', async () => {
  const products = [{ _id: 'p1', name: 'Sauce' }];
  Product.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(products) });
  const r = res();
  await getProducts({ query: {} }, r);
  expect(Product.find).toHaveBeenCalledWith({});
  expect(r.json).toHaveBeenCalledWith(products);
});

test('getProducts: applies search filter', async () => {
  Product.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });
  const r = res();
  await getProducts({ query: { search: 'hot', inStock: 'true' } }, r);
  expect(Product.find).toHaveBeenCalledWith(expect.objectContaining({
    name: { $regex: 'hot', $options: 'i' },
    stock: { $gt: 0 },
  }));
});

// getProduct
test('getProduct: returns product by id', async () => {
  const product = { _id: 'p1', name: 'Sauce' };
  Product.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(product) });
  const r = res();
  await getProduct({ params: { id: 'p1' } }, r);
  expect(r.json).toHaveBeenCalledWith(product);
});

test('getProduct: 404 when product not found', async () => {
  Product.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });
  const r = res();
  await getProduct({ params: { id: 'bad' } }, r);
  expect(r.status).toHaveBeenCalledWith(404);
});

// updateProduct
test('updateProduct: 404 when product not found', async () => {
  Product.findByIdAndUpdate.mockResolvedValue(null);
  const r = res();
  await updateProduct({ params: { id: 'bad' }, body: { name: 'X', description: 'Y', price: 5, stock: 1 } }, r);
  expect(r.status).toHaveBeenCalledWith(404);
});

// deleteProduct
test('deleteProduct: returns success message', async () => {
  Product.findByIdAndDelete.mockResolvedValue({ _id: 'p1' });
  const r = res();
  await deleteProduct({ params: { id: 'p1' } }, r);
  expect(r.json).toHaveBeenCalledWith({ message: 'Product deleted' });
});

test('deleteProduct: 404 when product not found', async () => {
  Product.findByIdAndDelete.mockResolvedValue(null);
  const r = res();
  await deleteProduct({ params: { id: 'bad' } }, r);
  expect(r.status).toHaveBeenCalledWith(404);
});

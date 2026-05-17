const request = require('supertest');

jest.mock('../../models/Product');
jest.mock('../../models/Tour');
jest.mock('../../models/CartItem');

const app = require('../../app');
const Product = require('../../models/Product');
const Tour = require('../../models/Tour');

beforeEach(() => jest.clearAllMocks());

// integration test
it('GET /api/products returns 200 with no auth token (public route)', async () => {
  Product.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([{ _id: 'p1', name: 'Hot Sauce' }]) });

  const res = await request(app).get('/api/products');

  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

// integration test
it('GET /api/products/:id returns 200 with no auth token (public route)', async () => {
  const product = { _id: 'p1', name: 'Hot Sauce', price: 5 };
  Product.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(product) });

  const res = await request(app).get('/api/products/p1');

  expect(res.status).toBe(200);
  expect(res.body.name).toBe('Hot Sauce');
});

// integration test
it('GET /api/tours returns 200 with no auth token (public route)', async () => {
  Tour.find.mockReturnValue({
    populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([{ _id: 't1', title: 'Farm Tour' }]) }),
  });

  const res = await request(app).get('/api/tours');

  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

// integration test
it('GET /api/tours/:id returns 200 with no auth token (public route)', async () => {
  const tour = { _id: 't1', title: 'Farm Tour', price: 20 };
  Tour.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(tour) });

  const res = await request(app).get('/api/tours/t1');

  expect(res.status).toBe(200);
  expect(res.body.title).toBe('Farm Tour');
});

// integration test
it('POST /api/cart returns 401 with no auth token (cart requires login)', async () => {
  const res = await request(app)
    .post('/api/cart')
    .send({ productId: 'p1', quantity: 1 });

  expect(res.status).toBe(401);
});

// integration test
it('DELETE /api/cart/:id returns 401 with no auth token (cart requires login)', async () => {
  const res = await request(app).delete('/api/cart/item1');

  expect(res.status).toBe(401);
});

// integration test
it('GET /api/products?inStock=true returns 200 filtered list (public route)', async () => {
  const inStockProducts = [{ _id: 'p2', name: 'Pepper Jam', stock: 10 }];
  Product.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(inStockProducts) });

  const res = await request(app).get('/api/products?inStock=true');

  expect(res.status).toBe(200);
  expect(Product.find).toHaveBeenCalledWith({ stock: { $gt: 0 } });
});

// integration test
it('GET /api/tours/:id returns 404 when tour does not exist', async () => {
  Tour.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });

  const res = await request(app).get('/api/tours/nonexistent');

  expect(res.status).toBe(404);
  expect(res.body.message).toBe('Tour not found');
});

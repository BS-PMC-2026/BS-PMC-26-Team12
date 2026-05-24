jest.mock('../../models/CartItem');
jest.mock('../../models/Product');

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../app');
const CartItem = require('../../models/CartItem');
const Product = require('../../models/Product');

const visitorToken = jwt.sign({ id: 'u1', role: 'visitor' }, process.env.JWT_SECRET);

beforeEach(() => jest.clearAllMocks());

it('GET /api/cart: 401 without auth token', async () => {
  const res = await request(app).get('/api/cart');
  expect(res.status).toBe(401);
});

it('GET /api/cart: 200 with valid token', async () => {
  CartItem.find.mockReturnValue({ populate: jest.fn().mockResolvedValue([]) });
  const res = await request(app).get('/api/cart').set('Authorization', `Bearer ${visitorToken}`);
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

it('POST /api/cart: 401 without auth token', async () => {
  const res = await request(app).post('/api/cart').send({ productId: 'p1', quantity: 1 });
  expect(res.status).toBe(401);
});

it('POST /api/cart: 400 when product is out of stock', async () => {
  Product.findById.mockResolvedValue({ _id: 'p1', stock: 0 });
  const res = await request(app)
    .post('/api/cart')
    .set('Authorization', `Bearer ${visitorToken}`)
    .send({ productId: 'p1', quantity: 1 });
  expect(res.status).toBe(400);
});

it('POST /api/cart: 200 when item added successfully', async () => {
  Product.findById.mockResolvedValue({ _id: 'p1', stock: 10 });
  CartItem.findOne.mockResolvedValue(null);
  const item = { _id: 'c1', quantity: 1, populate: jest.fn().mockResolvedValue({ _id: 'c1', quantity: 1 }) };
  CartItem.create.mockResolvedValue(item);
  const res = await request(app)
    .post('/api/cart')
    .set('Authorization', `Bearer ${visitorToken}`)
    .send({ productId: 'p1', quantity: 1 });
  expect(res.status).toBe(200);
});

it('DELETE /api/cart/:id: 401 without auth token', async () => {
  const res = await request(app).delete('/api/cart/c1');
  expect(res.status).toBe(401);
});

it('DELETE /api/cart/:id: 404 when item not found', async () => {
  CartItem.findOneAndDelete.mockResolvedValue(null);
  const res = await request(app)
    .delete('/api/cart/bad')
    .set('Authorization', `Bearer ${visitorToken}`);
  expect(res.status).toBe(404);
});

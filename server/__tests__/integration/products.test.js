jest.mock('../../models/Product');

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../app');
const Product = require('../../models/Product');

const adminToken = jwt.sign({ id: 'a1', role: 'admin' }, process.env.JWT_SECRET);
const visitorToken = jwt.sign({ id: 'u1', role: 'visitor' }, process.env.JWT_SECRET);

beforeEach(() => jest.clearAllMocks());

it('GET /api/products: 200 without auth token (public route)', async () => {
  Product.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([{ _id: 'p1', name: 'Sauce' }]) });
  const res = await request(app).get('/api/products');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

it('GET /api/products/:id: 200 without auth token', async () => {
  Product.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue({ _id: 'p1', name: 'Sauce' }) });
  const res = await request(app).get('/api/products/p1');
  expect(res.status).toBe(200);
  expect(res.body.name).toBe('Sauce');
});

it('GET /api/products/:id: 404 when product not found', async () => {
  Product.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });
  const res = await request(app).get('/api/products/nonexistent');
  expect(res.status).toBe(404);
});

it('POST /api/products: 401 without auth token', async () => {
  const res = await request(app).post('/api/products').send({ name: 'X', description: 'Y', price: 5, stock: 1 });
  expect(res.status).toBe(401);
});

it('POST /api/products: 403 when visitor tries to create product', async () => {
  const res = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${visitorToken}`)
    .send({ name: 'X', description: 'Y', price: 5, stock: 1 });
  expect(res.status).toBe(403);
});

it('POST /api/products: 201 when admin creates product', async () => {
  Product.create.mockResolvedValue({ _id: 'p1', name: 'X', price: 5, stock: 1 });
  const res = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'X', description: 'Y', price: 5, stock: 1 });
  expect(res.status).toBe(201);
});

it('DELETE /api/products/:id: 401 without auth token', async () => {
  const res = await request(app).delete('/api/products/p1');
  expect(res.status).toBe(401);
});

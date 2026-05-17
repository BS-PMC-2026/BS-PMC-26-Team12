const request = require('supertest');
const app = require('../../app');

jest.mock('../../models/Product');
jest.mock('../../models/User');
jest.mock('jsonwebtoken');

const Product = require('../../models/Product');
const jwt = require('jsonwebtoken');

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = 'test-secret';
});

// ── Public access ───────────────────────────────────────────────────────────

describe('GET /api/products (public)', () => {
  // integration test
  it('returns 200 and product list without a token', async () => {
    Product.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([
        { _id: 'p1', name: 'Ghost Pepper', price: 9.99, stock: 10 },
        { _id: 'p2', name: 'Habanero', price: 7.49, stock: 5 },
      ]),
    });

    const res = await request(app).get('/api/products');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty('name', 'Ghost Pepper');
  });

  // integration test
  it('returns empty array when no products exist', async () => {
    Product.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });

    const res = await request(app).get('/api/products');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  // integration test
  it('filters by search query when provided', async () => {
    Product.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([{ _id: 'p1', name: 'Ghost Pepper', price: 9.99 }]),
    });

    const res = await request(app).get('/api/products?search=ghost');

    expect(res.status).toBe(200);
    expect(Product.find).toHaveBeenCalledWith(
      expect.objectContaining({ name: expect.objectContaining({ $regex: 'ghost' }) })
    );
  });
});

describe('GET /api/products/:id (public)', () => {
  // integration test
  it('returns 200 and product when found', async () => {
    // findById chains with .populate()
    Product.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue({ _id: 'p1', name: 'Ghost Pepper', price: 9.99 }),
    });

    const res = await request(app).get('/api/products/p1');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'Ghost Pepper');
  });

  // integration test
  it('returns 404 when product does not exist', async () => {
    Product.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    const res = await request(app).get('/api/products/nonexistent');

    expect(res.status).toBe(404);
  });
});

// ── Protected: admin-only routes ────────────────────────────────────────────

describe('POST /api/products (admin only)', () => {
  // integration test
  it('returns 401 when no token is provided', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'New Pepper', price: 5, stock: 10, description: 'test' });

    expect(res.status).toBe(401);
  });

  // integration test
  it('returns 403 when token belongs to a visitor', async () => {
    jwt.verify.mockReturnValue({ id: 'u1', role: 'visitor' });
    const User = require('../../models/User');
    User.findById = jest.fn().mockResolvedValue({ _id: 'u1', role: 'visitor' });

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', 'Bearer visitor-token')
      .send({ name: 'New Pepper', price: 5, stock: 10, description: 'test' });

    expect(res.status).toBe(403);
  });
});

describe('DELETE /api/products/:id (admin only)', () => {
  // integration test
  it('returns 401 when no token is provided', async () => {
    const res = await request(app).delete('/api/products/p1');
    expect(res.status).toBe(401);
  });
});

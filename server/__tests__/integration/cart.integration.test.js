const request = require('supertest');
const app = require('../../app');

jest.mock('../../models/CartItem');
jest.mock('../../models/Product');
jest.mock('../../models/User');
jest.mock('jsonwebtoken');

const CartItem = require('../../models/CartItem');
const Product = require('../../models/Product');
const jwt = require('jsonwebtoken');

const visitorToken = 'Bearer visitor-token';

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = 'test-secret';
  jwt.verify.mockReturnValue({ id: 'u1', role: 'visitor' });
  const User = require('../../models/User');
  User.findById = jest.fn().mockResolvedValue({ _id: 'u1', role: 'visitor' });
});

// ── Auth guard ──────────────────────────────────────────────────────────────

describe('GET /api/cart (visitor only)', () => {
  // integration test
  it('returns 401 when no token is provided', async () => {
    const res = await request(app).get('/api/cart');
    expect(res.status).toBe(401);
  });

  // integration test
  it('returns 200 with cart items for authenticated visitor', async () => {
    CartItem.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([
        { _id: 'c1', productId: { name: 'Ghost Pepper', price: 9.99 }, quantity: 2 },
      ]),
    });

    const res = await request(app).get('/api/cart').set('Authorization', visitorToken);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('quantity', 2);
  });
});

// ── Add to cart ─────────────────────────────────────────────────────────────

describe('POST /api/cart (add item)', () => {
  // integration test
  it('returns 401 when not logged in', async () => {
    const res = await request(app).post('/api/cart').send({ productId: 'p1', quantity: 1 });
    expect(res.status).toBe(401);
  });

  // integration test
  it('returns 400 when product is out of stock', async () => {
    Product.findById.mockResolvedValue({ _id: 'p1', stock: 0 });

    const res = await request(app)
      .post('/api/cart')
      .set('Authorization', visitorToken)
      .send({ productId: 'p1', quantity: 1 });

    expect(res.status).toBe(400);
  });

  // integration test
  it('creates new cart item when product is in stock', async () => {
    Product.findById.mockResolvedValue({ _id: 'p1', stock: 10 });
    CartItem.findOne.mockResolvedValue(null);
    // Item needs a .populate() method since the controller calls item.populate()
    const newItem = { _id: 'c1', productId: 'p1', quantity: 1, populate: jest.fn().mockResolvedValue() };
    CartItem.create.mockResolvedValue(newItem);

    const res = await request(app)
      .post('/api/cart')
      .set('Authorization', visitorToken)
      .send({ productId: 'p1', quantity: 1 });

    expect(res.status).toBe(200);
    expect(CartItem.create).toHaveBeenCalled();
  });

  // integration test
  it('increments quantity when item already in cart', async () => {
    Product.findById.mockResolvedValue({ _id: 'p1', stock: 10 });
    const existing = {
      _id: 'c1', productId: 'p1', quantity: 1,
      save: jest.fn().mockResolvedValue(true),
      populate: jest.fn().mockResolvedValue(),
    };
    CartItem.findOne.mockResolvedValue(existing);

    const res = await request(app)
      .post('/api/cart')
      .set('Authorization', visitorToken)
      .send({ productId: 'p1', quantity: 2 });

    expect(res.status).toBe(200);
    expect(existing.save).toHaveBeenCalled();
    expect(existing.quantity).toBe(3);
  });
});

// ── Delete cart item ────────────────────────────────────────────────────────

describe('DELETE /api/cart/:id', () => {
  // integration test
  it('returns 401 when not logged in', async () => {
    const res = await request(app).delete('/api/cart/c1');
    expect(res.status).toBe(401);
  });

  // integration test
  it('returns 404 when item not found or belongs to another user', async () => {
    CartItem.findOneAndDelete.mockResolvedValue(null);

    const res = await request(app)
      .delete('/api/cart/c1')
      .set('Authorization', visitorToken);

    expect(res.status).toBe(404);
  });

  // integration test
  it('returns 200 when item is successfully removed', async () => {
    CartItem.findOneAndDelete.mockResolvedValue({ _id: 'c1' });

    const res = await request(app)
      .delete('/api/cart/c1')
      .set('Authorization', visitorToken);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});

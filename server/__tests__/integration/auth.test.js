jest.mock('../../models/User');
jest.mock('../../models/Guide');
jest.mock('bcryptjs');
jest.mock('express-validator', () => {
  // body() is used as Express middleware at route-load time — must be callable
  // and support any chain method (isEmail, optional, isIn, custom, etc.)
  const makeChain = () => {
    const fn = jest.fn((req, res, next) => next && next());
    fn.run = jest.fn().mockResolvedValue(undefined);
    const proxy = new Proxy(fn, {
      get(target, prop) {
        if (prop === 'then') return undefined; // prevent Promise.resolve() treating as thenable
        if (prop in target) return target[prop];
        const chained = jest.fn(() => proxy);
        target[prop] = chained;
        return chained;
      },
    });
    return proxy;
  };
  return { validationResult: jest.fn(), body: jest.fn().mockImplementation(makeChain) };
});

const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User');
const Guide = require('../../models/Guide');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const ok = { isEmpty: () => true, array: () => [] };

beforeEach(() => {
  jest.clearAllMocks();
  validationResult.mockReturnValue(ok);
});

it('POST /api/auth/visitor/register: 201 on success', async () => {
  User.findOne.mockResolvedValue(null);
  bcrypt.hash.mockResolvedValue('h');
  User.create.mockResolvedValue({ _id: 'u1', fullName: 'A', email: 'a@b.com', role: 'visitor' });

  const res = await request(app).post('/api/auth/visitor/register').send({
    fullName: 'Alice', email: 'alice@test.com', password: '123456', confirmPassword: '123456',
  });

  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty('token');
});

it('POST /api/auth/visitor/register: 409 when email already registered', async () => {
  User.findOne.mockResolvedValue({ _id: 'x' });

  const res = await request(app).post('/api/auth/visitor/register').send({
    fullName: 'Alice', email: 'alice@test.com', password: '123456', confirmPassword: '123456',
  });

  expect(res.status).toBe(409);
});

it('POST /api/auth/visitor/login: 200 with token on valid credentials', async () => {
  User.findOne.mockResolvedValue({ _id: 'u1', fullName: 'A', email: 'a@b.com', role: 'visitor', password: 'h' });
  bcrypt.compare.mockResolvedValue(true);

  const res = await request(app).post('/api/auth/visitor/login').send({
    email: 'alice@test.com', password: '123456',
  });

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('token');
});

it('POST /api/auth/visitor/login: 401 on invalid credentials', async () => {
  User.findOne.mockResolvedValue(null);

  const res = await request(app).post('/api/auth/visitor/login').send({
    email: 'x@test.com', password: 'wrong',
  });

  expect(res.status).toBe(401);
});

it('POST /api/auth/guide/login: 403 when guide account is pending', async () => {
  Guide.findOne.mockResolvedValue({ _id: 'g1', password: 'h', status: 'pending' });
  bcrypt.compare.mockResolvedValue(true);

  const res = await request(app).post('/api/auth/guide/login').send({
    email: 'guide@test.com', password: '123456',
  });

  expect(res.status).toBe(403);
});

it('POST /api/auth/admin/login: 200 on valid admin credentials', async () => {
  User.findOne.mockResolvedValue({ _id: 'a1', fullName: 'Admin', email: 'a@test.com', role: 'admin', password: 'h' });
  bcrypt.compare.mockResolvedValue(true);

  const res = await request(app).post('/api/auth/admin/login').send({
    email: 'admin@test.com', password: '123456',
  });

  expect(res.status).toBe(200);
  expect(res.body.user.role).toBe('admin');
});

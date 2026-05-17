const request = require('supertest');
const app = require('../../app');

// Don't mock express-validator — let real validation run, just send valid data
jest.mock('../../models/User');
jest.mock('../../models/Guide');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const User = require('../../models/User');
const Guide = require('../../models/Guide');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = 'test-secret';
  jwt.sign.mockReturnValue('mock-token');
});

// ── Visitor registration ────────────────────────────────────────────────────

describe('POST /api/auth/register/visitor', () => {
  const validBody = { fullName: 'Test User', email: 'test@test.com', password: '123456', confirmPassword: '123456' };

  // integration test
  it('returns 201 and token on successful registration', async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashed');
    User.create.mockResolvedValue({ _id: 'u1', fullName: 'Test User', email: 'test@test.com', role: 'visitor' });

    const res = await request(app).post('/api/auth/visitor/register').send(validBody);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  // integration test
  it('returns 409 when email is already registered', async () => {
    User.findOne.mockResolvedValue({ _id: 'u1' });

    const res = await request(app).post('/api/auth/visitor/register').send(validBody);

    expect(res.status).toBe(409);
  });
});

// ── Visitor login ───────────────────────────────────────────────────────────

describe('POST /api/auth/visitor/login', () => {
  // integration test
  it('returns 200 and token on valid credentials', async () => {
    User.findOne.mockResolvedValue({
      _id: 'u1', fullName: 'Visitor', email: 'v@test.com', role: 'visitor', password: 'hashed',
    });
    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app)
      .post('/api/auth/visitor/login')
      .send({ email: 'v@test.com', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token', 'mock-token');
    expect(res.body.user).toMatchObject({ email: 'v@test.com', role: 'visitor' });
  });

  // integration test
  it('returns 401 when password is wrong', async () => {
    User.findOne.mockResolvedValue({ _id: 'u1', email: 'v@test.com', password: 'hashed' });
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app)
      .post('/api/auth/visitor/login')
      .send({ email: 'v@test.com', password: 'wrongpass' });

    expect(res.status).toBe(401);
  });

  // integration test
  it('returns 401 when user does not exist', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/visitor/login')
      .send({ email: 'nobody@test.com', password: '123456' });

    expect(res.status).toBe(401);
  });
});

// ── Guide login ─────────────────────────────────────────────────────────────

describe('POST /api/auth/guide/login', () => {
  // integration test
  it('returns 403 when guide account is pending approval', async () => {
    Guide.findOne.mockResolvedValue({
      _id: 'g1', email: 'g@test.com', password: 'hashed', status: 'pending',
    });
    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app)
      .post('/api/auth/guide/login')
      .send({ email: 'g@test.com', password: '123456' });

    expect(res.status).toBe(403);
  });

  // integration test
  it('returns 200 for approved guide', async () => {
    Guide.findOne.mockResolvedValue({
      _id: 'g1', fullName: 'Guide', email: 'g@test.com',
      password: 'hashed', status: 'approved', jobTitle: 'Farm Guide',
    });
    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app)
      .post('/api/auth/guide/login')
      .send({ email: 'g@test.com', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});

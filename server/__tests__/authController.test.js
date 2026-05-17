const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Guide = require('../models/Guide');
const {
  registerVisitor,
  loginVisitor,
  registerGuide,
  loginGuide,
  loginAdmin,
} = require('../controllers/authController');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));
jest.mock('../models/User');
jest.mock('../models/Guide');

function createRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

beforeEach(() => {
  jest.clearAllMocks();
  validationResult.mockReturnValue({
    isEmpty: () => true,
    array: () => [],
  });
  process.env.JWT_SECRET = 'test-secret';
  jwt.sign.mockReturnValue('fake-token');
});

// unit test
// Checks that registerVisitor blocks duplicate email
test('registerVisitor returns 409 when email already registered', async () => {
  const req = { body: { fullName: 'A', email: 'a@test.com', password: '123456' } };
  const res = createRes();

  User.findOne.mockResolvedValue({ _id: 'u1' });

  await registerVisitor(req, res);

  expect(res.status).toHaveBeenCalledWith(409);
  expect(res.json).toHaveBeenCalledWith({ message: 'Email already registered' });
});

// unit test
// Checks that loginVisitor returns token when credentials are correct
test('loginVisitor returns token and user data on valid credentials', async () => {
  const req = { body: { email: 'v@test.com', password: '123456' } };
  const res = createRes();
  const visitor = { _id: 'u1', fullName: 'Visitor', email: 'v@test.com', role: 'visitor', password: 'hashed' };

  User.findOne.mockResolvedValue(visitor);
  bcrypt.compare.mockResolvedValue(true);

  await loginVisitor(req, res);

  expect(res.json).toHaveBeenCalledWith({
    token: 'fake-token',
    user: { id: 'u1', fullName: 'Visitor', email: 'v@test.com', role: 'visitor' },
  });
});

// unit test
// Checks that loginGuide returns 403 when guide is pending approval
test('loginGuide returns 403 for pending guide', async () => {
  const req = { body: { email: 'g@test.com', password: '123456' } };
  const res = createRes();
  const guide = { _id: 'g1', email: 'g@test.com', password: 'hashed', status: 'pending' };

  Guide.findOne.mockResolvedValue(guide);
  bcrypt.compare.mockResolvedValue(true);

  await loginGuide(req, res);

  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.json).toHaveBeenCalledWith({ message: 'Your account is pending admin approval.' });
});

// unit test
// Checks that loginAdmin returns token when admin credentials are valid
test('loginAdmin returns token and admin user when valid', async () => {
  const req = { body: { email: 'admin@test.com', password: 'admin123' } };
  const res = createRes();
  const admin = { _id: 'a1', fullName: 'Admin', email: 'admin@test.com', role: 'admin', password: 'hashed' };

  User.findOne.mockResolvedValue(admin);
  bcrypt.compare.mockResolvedValue(true);

  await loginAdmin(req, res);

  expect(res.json).toHaveBeenCalledWith({
    token: 'fake-token',
    user: { id: 'a1', fullName: 'Admin', email: 'admin@test.com', role: 'admin' },
  });
});

// unit test
// Checks that registerGuide creates guide with pending status
test('registerGuide creates guide with pending status', async () => {
  const req = {
    body: {
      fullName: 'Guide Name',
      email: 'guide@test.com',
      password: '123456',
      jobTitle: 'Farm Guide',
      experience: '2 years',
      bio: 'bio',
    },
  };
  const res = createRes();

  Guide.findOne.mockResolvedValue(null);
  bcrypt.hash.mockResolvedValue('hashed-pass');
  Guide.create.mockResolvedValue({
    _id: 'g1',
    fullName: 'Guide Name',
    email: 'guide@test.com',
    status: 'pending',
  });

  await registerGuide(req, res);

  expect(Guide.create).toHaveBeenCalledWith(expect.objectContaining({ status: 'pending' }));
  expect(res.status).toHaveBeenCalledWith(201);
});

jest.mock('../../models/User');
jest.mock('../../models/Guide');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('express-validator', () => ({ validationResult: jest.fn() }));

const User = require('../../models/User');
const Guide = require('../../models/Guide');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { registerVisitor, loginVisitor, registerGuide, loginGuide, loginAdmin } = require('../../controllers/authController');

const ok = { isEmpty: () => true, array: () => [] };
const fail = { isEmpty: () => false, array: () => [{ msg: 'Invalid' }] };

function res() {
  const r = {};
  r.status = jest.fn().mockReturnValue(r);
  r.json = jest.fn().mockReturnValue(r);
  return r;
}

beforeEach(() => {
  jest.clearAllMocks();
  validationResult.mockReturnValue(ok);
  jwt.sign.mockReturnValue('tok');
});

// registerVisitor
test('registerVisitor: 201 with token on success', async () => {
  User.findOne.mockResolvedValue(null);
  bcrypt.hash.mockResolvedValue('h');
  User.create.mockResolvedValue({ _id: 'u1', fullName: 'A', email: 'a@b.com', role: 'visitor' });
  const r = res();
  await registerVisitor({ body: { fullName: 'A', email: 'a@b.com', password: '123456' } }, r);
  expect(r.status).toHaveBeenCalledWith(201);
  expect(r.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'tok' }));
});

test('registerVisitor: 409 when email already exists', async () => {
  User.findOne.mockResolvedValue({ _id: 'x' });
  const r = res();
  await registerVisitor({ body: { email: 'a@b.com' } }, r);
  expect(r.status).toHaveBeenCalledWith(409);
});

test('registerVisitor: 400 on validation errors', async () => {
  validationResult.mockReturnValue(fail);
  const r = res();
  await registerVisitor({ body: {} }, r);
  expect(r.status).toHaveBeenCalledWith(400);
});

// loginVisitor
test('loginVisitor: 200 with token on valid credentials', async () => {
  User.findOne.mockResolvedValue({ _id: 'u1', fullName: 'A', email: 'a@b.com', role: 'visitor', password: 'h' });
  bcrypt.compare.mockResolvedValue(true);
  const r = res();
  await loginVisitor({ body: { email: 'a@b.com', password: '123456' } }, r);
  expect(r.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'tok' }));
});

test('loginVisitor: 401 when user not found', async () => {
  User.findOne.mockResolvedValue(null);
  const r = res();
  await loginVisitor({ body: { email: 'x@b.com', password: '123456' } }, r);
  expect(r.status).toHaveBeenCalledWith(401);
});

test('loginVisitor: 401 on wrong password', async () => {
  User.findOne.mockResolvedValue({ _id: 'u1', password: 'h' });
  bcrypt.compare.mockResolvedValue(false);
  const r = res();
  await loginVisitor({ body: { email: 'a@b.com', password: 'wrong' } }, r);
  expect(r.status).toHaveBeenCalledWith(401);
});

// loginGuide
test('loginGuide: 403 when guide is pending', async () => {
  Guide.findOne.mockResolvedValue({ _id: 'g1', password: 'h', status: 'pending' });
  bcrypt.compare.mockResolvedValue(true);
  const r = res();
  await loginGuide({ body: { email: 'g@b.com', password: '123456' } }, r);
  expect(r.status).toHaveBeenCalledWith(403);
});

test('loginGuide: 403 when guide is rejected', async () => {
  Guide.findOne.mockResolvedValue({ _id: 'g1', password: 'h', status: 'rejected' });
  bcrypt.compare.mockResolvedValue(true);
  const r = res();
  await loginGuide({ body: { email: 'g@b.com', password: '123456' } }, r);
  expect(r.status).toHaveBeenCalledWith(403);
});

test('loginGuide: 200 with token when guide is approved', async () => {
  Guide.findOne.mockResolvedValue({ _id: 'g1', fullName: 'G', email: 'g@b.com', password: 'h', status: 'approved' });
  bcrypt.compare.mockResolvedValue(true);
  const r = res();
  await loginGuide({ body: { email: 'g@b.com', password: '123456' } }, r);
  expect(r.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'tok' }));
});

// loginAdmin
test('loginAdmin: 401 when admin not found', async () => {
  User.findOne.mockResolvedValue(null);
  const r = res();
  await loginAdmin({ body: { email: 'a@b.com', password: '123456' } }, r);
  expect(r.status).toHaveBeenCalledWith(401);
});

test('loginAdmin: 200 with token on valid credentials', async () => {
  User.findOne.mockResolvedValue({ _id: 'a1', fullName: 'Admin', email: 'a@b.com', role: 'admin', password: 'h' });
  bcrypt.compare.mockResolvedValue(true);
  const r = res();
  await loginAdmin({ body: { email: 'a@b.com', password: '123456' } }, r);
  expect(r.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'tok' }));
});

// registerGuide
test('registerGuide: 201 with pending message on success', async () => {
  Guide.findOne.mockResolvedValue(null);
  bcrypt.hash.mockResolvedValue('h');
  Guide.create.mockResolvedValue({ _id: 'g1', fullName: 'G', email: 'g@b.com', status: 'pending' });
  const r = res();
  await registerGuide({ body: { fullName: 'G', email: 'g@b.com', password: '123456', jobTitle: 'Guide' } }, r);
  expect(r.status).toHaveBeenCalledWith(201);
});

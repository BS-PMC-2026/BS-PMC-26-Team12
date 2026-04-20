const jwt = require('jsonwebtoken');
const { protect, requireRole } = require('../middleware/auth');

jest.mock('jsonwebtoken');

function createRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = 'test-secret';
});

// Checks that protect returns 401 when token is missing
test('protect returns 401 when authorization header is missing', () => {
  const req = { headers: {} };
  const res = createRes();
  const next = jest.fn();

  protect(req, res, next);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(next).not.toHaveBeenCalled();
});

// Checks that protect attaches decoded token to req.user
test('protect sets req.user and calls next for valid token', () => {
  const req = { headers: { authorization: 'Bearer valid-token' } };
  const res = createRes();
  const next = jest.fn();

  jwt.verify.mockReturnValue({ id: 'u1', role: 'admin' });

  protect(req, res, next);

  expect(req.user).toEqual({ id: 'u1', role: 'admin' });
  expect(next).toHaveBeenCalled();
});

// Checks that requireRole blocks users with unauthorized roles
test('requireRole returns 403 when role is not allowed', () => {
  const req = { user: { role: 'visitor' } };
  const res = createRes();
  const next = jest.fn();

  const guard = requireRole('admin');
  guard(req, res, next);

  expect(res.status).toHaveBeenCalledWith(403);
  expect(next).not.toHaveBeenCalled();
});

// Checks that requireRole allows users with authorized role
test('requireRole calls next when role is allowed', () => {
  const req = { user: { role: 'admin' } };
  const res = createRes();
  const next = jest.fn();

  const guard = requireRole('admin');
  guard(req, res, next);

  expect(next).toHaveBeenCalled();
});

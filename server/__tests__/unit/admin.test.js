jest.mock('../../models/Guide');
jest.mock('../../models/User');
jest.mock('jsonwebtoken');

const Guide = require('../../models/Guide');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const { getGuides, updateGuideStatus, deleteGuide } = require('../../controllers/guideController');
const { getUsers, deleteUser } = require('../../controllers/userController');
const { protect, requireRole } = require('../../middleware/auth');

function res() {
  const r = {};
  r.status = jest.fn().mockReturnValue(r);
  r.json = jest.fn().mockReturnValue(r);
  return r;
}

beforeEach(() => jest.clearAllMocks());

// guideController
test('getGuides: returns all guides', async () => {
  const guides = [{ _id: 'g1', fullName: 'Guide', status: 'pending' }];
  Guide.find.mockReturnValue({ select: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue(guides) }) });
  const r = res();
  await getGuides({}, r);
  expect(r.json).toHaveBeenCalledWith(guides);
});

test('updateGuideStatus: 400 on invalid status', async () => {
  const r = res();
  await updateGuideStatus({ params: { id: 'g1' }, body: { status: 'flying' } }, r);
  expect(r.status).toHaveBeenCalledWith(400);
});

test('updateGuideStatus: returns updated guide', async () => {
  const guide = { _id: 'g1', status: 'approved' };
  Guide.findByIdAndUpdate.mockReturnValue({ select: jest.fn().mockResolvedValue(guide) });
  const r = res();
  await updateGuideStatus({ params: { id: 'g1' }, body: { status: 'approved' } }, r);
  expect(r.json).toHaveBeenCalledWith(guide);
});

test('deleteGuide: returns success message', async () => {
  Guide.findByIdAndDelete.mockResolvedValue({ _id: 'g1' });
  const r = res();
  await deleteGuide({ params: { id: 'g1' } }, r);
  expect(r.json).toHaveBeenCalledWith({ message: 'Guide deleted' });
});

// userController
test('getUsers: returns all visitors', async () => {
  const users = [{ _id: 'u1', role: 'visitor' }];
  User.find.mockReturnValue({ select: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue(users) }) });
  const r = res();
  await getUsers({}, r);
  expect(User.find).toHaveBeenCalledWith({ role: 'visitor' });
  expect(r.json).toHaveBeenCalledWith(users);
});

test('deleteUser: 403 when trying to delete admin', async () => {
  User.findById.mockResolvedValue({ _id: 'a1', role: 'admin' });
  const r = res();
  await deleteUser({ params: { id: 'a1' } }, r);
  expect(r.status).toHaveBeenCalledWith(403);
});

test('deleteUser: deletes visitor successfully', async () => {
  User.findById.mockResolvedValue({ _id: 'u1', role: 'visitor' });
  User.findByIdAndDelete.mockResolvedValue({ _id: 'u1' });
  const r = res();
  await deleteUser({ params: { id: 'u1' } }, r);
  expect(r.json).toHaveBeenCalledWith({ message: 'User deleted' });
});

// protect middleware
test('protect: 401 when no Authorization header', () => {
  const req = { headers: {} };
  const r = res();
  const next = jest.fn();
  protect(req, r, next);
  expect(r.status).toHaveBeenCalledWith(401);
  expect(next).not.toHaveBeenCalled();
});

test('protect: calls next() with valid token', () => {
  jwt.verify.mockReturnValue({ id: 'u1', role: 'visitor' });
  const req = { headers: { authorization: 'Bearer valid.token' } };
  const r = res();
  const next = jest.fn();
  protect(req, r, next);
  expect(next).toHaveBeenCalled();
  expect(req.user).toEqual({ id: 'u1', role: 'visitor' });
});

test('protect: 401 on invalid token', () => {
  jwt.verify.mockImplementation(() => { throw new Error('invalid'); });
  const req = { headers: { authorization: 'Bearer bad.token' } };
  const r = res();
  protect(req, r, jest.fn());
  expect(r.status).toHaveBeenCalledWith(401);
});

test('requireRole: 403 when user role does not match', () => {
  const req = { user: { role: 'visitor' } };
  const r = res();
  requireRole('admin')(req, r, jest.fn());
  expect(r.status).toHaveBeenCalledWith(403);
});

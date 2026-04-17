const User = require('../models/User');
const { getUsers, deleteUser } = require('../controllers/userController');

jest.mock('../models/User');

function createRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

beforeEach(() => {
  jest.clearAllMocks();
});

// Checks that getUsers queries only visitor accounts
test('getUsers returns visitors list', async () => {
  const req = {};
  const res = createRes();
  const users = [{ _id: 'u1', role: 'visitor' }];

  const sortMock = jest.fn().mockResolvedValue(users);
  const selectMock = jest.fn(() => ({ sort: sortMock }));
  User.find.mockReturnValue({ select: selectMock });

  await getUsers(req, res);

  expect(User.find).toHaveBeenCalledWith({ role: 'visitor' });
  expect(res.json).toHaveBeenCalledWith(users);
});

// Checks that deleteUser blocks deleting admin account
test('deleteUser returns 403 when trying to delete admin', async () => {
  const req = { params: { id: 'admin-id' } };
  const res = createRes();

  User.findById.mockResolvedValue({ _id: 'admin-id', role: 'admin' });

  await deleteUser(req, res);

  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.json).toHaveBeenCalledWith({ message: 'Cannot delete admin account' });
});

// Checks that deleteUser deletes visitor and returns success message
test('deleteUser deletes visitor account', async () => {
  const req = { params: { id: 'visitor-id' } };
  const res = createRes();

  User.findById.mockResolvedValue({ _id: 'visitor-id', role: 'visitor' });
  User.findByIdAndDelete.mockResolvedValue({ _id: 'visitor-id' });

  await deleteUser(req, res);

  expect(User.findByIdAndDelete).toHaveBeenCalledWith('visitor-id');
  expect(res.json).toHaveBeenCalledWith({ message: 'User deleted' });
});

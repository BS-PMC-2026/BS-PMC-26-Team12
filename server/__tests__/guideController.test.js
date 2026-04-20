const Guide = require('../models/Guide');
const {
  getGuides,
  updateGuideStatus,
  deleteGuide,
} = require('../controllers/guideController');

jest.mock('../models/Guide');

function createRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

beforeEach(() => {
  jest.clearAllMocks();
});

// Checks that getGuides returns list without password
test('getGuides returns guides list', async () => {
  const req = {};
  const res = createRes();
  const guides = [{ _id: 'g1', fullName: 'Guide' }];

  const sortMock = jest.fn().mockResolvedValue(guides);
  const selectMock = jest.fn(() => ({ sort: sortMock }));
  Guide.find.mockReturnValue({ select: selectMock });

  await getGuides(req, res);

  expect(res.json).toHaveBeenCalledWith(guides);
});

// Checks that updateGuideStatus rejects invalid status values
test('updateGuideStatus returns 400 for invalid status', async () => {
  const req = { params: { id: 'g1' }, body: { status: 'unknown' } };
  const res = createRes();

  await updateGuideStatus(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ message: 'Invalid status' });
});

// Checks that updateGuideStatus updates and returns guide
test('updateGuideStatus updates guide status', async () => {
  const req = { params: { id: 'g1' }, body: { status: 'approved' } };
  const res = createRes();
  const updated = { _id: 'g1', status: 'approved' };

  const selectMock = jest.fn().mockResolvedValue(updated);
  Guide.findByIdAndUpdate.mockReturnValue({ select: selectMock });

  await updateGuideStatus(req, res);

  expect(res.json).toHaveBeenCalledWith(updated);
});

// Checks that deleteGuide returns 404 when guide does not exist
test('deleteGuide returns 404 when guide is missing', async () => {
  const req = { params: { id: 'g-missing' } };
  const res = createRes();

  Guide.findByIdAndDelete.mockResolvedValue(null);

  await deleteGuide(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ message: 'Guide not found' });
});

jest.mock('../../models/TourFeedback');
jest.mock('../../models/TourOrder');
jest.mock('../../models/Tour');

const TourFeedback = require('../../models/TourFeedback');
const TourOrder    = require('../../models/TourOrder');
const Tour         = require('../../models/Tour');
const { submitFeedback, getMyFeedback, getTourFeedback, getAllFeedback, deleteFeedback } = require('../../controllers/feedbackController');

const res = () => { const r = {}; r.status = jest.fn().mockReturnValue(r); r.json = jest.fn().mockReturnValue(r); return r; };
beforeEach(() => jest.clearAllMocks());

// submitFeedback
test('submitFeedback: 400 when orderId or rating missing', async () => {
  const r = res();
  await submitFeedback({ user: { id: 'u1' }, body: {} }, r);
  expect(r.status).toHaveBeenCalledWith(400);
});

test('submitFeedback: 404 when order not found', async () => {
  TourOrder.findById = jest.fn().mockResolvedValue(null);
  const r = res();
  await submitFeedback({ user: { id: 'u1' }, body: { orderId: 'o1', rating: 4 } }, r);
  expect(r.status).toHaveBeenCalledWith(404);
});

test('submitFeedback: 403 when order belongs to different user', async () => {
  TourOrder.findById = jest.fn().mockResolvedValue({ _id: 'o1', userId: { toString: () => 'other' }, status: 'confirmed', tourId: 't1' });
  const r = res();
  await submitFeedback({ user: { id: 'u1' }, body: { orderId: 'o1', rating: 4 } }, r);
  expect(r.status).toHaveBeenCalledWith(403);
});

test('submitFeedback: 409 when feedback already exists', async () => {
  TourOrder.findById = jest.fn().mockResolvedValue({ _id: 'o1', userId: { toString: () => 'u1' }, status: 'confirmed', tourId: 't1' });
  TourFeedback.findOne = jest.fn().mockResolvedValue({ _id: 'f1' });
  const r = res();
  await submitFeedback({ user: { id: 'u1' }, body: { orderId: 'o1', rating: 4 } }, r);
  expect(r.status).toHaveBeenCalledWith(409);
});

test('submitFeedback: 201 on success', async () => {
  TourOrder.findById = jest.fn().mockResolvedValue({ _id: 'o1', userId: { toString: () => 'u1' }, status: 'confirmed', tourId: 't1' });
  TourFeedback.findOne = jest.fn().mockResolvedValue(null);
  TourFeedback.create = jest.fn().mockResolvedValue({ _id: 'f1', rating: 4 });
  const r = res();
  await submitFeedback({ user: { id: 'u1' }, body: { orderId: 'o1', rating: 4, comment: 'great' } }, r);
  expect(r.status).toHaveBeenCalledWith(201);
  expect(TourFeedback.create).toHaveBeenCalled();
});

// getMyFeedback
test('getMyFeedback: returns user feedbacks', async () => {
  TourFeedback.find = jest.fn().mockResolvedValue([{ _id: 'f1' }]);
  const r = res();
  await getMyFeedback({ user: { id: 'u1' } }, r);
  expect(r.json).toHaveBeenCalledWith([{ _id: 'f1' }]);
});

// getTourFeedback
test('getTourFeedback: 404 when guide does not own tour', async () => {
  Tour.findOne = jest.fn().mockResolvedValue(null);
  const r = res();
  await getTourFeedback({ user: { id: 'g1', role: 'guide' }, params: { tourId: 't1' } }, r);
  expect(r.status).toHaveBeenCalledWith(404);
});

test('getTourFeedback: returns feedbacks with averageRating for admin', async () => {
  const fbs = [{ rating: 4 }, { rating: 2 }];
  TourFeedback.find = jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue(fbs) }) });
  const r = res();
  await getTourFeedback({ user: { id: 'a1', role: 'admin' }, params: { tourId: 't1' } }, r);
  expect(r.json).toHaveBeenCalledWith({ feedbacks: fbs, averageRating: 3, totalRatings: 2 });
});

// getAllFeedback
test('getAllFeedback: returns all feedbacks', async () => {
  TourFeedback.find = jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([]) }) }) });
  const r = res();
  await getAllFeedback({ user: { id: 'a1', role: 'admin' } }, r);
  expect(r.json).toHaveBeenCalledWith([]);
});

// deleteFeedback
test('deleteFeedback: 404 when feedback not found', async () => {
  TourFeedback.findByIdAndDelete = jest.fn().mockResolvedValue(null);
  const r = res();
  await deleteFeedback({ params: { id: 'bad' } }, r);
  expect(r.status).toHaveBeenCalledWith(404);
});

test('deleteFeedback: deletes and returns message', async () => {
  TourFeedback.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: 'f1' });
  const r = res();
  await deleteFeedback({ params: { id: 'f1' } }, r);
  expect(r.json).toHaveBeenCalledWith({ message: 'Feedback deleted' });
});

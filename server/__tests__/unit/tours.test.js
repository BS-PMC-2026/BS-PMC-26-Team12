jest.mock('../../models/Tour');
jest.mock('../../models/TourOrder');

const Tour = require('../../models/Tour');
const TourOrder = require('../../models/TourOrder');
const { createTour, getTours, getTour, getMyTours, updateTour } = require('../../controllers/tourController');
const { bookTour, getMyBookings } = require('../../controllers/tourOrderController');

function res() {
  const r = {};
  r.status = jest.fn().mockReturnValue(r);
  r.json = jest.fn().mockReturnValue(r);
  return r;
}

beforeEach(() => jest.clearAllMocks());

// createTour
test('createTour: 201 on success', async () => {
  const tour = { _id: 't1', title: 'Farm Tour' };
  Tour.create.mockResolvedValue(tour);
  const r = res();
  await createTour({
    body: { title: 'Farm Tour', description: 'Fun', date: '2027-01-01', time: '10:00', price: 20, maxParticipants: 10 },
    user: { id: 'g1' },
  }, r);
  expect(r.status).toHaveBeenCalledWith(201);
  expect(r.json).toHaveBeenCalledWith(tour);
});

test('createTour: 400 when required fields missing', async () => {
  const r = res();
  await createTour({ body: { title: 'Farm Tour' }, user: { id: 'g1' } }, r);
  expect(r.status).toHaveBeenCalledWith(400);
});

test('createTour: 400 when maxParticipants is less than 1', async () => {
  const r = res();
  await createTour({
    body: { title: 'T', description: 'D', date: '2027-01-01', time: '10:00', price: 10, maxParticipants: 0 },
    user: { id: 'g1' },
  }, r);
  expect(r.status).toHaveBeenCalledWith(400);
});

// getTours
test('getTours: returns list of upcoming tours', async () => {
  const tours = [{ _id: 't1', title: 'Farm Tour' }];
  Tour.find.mockReturnValue({ populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue(tours) }) });
  const r = res();
  await getTours({ query: {} }, r);
  expect(r.json).toHaveBeenCalledWith(tours);
});

// getTour
test('getTour: returns single tour by id', async () => {
  const tour = { _id: 't1', title: 'Farm Tour' };
  Tour.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(tour) });
  const r = res();
  await getTour({ params: { id: 't1' } }, r);
  expect(r.json).toHaveBeenCalledWith(tour);
});

test('getTour: 404 when tour not found', async () => {
  Tour.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });
  const r = res();
  await getTour({ params: { id: 'bad' } }, r);
  expect(r.status).toHaveBeenCalledWith(404);
  expect(r.json).toHaveBeenCalledWith({ message: 'Tour not found' });
});

// getMyTours
test('getMyTours: returns tours for the authenticated guide', async () => {
  const tours = [{ _id: 't1', guideId: 'g1' }];
  Tour.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(tours) });
  const r = res();
  await getMyTours({ user: { id: 'g1' } }, r);
  expect(Tour.find).toHaveBeenCalledWith({ guideId: 'g1' });
  expect(r.json).toHaveBeenCalledWith(tours);
});

// updateTour
test('updateTour: 404 when tour not found', async () => {
  Tour.findOne.mockResolvedValue(null);
  const r = res();
  await updateTour({
    params: { id: 'bad' }, user: { id: 'g1' },
    body: { title: 'T', description: 'D', date: '2027-01-01', time: '10:00', price: 10, maxParticipants: 5 },
  }, r);
  expect(r.status).toHaveBeenCalledWith(404);
});

test('updateTour: 400 when maxParticipants below booked slots', async () => {
  Tour.findOne.mockResolvedValue({ _id: 't1', bookedSlots: 8, save: jest.fn() });
  const r = res();
  await updateTour({
    params: { id: 't1' }, user: { id: 'g1' },
    body: { title: 'T', description: 'D', date: '2027-01-01', time: '10:00', price: 10, maxParticipants: 5 },
  }, r);
  expect(r.status).toHaveBeenCalledWith(400);
});

// bookTour
test('bookTour: 201 on successful booking', async () => {
  Tour.findById.mockResolvedValue({ _id: 't1', maxParticipants: 10, bookedSlots: 2, save: jest.fn() });
  TourOrder.create.mockResolvedValue({ _id: 'to1' });
  TourOrder.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue({ _id: 'to1' }) });
  const r = res();
  await bookTour({ body: { tourId: 't1', numberOfTickets: 2 }, user: { id: 'u1' } }, r);
  expect(r.status).toHaveBeenCalledWith(201);
});

test('bookTour: 400 when not enough slots available', async () => {
  Tour.findById.mockResolvedValue({ _id: 't1', maxParticipants: 5, bookedSlots: 4 });
  const r = res();
  await bookTour({ body: { tourId: 't1', numberOfTickets: 3 }, user: { id: 'u1' } }, r);
  expect(r.status).toHaveBeenCalledWith(400);
});

// getMyBookings
test('getMyBookings: returns bookings for authenticated user', async () => {
  const bookings = [{ _id: 'b1' }];
  TourOrder.find.mockReturnValue({ populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue(bookings) }) });
  const r = res();
  await getMyBookings({ user: { id: 'u1' } }, r);
  expect(r.json).toHaveBeenCalledWith(bookings);
});

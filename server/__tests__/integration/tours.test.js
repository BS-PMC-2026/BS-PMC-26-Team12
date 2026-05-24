jest.mock('../../models/Tour');

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../app');
const Tour = require('../../models/Tour');

const guideToken = jwt.sign({ id: 'g1', role: 'guide' }, process.env.JWT_SECRET);
const visitorToken = jwt.sign({ id: 'u1', role: 'visitor' }, process.env.JWT_SECRET);

beforeEach(() => jest.clearAllMocks());

it('GET /api/tours: 200 without auth token (public route)', async () => {
  Tour.find.mockReturnValue({ populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([]) }) });
  const res = await request(app).get('/api/tours');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

it('GET /api/tours/:id: 200 without auth token', async () => {
  Tour.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue({ _id: 't1', title: 'Farm Tour' }) });
  const res = await request(app).get('/api/tours/t1');
  expect(res.status).toBe(200);
  expect(res.body.title).toBe('Farm Tour');
});

it('GET /api/tours/:id: 404 when tour does not exist', async () => {
  Tour.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });
  const res = await request(app).get('/api/tours/nonexistent');
  expect(res.status).toBe(404);
});

it('POST /api/tours: 401 without auth token', async () => {
  const res = await request(app).post('/api/tours').send({ title: 'T' });
  expect(res.status).toBe(401);
});

it('POST /api/tours: 403 when visitor tries to create tour', async () => {
  const res = await request(app)
    .post('/api/tours')
    .set('Authorization', `Bearer ${visitorToken}`)
    .send({ title: 'T', description: 'D', date: '2027-01-01', time: '10:00', price: 20, maxParticipants: 10 });
  expect(res.status).toBe(403);
});

it('POST /api/tours: 201 when guide creates tour', async () => {
  Tour.create.mockResolvedValue({ _id: 't1', title: 'Farm Tour' });
  const res = await request(app)
    .post('/api/tours')
    .set('Authorization', `Bearer ${guideToken}`)
    .send({ title: 'Farm Tour', description: 'Fun', date: '2027-01-01', time: '10:00', price: 20, maxParticipants: 10 });
  expect(res.status).toBe(201);
});

jest.mock('../../models/Pepper');
jest.mock('express-validator', () => ({ validationResult: jest.fn() }));

const Pepper = require('../../models/Pepper');
const { validationResult } = require('express-validator');
const { addPepper, getPeppers, getPepper, deletePepper } = require('../../controllers/pepperController');

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
});

// addPepper
test('addPepper: 201 on success', async () => {
  Pepper.findOne.mockResolvedValue(null);
  const pepper = { _id: 'p1', name: 'Ghost' };
  Pepper.create.mockResolvedValue(pepper);
  const r = res();
  await addPepper({ body: { name: 'Ghost', description: 'Very hot' }, user: { id: 'u1' } }, r);
  expect(r.status).toHaveBeenCalledWith(201);
  expect(r.json).toHaveBeenCalledWith(pepper);
});

test('addPepper: 409 when pepper name already exists', async () => {
  Pepper.findOne.mockResolvedValue({ _id: 'existing' });
  const r = res();
  await addPepper({ body: { name: 'Ghost' }, user: { id: 'u1' } }, r);
  expect(r.status).toHaveBeenCalledWith(409);
});

test('addPepper: 400 on validation errors', async () => {
  validationResult.mockReturnValue(fail);
  const r = res();
  await addPepper({ body: {}, user: { id: 'u1' } }, r);
  expect(r.status).toHaveBeenCalledWith(400);
});

// getPeppers
test('getPeppers: returns all peppers with no search', async () => {
  const peppers = [{ _id: 'p1', name: 'Ghost' }];
  Pepper.find.mockReturnValue({ select: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue(peppers) }) });
  const r = res();
  await getPeppers({ query: {} }, r);
  expect(r.json).toHaveBeenCalledWith(peppers);
});

test('getPeppers: filters by search term', async () => {
  Pepper.find.mockReturnValue({ select: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([]) }) });
  const r = res();
  await getPeppers({ query: { search: 'ghost' } }, r);
  expect(Pepper.find).toHaveBeenCalledWith({ name: { $regex: 'ghost', $options: 'i' } });
});

// getPepper
test('getPepper: returns pepper by id', async () => {
  const pepper = { _id: 'p1', name: 'Ghost' };
  Pepper.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(pepper) });
  const r = res();
  await getPepper({ params: { id: 'p1' } }, r);
  expect(r.json).toHaveBeenCalledWith(pepper);
});

test('getPepper: 404 when not found', async () => {
  Pepper.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });
  const r = res();
  await getPepper({ params: { id: 'bad' } }, r);
  expect(r.status).toHaveBeenCalledWith(404);
  expect(r.json).toHaveBeenCalledWith({ message: 'Pepper not found' });
});

// deletePepper
test('deletePepper: returns success message', async () => {
  Pepper.findByIdAndDelete.mockResolvedValue({ _id: 'p1' });
  const r = res();
  await deletePepper({ params: { id: 'p1' } }, r);
  expect(r.json).toHaveBeenCalledWith({ message: 'Pepper deleted' });
});

test('deletePepper: 404 when not found', async () => {
  Pepper.findByIdAndDelete.mockResolvedValue(null);
  const r = res();
  await deletePepper({ params: { id: 'bad' } }, r);
  expect(r.status).toHaveBeenCalledWith(404);
});

const Pepper = require('../models/Pepper');
const { validationResult } = require('express-validator');
const {
  addPepper,
  getPeppers,
  updatePepper,
} = require('../controllers/pepperController');

jest.mock('../models/Pepper');
jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

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
});

// Checks that addPepper returns 409 when name already exists
test('addPepper returns 409 when duplicate pepper exists', async () => {
  const req = {
    body: {
      name: 'Jalapeno',
      description: 'Spicy pepper',
      scoville: '2500-8000 SHU',
      heatLevel: 'Medium',
    },
    user: { id: 'admin-id' },
  };
  const res = createRes();

  Pepper.findOne.mockResolvedValue({ _id: 'existing-id' });

  await addPepper(req, res);

  expect(res.status).toHaveBeenCalledWith(409);
  expect(res.json).toHaveBeenCalledWith({ message: 'A pepper with this name already exists' });
});

// Checks that addPepper creates a new pepper and trims text fields
test('addPepper creates pepper and trims text fields', async () => {
  const req = {
    body: {
      name: '  Habanero  ',
      description: '  Very hot pepper  ',
      imageUrl: 'http://img.test/hab.jpg',
      origin: 'Mexico',
      color: 'Orange',
      scoville: '100,000-350,000 SHU',
      heatLevel: 'Very Hot',
    },
    user: { id: 'admin-id' },
  };
  const res = createRes();

  Pepper.findOne.mockResolvedValue(null);
  Pepper.create.mockResolvedValue({ _id: 'new-id', name: 'Habanero' });

  await addPepper(req, res);

  expect(Pepper.create).toHaveBeenCalledWith({
    name: 'Habanero',
    description: 'Very hot pepper',
    imageUrl: 'http://img.test/hab.jpg',
    origin: 'Mexico',
    color: 'Orange',
    scoville: '100,000-350,000 SHU',
    heatLevel: 'Very Hot',
    createdBy: 'admin-id',
  });
  expect(res.status).toHaveBeenCalledWith(201);
});

// Checks that getPeppers applies name regex when search is provided
test('getPeppers applies name regex when search exists', async () => {
  const req = { query: { search: 'jal' } };
  const res = createRes();

  const sortMock = jest.fn().mockResolvedValue([{ name: 'Jalapeño' }]);
  const selectMock = jest.fn(() => ({ sort: sortMock }));
  Pepper.find.mockReturnValue({ select: selectMock });

  await getPeppers(req, res);

  expect(Pepper.find).toHaveBeenCalledWith({
    name: { $regex: 'jal', $options: 'i' },
  });
  expect(res.json).toHaveBeenCalledWith([{ name: 'Jalapeño' }]);
});

// Checks that updatePepper updates fields and saves the document
test('updatePepper updates pepper fields and saves', async () => {
  const pepperDoc = {
    _id: 'pepper-id',
    save: jest.fn().mockResolvedValue(),
  };

  const req = {
    params: { id: 'pepper-id' },
    body: {
      name: 'Carolina Reaper',
      description: 'Extreme heat',
      imageUrl: 'http://img.test/reaper.jpg',
      origin: 'USA',
      color: 'Red',
      scoville: '1,400,000-2,200,000 SHU',
      heatLevel: 'Extreme',
    },
  };
  const res = createRes();

  Pepper.findById.mockResolvedValue(pepperDoc);
  Pepper.findOne.mockResolvedValue(null);

  await updatePepper(req, res);

  expect(pepperDoc.name).toBe('Carolina Reaper');
  expect(pepperDoc.scoville).toBe('1,400,000-2,200,000 SHU');
  expect(pepperDoc.save).toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledWith(pepperDoc);
});

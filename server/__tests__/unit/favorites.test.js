jest.mock('../../models/User');
jest.mock('../../models/Tour');

const User = require('../../models/User');
const Tour = require('../../models/Tour');
const { getFavorites, addFavorite, removeFavorite } = require('../../controllers/favoritesController');

const res = () => { const r = {}; r.status = jest.fn().mockReturnValue(r); r.json = jest.fn().mockReturnValue(r); return r; };
beforeEach(() => jest.clearAllMocks());

// getFavorites
test('getFavorites: returns user favorites', async () => {
  const favs = [{ _id: 't1', title: 'Tour A' }];
  User.findById = jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue({ favorites: favs }) });
  const r = res();
  await getFavorites({ user: { id: 'u1' } }, r);
  expect(r.json).toHaveBeenCalledWith(favs);
});

test('getFavorites: returns empty array when no favorites', async () => {
  User.findById = jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue({ favorites: null }) });
  const r = res();
  await getFavorites({ user: { id: 'u1' } }, r);
  expect(r.json).toHaveBeenCalledWith([]);
});

// addFavorite
test('addFavorite: 404 when tour not found', async () => {
  Tour.findById = jest.fn().mockResolvedValue(null);
  const r = res();
  await addFavorite({ user: { id: 'u1' }, params: { tourId: 'bad' } }, r);
  expect(r.status).toHaveBeenCalledWith(404);
});

test('addFavorite: 409 when already favorited', async () => {
  Tour.findById = jest.fn().mockResolvedValue({ _id: 't1' });
  User.findById = jest.fn().mockResolvedValue({ favorites: [{ toString: () => 't1' }] });
  const r = res();
  await addFavorite({ user: { id: 'u1' }, params: { tourId: 't1' } }, r);
  expect(r.status).toHaveBeenCalledWith(409);
});

test('addFavorite: adds tour and returns updated favorites', async () => {
  Tour.findById = jest.fn().mockResolvedValue({ _id: 't1' });
  const favs = { map: jest.fn().mockReturnValue([]), push: jest.fn() };
  const mockUser = { favorites: favs, save: jest.fn().mockResolvedValue(), populate: jest.fn().mockResolvedValue() };
  User.findById = jest.fn().mockResolvedValue(mockUser);
  const r = res();
  await addFavorite({ user: { id: 'u1' }, params: { tourId: 't1' } }, r);
  expect(favs.push).toHaveBeenCalledWith('t1');
  expect(mockUser.save).toHaveBeenCalled();
});

// removeFavorite
test('removeFavorite: removes tour and returns updated favorites', async () => {
  const mockUser = {
    favorites: [{ toString: () => 't1' }, { toString: () => 't2' }],
    save: jest.fn().mockResolvedValue(),
    populate: jest.fn().mockResolvedValue(),
  };
  User.findById = jest.fn().mockResolvedValue(mockUser);
  const r = res();
  await removeFavorite({ user: { id: 'u1' }, params: { tourId: 't1' } }, r);
  expect(mockUser.favorites.length).toBe(1);
  expect(mockUser.save).toHaveBeenCalled();
});

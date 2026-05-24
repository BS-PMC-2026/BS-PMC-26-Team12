jest.mock('../../models/CartItem');
jest.mock('../../models/Product');

const CartItem = require('../../models/CartItem');
const Product = require('../../models/Product');
const { getCart, addToCart, updateCartItem, removeFromCart } = require('../../controllers/cartController');

function res() {
  const r = {};
  r.status = jest.fn().mockReturnValue(r);
  r.json = jest.fn().mockReturnValue(r);
  return r;
}

beforeEach(() => jest.clearAllMocks());

// getCart
test('getCart: returns cart items for authenticated user', async () => {
  const items = [{ _id: 'c1', productId: 'p1', quantity: 2 }];
  CartItem.find.mockReturnValue({ populate: jest.fn().mockResolvedValue(items) });
  const r = res();
  await getCart({ user: { id: 'u1' } }, r);
  expect(CartItem.find).toHaveBeenCalledWith({ userId: 'u1' });
  expect(r.json).toHaveBeenCalledWith(items);
});

// addToCart
test('addToCart: 404 when product not found', async () => {
  Product.findById.mockResolvedValue(null);
  const r = res();
  await addToCart({ body: { productId: 'bad', quantity: 1 }, user: { id: 'u1' } }, r);
  expect(r.status).toHaveBeenCalledWith(404);
});

test('addToCart: 400 when stock is insufficient for new item', async () => {
  Product.findById.mockResolvedValue({ _id: 'p1', stock: 1 });
  const r = res();
  await addToCart({ body: { productId: 'p1', quantity: 5 }, user: { id: 'u1' } }, r);
  expect(r.status).toHaveBeenCalledWith(400);
  expect(r.json).toHaveBeenCalledWith({ message: 'Not enough stock available' });
});

test('addToCart: creates new cart item on success', async () => {
  Product.findById.mockResolvedValue({ _id: 'p1', stock: 10 });
  CartItem.findOne.mockResolvedValue(null);
  const item = { _id: 'c1', quantity: 1, populate: jest.fn().mockResolvedValue({ _id: 'c1', quantity: 1 }) };
  CartItem.create.mockResolvedValue(item);
  const r = res();
  await addToCart({ body: { productId: 'p1', quantity: 1 }, user: { id: 'u1' } }, r);
  expect(CartItem.create).toHaveBeenCalled();
  expect(r.json).toHaveBeenCalled();
});

test('addToCart: increments quantity when item already in cart', async () => {
  Product.findById.mockResolvedValue({ _id: 'p1', stock: 10 });
  const item = { _id: 'c1', quantity: 2, save: jest.fn(), populate: jest.fn().mockResolvedValue({ _id: 'c1', quantity: 3 }) };
  CartItem.findOne.mockResolvedValue(item);
  const r = res();
  await addToCart({ body: { productId: 'p1', quantity: 1 }, user: { id: 'u1' } }, r);
  expect(item.save).toHaveBeenCalled();
});

// updateCartItem
test('updateCartItem: 404 when item not found', async () => {
  CartItem.findOne.mockResolvedValue(null);
  const r = res();
  await updateCartItem({ params: { id: 'bad' }, body: { quantity: 2 }, user: { id: 'u1' } }, r);
  expect(r.status).toHaveBeenCalledWith(404);
});

test('updateCartItem: 400 when quantity is less than 1', async () => {
  const r = res();
  await updateCartItem({ params: { id: 'c1' }, body: { quantity: 0 }, user: { id: 'u1' } }, r);
  expect(r.status).toHaveBeenCalledWith(400);
});

test('updateCartItem: 400 when stock is insufficient', async () => {
  CartItem.findOne.mockResolvedValue({ _id: 'c1', productId: 'p1' });
  Product.findById.mockResolvedValue({ _id: 'p1', stock: 1 });
  const r = res();
  await updateCartItem({ params: { id: 'c1' }, body: { quantity: 5 }, user: { id: 'u1' } }, r);
  expect(r.status).toHaveBeenCalledWith(400);
});

// removeFromCart
test('removeFromCart: returns success message', async () => {
  CartItem.findOneAndDelete.mockResolvedValue({ _id: 'c1' });
  const r = res();
  await removeFromCart({ params: { id: 'c1' }, user: { id: 'u1' } }, r);
  expect(r.json).toHaveBeenCalledWith({ message: 'Item removed from cart' });
});

test('removeFromCart: 404 when item not found', async () => {
  CartItem.findOneAndDelete.mockResolvedValue(null);
  const r = res();
  await removeFromCart({ params: { id: 'bad' }, user: { id: 'u1' } }, r);
  expect(r.status).toHaveBeenCalledWith(404);
});

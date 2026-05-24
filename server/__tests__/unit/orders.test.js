jest.mock('../../models/CartItem');
jest.mock('../../models/Product');
jest.mock('../../models/Order');
jest.mock('../../models/OrderItem');

const CartItem = require('../../models/CartItem');
const Product = require('../../models/Product');
const Order = require('../../models/Order');
const OrderItem = require('../../models/OrderItem');
const { checkout, getOrders, updateOrderStatus, getMyOrders } = require('../../controllers/orderController');

function res() {
  const r = {};
  r.status = jest.fn().mockReturnValue(r);
  r.json = jest.fn().mockReturnValue(r);
  return r;
}

beforeEach(() => jest.clearAllMocks());

// checkout
test('checkout: 400 when cart is empty', async () => {
  CartItem.find.mockReturnValue({ populate: jest.fn().mockResolvedValue([]) });
  const r = res();
  await checkout({ user: { id: 'u1' } }, r);
  expect(r.status).toHaveBeenCalledWith(400);
  expect(r.json).toHaveBeenCalledWith({ message: 'Cart is empty' });
});

test('checkout: 400 when a product has insufficient stock', async () => {
  const items = [{ productId: { _id: 'p1', name: 'Sauce', price: 10, stock: 1 }, quantity: 3 }];
  CartItem.find.mockReturnValue({ populate: jest.fn().mockResolvedValue(items) });
  const r = res();
  await checkout({ user: { id: 'u1' } }, r);
  expect(r.status).toHaveBeenCalledWith(400);
});

test('checkout: 201 with order on success', async () => {
  const items = [{ _id: 'c1', productId: { _id: 'p1', name: 'Sauce', price: 10, stock: 5 }, quantity: 2 }];
  CartItem.find.mockReturnValue({ populate: jest.fn().mockResolvedValue(items) });
  const order = { _id: 'o1', userId: 'u1', totalAmount: 20 };
  Order.create.mockResolvedValue(order);
  OrderItem.insertMany.mockResolvedValue([{ _id: 'oi1' }]);
  Product.findByIdAndUpdate.mockResolvedValue({});
  CartItem.deleteMany.mockResolvedValue({});
  const r = res();
  await checkout({ user: { id: 'u1' } }, r);
  expect(r.status).toHaveBeenCalledWith(201);
  expect(Order.create).toHaveBeenCalled();
  expect(CartItem.deleteMany).toHaveBeenCalledWith({ _id: { $in: ['c1'] } });
});

// getOrders
test('getOrders: returns all orders with items', async () => {
  const order = { _id: 'o1', toObject: jest.fn().mockReturnValue({ _id: 'o1' }) };
  Order.find.mockReturnValue({ populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([order]) }) });
  OrderItem.find.mockReturnValue({ populate: jest.fn().mockResolvedValue([]) });
  const r = res();
  await getOrders({}, r);
  expect(r.json).toHaveBeenCalledWith([{ _id: 'o1', items: [] }]);
});

// updateOrderStatus
test('updateOrderStatus: 400 on invalid status', async () => {
  const r = res();
  await updateOrderStatus({ params: { id: 'o1' }, body: { status: 'flying' } }, r);
  expect(r.status).toHaveBeenCalledWith(400);
});

test('updateOrderStatus: 404 when order not found', async () => {
  Order.findByIdAndUpdate.mockResolvedValue(null);
  const r = res();
  await updateOrderStatus({ params: { id: 'bad' }, body: { status: 'shipped' } }, r);
  expect(r.status).toHaveBeenCalledWith(404);
});

test('updateOrderStatus: returns updated order', async () => {
  const order = { _id: 'o1', status: 'shipped' };
  Order.findByIdAndUpdate.mockResolvedValue(order);
  const r = res();
  await updateOrderStatus({ params: { id: 'o1' }, body: { status: 'shipped' } }, r);
  expect(r.json).toHaveBeenCalledWith(order);
});

// getMyOrders
test('getMyOrders: returns orders for authenticated user', async () => {
  const order = { _id: 'o1', userId: 'u1', toObject: jest.fn().mockReturnValue({ _id: 'o1' }) };
  Order.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([order]) });
  OrderItem.find.mockReturnValue({ populate: jest.fn().mockResolvedValue([]) });
  const r = res();
  await getMyOrders({ user: { id: 'u1' } }, r);
  expect(Order.find).toHaveBeenCalledWith({ userId: 'u1' });
  expect(r.json).toHaveBeenCalledWith([{ _id: 'o1', items: [] }]);
});

const func = require('../Task2.js');

test('calculateCartTotal should return the sum of product prices in the cart', () => {
  const cart = { products: [{ productId: 1, quantity: 1 }, { productId: 2, quantity: 2 }, { productId: 3, quantity: 3 }] };
  const products = [{ id: 1, price: 10 }, { id: 2, price: 20 }, { id: 3, price: 30 }];
  const result = func.calculateCartTotal(cart, products);
  expect(result).toEqual(140);
});

test('calculateDistance should return the correct distance between two coordinates', () => {
  const geo1 = { lat: '37.7749', lng: '-122.4194' };
  const geo2 = { lat: '51.5074', lng: '0.1278' };
  const result = func.calculateDistance(geo1, geo2);
  expect(result).toBeCloseTo(8619, -2);
});

test('degToRad should return the correct value after conversion', () => {
  const deg = 360;
  const result = func.degToRad(deg);
  expect(result).toBeCloseTo(2*Math.PI,-2);
});


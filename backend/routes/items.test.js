import request from 'supertest';
import app from '../app';
import {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  adminToken
} from './_testCommon';

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('GET /items', () => {
  test('should get all items', async () => {
    const resp = await request(app).get('/items');
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual(expect.any(Array));
    expect(resp.body.length).toBeGreaterThan(0);
  });
});

describe('GET /items/availability', () => {
  test('should get items based on month and hemisphere', async () => {
    const resp = await request(app).get('/items/availability').query({ month: 'May', hemisphere: 'north' });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual(expect.any(Array));
  });
});

describe('GET /items/type/:itemtype', () => {
  test('should get items by type', async () => {
    const resp = await request(app).get('/items/type/Fish');
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual(expect.any(Array));
  });
});

describe('GET /items/search', () => {
  test('should search items by name and type', async () => {
    const resp = await request(app).get('/items/search').query({ name: 'Sea Bass', type: 'Fish' });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual(expect.any(Array));
  });
});

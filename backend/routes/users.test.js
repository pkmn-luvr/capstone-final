import request from 'supertest';
import app from '../app.js'; 
import { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, u1Token, adminToken } from './_testCommon.js';

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /users/:username", function () {
  test("works for the correct user", async function () {
    const resp = await request(app)
      .get(`/users/user1`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      user: expect.any(Object)
    });
  });

  test("works for admin", async function () {
    const resp = await request(app)
      .get(`/users/adminUser`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toBe(200);
  });

  test("unauth for wrong user", async function () {
    const resp = await request(app)
      .get(`/users/user2`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toBe(401);
  });
});

describe("GET /users/:username/collections", function () {
    test("works for the correct user viewing their own collections", async function () {
        const resp = await request(app)
            .get(`/users/user1/collections`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            collections: expect.any(Array)
        });
    });

    test("unauthorized if a user tries to view another user's collections", async function () {
        const resp = await request(app)
            .get(`/users/user1/collections`)
            .set("authorization", `Bearer ${adminToken}`);  
        expect(resp.statusCode).toBe(401);
    });
});




import request from "supertest";
import app from "../app.js";
import jwt from "jsonwebtoken";  
import { SECRET_KEY } from "../config";  
import { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } from "./_testCommon.js";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /auth/token */

describe("POST /auth/token", function () {
  test("works", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: "user1",
        password: "password1",
      });
    expect(resp.body).toEqual({
      token: expect.any(String),
    });
  });

  test("unauth with non-existent user", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: "nonuser",
        password: "nonpassword",
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth with wrong password", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: "user1",
        password: "wrongpw",
      });
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** POST /auth/register */

describe("POST /auth/register", function () {
  test("works for registering new user", async function () {
    const resp = await request(app)
      .post("/auth/register")
      .send({
        username: "newuser",
        password: "newpassword",
        email: "new@user.com",
        userhemisphere: "north"
      });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      token: expect.any(String),
    });
    const payload = jwt.verify(resp.body.token, SECRET_KEY);
    expect(payload.isadmin).toBe(false);  // Verify the isadmin field in the JWT
  });

  test("cannot set isadmin through registration", async function () {
    const resp = await request(app)
      .post("/auth/register")
      .send({
        username: "secTestUser",
        password: "password",
        email: "secTest@test.com",
        userhemisphere: "north",
        isadmin: true  
      });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with missing fields", async function () {
    const resp = await request(app)
      .post("/auth/register")
      .send({
        username: "newuser"
      });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/auth/register")
      .send({
        username: "newuser",
        password: "newpassword",
        email: "invalid-email",
        userhemisphere: "south"
      });
    expect(resp.statusCode).toEqual(400);
  });
});

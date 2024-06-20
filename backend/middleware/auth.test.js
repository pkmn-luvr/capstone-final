import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { authenticateJWT, ensureLoggedIn, ensureAdmin, ensureCorrectUserOrAdmin } from '../middleware/auth.js';
import { UnauthorizedError } from '../expressError.js';
import { SECRET_KEY } from '../config.js';


const res = {};
let next;

let req;

beforeEach(() => {
  const userPayload = { username: "testuser", isadmin: false };
  const validToken = jwt.sign(userPayload, SECRET_KEY);
  req = { headers: { authorization: `Bearer ${validToken}` } };
  
  res.locals = {};
  res.send = jest.fn();
  res.status = jest.fn(() => res);
  next = jest.fn();
});


describe("authenticateJWT", () => {
  test("works: via header", () => {
    authenticateJWT(req, res, next); 
    expect(res.locals.user).toMatchObject({ username: "testuser", isadmin: false });
    expect(next).toHaveBeenCalledWith();
  });
  

  test("unauthenticated: no header", () => {
    const reqNoHeader = { headers: {} }; 
    authenticateJWT(reqNoHeader, res, next);
    expect(res.locals.user).toBeUndefined();
    expect(next).toHaveBeenCalledWith();
  });
});


describe("ensureLoggedIn", () => {
  test("works", () => {
    res.locals.user = { username: "testuser" };

    ensureLoggedIn({}, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test("unauthorized if no user", () => {
    ensureLoggedIn({}, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });
});

describe("ensureAdmin", () => {
  test("works", () => {
    res.locals.user = { username: "admin", isadmin: true };

    ensureAdmin({}, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test("unauthorized if not admin", () => {
    res.locals.user = { username: "testuser", isadmin: false };

    ensureAdmin({}, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });
});

describe("ensureCorrectUserOrAdmin", () => {
  test("works: correct user", () => {
    res.locals.user = { username: "testuser", isadmin: false };
    const req = { params: { username: "testuser" } };

    ensureCorrectUserOrAdmin(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test("works: admin", () => {
    res.locals.user = { username: "admin", isadmin: true };
    const req = { params: { username: "testuser" } };

    ensureCorrectUserOrAdmin(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test("unauthorized if not correct user and not admin", () => {
    res.locals.user = { username: "testuser", isadmin: false };
    const req = { params: { username: "anotheruser" } };

    ensureCorrectUserOrAdmin(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });
});

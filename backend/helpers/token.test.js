import jwt from 'jsonwebtoken';
import { createToken } from './token.js';
import { SECRET_KEY } from '../config.js';

describe("createToken", function () {
  test("works: not admin", function () {
    const token = createToken({ 
      username: "test", 
      isadmin: false, 
      userhemisphere: "north", 
      email: "test@example.com", 
      profilephoto: "http://example.com/photo.jpg", 
      bio: "This is a test bio"
    });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "test",
      isadmin: false,
      userhemisphere: "north",
      email: "test@example.com",
      profilephoto: "http://example.com/photo.jpg",
      bio: "This is a test bio",
    });
  });

  test("works: admin", function () {
    const token = createToken({ 
      username: "test", 
      isadmin: true, 
      userhemisphere: "south", 
      email: "admin@example.com", 
      profilephoto: "http://example.com/adminphoto.jpg", 
      bio: "Admin bio"
    });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "test",
      isadmin: true,
      userhemisphere: "south",
      email: "admin@example.com",
      profilephoto: "http://example.com/adminphoto.jpg",
      bio: "Admin bio",
    });
  });

  test("works: default no admin", function () {
    const token = createToken({ 
      username: "test", 
      userhemisphere: "north", 
      email: "test@example.com", 
      profilephoto: "http://example.com/photo.jpg", 
      bio: "This is a test bio"
    });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "test",
      isadmin: false,
      userhemisphere: "north",
      email: "test@example.com",
      profilephoto: "http://example.com/photo.jpg",
      bio: "This is a test bio",
    });
  });
});

import bcrypt from 'bcrypt';
import { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } from './_testCommon';
import User from '../models/user.js';
import db from '../db';

beforeAll(async () => {
  await commonBeforeAll();
});

beforeEach(async () => {
  await commonBeforeEach();

  // Hash passwords
  const hashedPassword1 = await bcrypt.hash('password1', 12);
  const hashedPassword2 = await bcrypt.hash('password2', 12);
  
  // Insert users with lowercase column names
  await db.query(`
    INSERT INTO users (username, email, passwordhash, userhemisphere, profilephoto, bio)
    VALUES ('testuser1', 'test1@example.com', $1, 'north', 'http://example.com/photo1.jpg', 'Test bio 1'),
           ('testuser2', 'test2@example.com', $2, 'south', 'http://example.com/photo2.jpg', 'Test bio 2');
  `, [hashedPassword1, hashedPassword2]);
});

afterEach(async () => {
  await commonAfterEach();
});

afterAll(async () => {
  await commonAfterAll();
});

describe("User Model Tests", () => {
  test("User.register successfully creates a new user", async () => {
    const newUser = await User.register({
      username: "testuser3",
      password: "password3",
      email: "test3@example.com",
      userhemisphere: "north"
    });
  
    expect(newUser).toHaveProperty("id");
    expect(newUser.username).toEqual("testuser3");
    expect(newUser.email).toEqual("test3@example.com");
    expect(newUser.userhemisphere).toEqual("north");
  });

  test("User.findByUsername returns a user by username", async () => {
    const foundUser = await User.findByUsername("testuser1");
  
    expect(foundUser.username).toEqual("testuser1");
    expect(foundUser.email).toEqual("test1@example.com");
    expect(foundUser.userhemisphere).toEqual("north");
  });

  test("User.update updates user details", async () => {
    const updatedUser = await User.update("testuser1", { bio: "Updated bio" });

    expect(updatedUser.bio).toEqual("Updated bio");
    expect(updatedUser.username).toEqual("testuser1");
    expect(updatedUser.email).toEqual("test1@example.com");
    expect(updatedUser.userhemisphere).toEqual("north");
    expect(updatedUser.profilephoto).toEqual("http://example.com/photo1.jpg");
  });

  test("User.remove deletes a user", async () => {
    const removedUser = await User.remove("testuser1");

    expect(removedUser.username).toEqual("testuser1");
  });

  test("User.authenticate successfully authenticates a user with correct credentials", async () => {
    const user = await User.authenticate("testuser1", "password1");

    expect(user).toHaveProperty("id");
    expect(user.username).toEqual("testuser1");
    expect(user.email).toEqual("test1@example.com");
    expect(user.userhemisphere).toEqual("north");
    expect(user.profilephoto).toEqual("http://example.com/photo1.jpg");
  });

  test("User.authenticate throws an error with incorrect credentials", async () => {
    try {
      await User.authenticate("testuser1", "wrongpassword");
      throw new Error("Expected authenticate to throw an error");
    } catch (err) {
      expect(err.message).toEqual("Invalid username/password");
    }
  });
});

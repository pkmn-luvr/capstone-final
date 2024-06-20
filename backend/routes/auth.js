import express from "express";
import jsonschema from "jsonschema";
import User from "../models/user.js";
import userAuthSchema from "../schemas/userAuth.json" assert { type: "json" }; 
import userRegisterSchema from "../schemas/userRegister.json" assert { type: "json" }; 
import { createToken } from "../helpers/token.js";
import { BadRequestError } from "../expressError.js";

const router = new express.Router();

/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */
router.post("/token", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    if (!user) { 
      throw new UnauthorizedError("Invalid username or password");
    }
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

/** 
 * POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, email, userHemisphere } and optionally { firstName, lastName, profilePhoto, bio, createdAt, updatedAt }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", async (req, res, next) => {
  try {
    // Validate the input using jsonschema
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    // Check if 'isadmin' is included and set to true
    if (req.body.isadmin === true) {
      throw new BadRequestError("Setting 'isadmin' property is not allowed.");
    }

    // Register user (without passing 'isadmin' from request body)
    const newUser = await User.register({ ...req.body, isadmin: false }); // Explicitly setting isadmin to false for new users
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});




export default router;

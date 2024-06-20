import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config.js';
import { UnauthorizedError } from '../expressError.js';

function authenticateJWT(req, res, next) {
  console.log("authenticateJWT middleware called"); 

  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
      console.log("JWT authentication successful for:", res.locals.user.username);
    } 


    return next();
  } catch (err) {
    console.log("JWT authentication failed", err);
    return next();
  }
}


// For protected routes
function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

function ensureAdmin(req, res, next) {
  try {
    if (!res.locals.user) {
      throw new UnauthorizedError("Access denied. Please log in.");
    }
    if (!res.locals.user.isadmin) {
      throw new UnauthorizedError("Access denied. Admin privileges required.");
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

function ensureCorrectUserOrAdmin(req, res, next) {
  console.log("ensureCorrectUserOrAdmin middleware called");
  try {
      const user = res.locals.user;
      console.log(`User in middleware: ${JSON.stringify(user)}`);
      console.log(`Request params username: ${req.params.username}`);
      
      if (!(user && (user.isadmin || user.username === req.params.username))) {
          console.log("User is not authorized");
          throw new UnauthorizedError();
      }
      console.log("Authorization successful");
      return next();
  } catch (err) {
      console.log(`Authorization failed: ${err}`);
      return next(err);
  }
}



export {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUserOrAdmin
};

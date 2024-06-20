import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config.js';

/** Return signed JWT from user data. */
function createToken(user) {
  console.assert(user.isadmin !== undefined, "createToken passed user without isadmin property");

  let payload = {
    username: user.username,
    isadmin: user.isadmin || false,
    userhemisphere: user.userhemisphere,
    email: user.email,  
    profilephoto: user.profilephoto,
    bio: user.bio,
  };

  return jwt.sign(payload, SECRET_KEY);
}


export { createToken };




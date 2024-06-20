import db from '../db.js';
import bcrypt from 'bcrypt';
import { UnauthorizedError } from '../expressError.js';
import { sqlForPartialUpdate } from '../helpers/sql.js';

class User {
  // Registers a new user
  static register = async ({ username, password, email, userhemisphere }) => {
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await db.query(
      `INSERT INTO users (username, email, passwordhash, userhemisphere, profilephoto, bio, isadmin)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, username, email, userhemisphere, profilephoto, bio, createdat, updatedat, isadmin`,
      [username, email, hashedPassword, userhemisphere, null, null, false]
    );
    return result.rows[0];
  };

  // Finds a user by username
  static findByUsername = async (username) => {
    console.log(`Searching for user: ${username}`); 
    const result = await db.query(
      `SELECT id, username, email, userhemisphere, profilephoto, bio, passwordhash, createdat, updatedat, isadmin 
       FROM users WHERE username = $1`,
      [username]
    );
    console.log(`User search result: ${JSON.stringify(result.rows[0])}`); 
    return result.rows[0];
  };
  
  

  // Updates user details
  static update = async (username, data) => {
    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        username: 'username',
        email: 'email',
        passwordhash: 'passwordhash',
        userhemisphere: 'userhemisphere',
        profilephoto: 'profilephoto',
        bio: 'bio'
      }
    );
    const usernameVarIdx = `$${values.length + 1}`;
    const querySql = `UPDATE users
                      SET ${setCols}, updatedat = CURRENT_TIMESTAMP
                      WHERE username = ${usernameVarIdx}
                      RETURNING id, username, email, userhemisphere, profilephoto, bio, createdat, updatedat, isadmin`;
    const result = await db.query(querySql, [...values, username]);
    return result.rows[0];
  };

  // Authenticates a user with username and password
  static authenticate = async (username, password) => {
    console.log(`Authenticating user: ${username}`);
    const result = await db.query(
      `SELECT id, username, email, passwordhash, userhemisphere, profilephoto, bio, createdat, updatedat , isadmin
      FROM users WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];
    if (!user) {
      throw new UnauthorizedError("Invalid username/password");
    } else {
      console.log(`User found: ${username} - Attempting to verify password`);
      console.log(`Stored hash: '${user.passwordhash}'`);
      if (password && user.passwordhash) {
        const isValid = await bcrypt.compare(password, user.passwordhash);
        console.log(`Password verification result for ${username}: ${isValid}`);

        if (isValid) {
          delete user.passwordhash;
          return user;
        }
      } else {
        console.log("Password or hash is missing");
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  };

  static remove = async (username) => {
    const result = await db.query(
      `DELETE FROM users WHERE username = $1 RETURNING username`,
      [username]
    );
    return result.rows[0];
  };
}

export default User;

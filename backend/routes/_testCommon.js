import pkg from 'pg';
const { Client } = pkg;
import { getDatabaseUri } from '../config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config.js';

const db = new Client({
  connectionString: getDatabaseUri(),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function setupSchema() {
  const schema = `
    DROP TABLE IF EXISTS critter_availability, collections, users, items CASCADE;
    DROP TYPE IF EXISTS hemisphere;
    CREATE TYPE hemisphere AS ENUM ('north', 'south');
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(30) NOT NULL UNIQUE,
        email VARCHAR(254) NOT NULL UNIQUE,
        passwordhash VARCHAR(60) NOT NULL,
        userhemisphere hemisphere NOT NULL,
        profilephoto VARCHAR(255),
        bio VARCHAR(140),
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        isadmin BOOLEAN DEFAULT FALSE
    );
    CREATE TABLE collections (
        id SERIAL PRIMARY KEY,
        userid INTEGER REFERENCES users(id) ON DELETE CASCADE,
        itemname VARCHAR(255) NOT NULL,
        itemtype VARCHAR(17) CHECK (itemtype IN ('Fish', 'Fossil', 'Art', 'Bug', 'Deep Sea Creature', 'Artwork')),
        donated BOOLEAN DEFAULT FALSE,
        image_url VARCHAR(255),
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (userid, itemname, itemtype)
    );
    CREATE TABLE items (
        id SERIAL PRIMARY KEY,
        itemname VARCHAR(255) NOT NULL,
        itemtype VARCHAR(17) CHECK (itemtype IN ('Fish', 'Fossil', 'Art', 'Bug', 'Deep Sea Creature', 'Artwork')),
        image_url VARCHAR(255),
        location VARCHAR(255),
        rarity VARCHAR(50),
        timesavailable JSON,
        monthsavailablenorth JSON,
        monthsavailablesouth JSON,
        description TEXT,
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (itemname, itemtype)
    );
  `;

  await db.query(schema);
  console.log('Schema setup successfully.');  // for debugging
}

async function insertTestData() {
  const hashedPassword = await bcrypt.hash('password1', 1);

  // Inserting users
  await db.query(`
    INSERT INTO users (username, email, passwordhash, userhemisphere, isadmin)
    VALUES ('user1', 'user1@user.com', $1, 'north', FALSE),
           ('user2', 'user2@user.com', $1, 'north', FALSE),
           ('user3', 'user3@user.com', $1, 'north', FALSE),
           ('adminUser', 'admin@user.com', $1, 'north', TRUE);
  `, [hashedPassword]);
  console.log('Test data inserted for users.'); // for debugging

  // Inserting collections for user1 and user2
  await db.query(`
    INSERT INTO collections (userid, itemname, itemtype, donated, image_url)
    VALUES (1, 'Ancient Statue', 'Art', FALSE, 'url-to-image-ancient-statue'),
           (1, 'Blue Marlin', 'Fish', TRUE, 'url-to-image-blue-marlin'),
           (2, 'T. Rex Skull', 'Fossil', FALSE, 'url-to-image-trex-skull');
  `);
  console.log('Test data inserted for collections.'); // for debugging

  // Inserting items
  await db.query(`
    INSERT INTO items (itemname, itemtype, image_url, location, rarity, timesavailable, monthsavailablenorth, monthsavailablesouth, description)
    VALUES 
      ('Sea Bass', 'Fish', 'http://example.com/seabass.jpg', 'Ocean', 'Common', null, '{"months": "All year", "time": "All day"}', '{"months": "All year", "time": "All day"}', 'A common fish'),
      ('Scorpion', 'Bug', 'http://example.com/scorpion.jpg', 'Trees', 'Rare', null, '{"months": "May – Oct", "time": "7 PM – 4 AM"}', '{"months": "Nov – Apr", "time": "7 PM – 4 AM"}', 'A rare bug'),
      ('Seaweed', 'Deep Sea Creature', 'http://example.com/seaweed.jpg', 'Deep Ocean', 'Common', null, '{"months": "All year", "time": "All day"}', '{"months": "All year", "time": "All day"}', 'Common sea plant'),
      ('Wasp', 'Bug', 'http://example.com/wasp.jpg', 'Trees', 'Common', null, '{"months": "Apr – Nov", "time": "All day"}', '{"months": "Oct – Apr", "time": "All day"}', 'Common bug');
  `);
  console.log('Test data inserted for items.');
}

async function commonBeforeAll() {
  await db.connect();
  await setupSchema();
  await insertTestData();
}

async function commonBeforeEach() {
  await setupSchema(); 
  await insertTestData(); 
}

async function commonAfterEach() {
  await db.query('DROP TABLE IF EXISTS critter_availability, collections, users, items CASCADE');
}

async function commonAfterAll() {
  await db.end(); 
}

const u1Token = jwt.sign({ username: 'user1' }, SECRET_KEY);
const adminToken = jwt.sign({ username: 'adminUser', isAdmin: true }, SECRET_KEY);

export {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  adminToken
};

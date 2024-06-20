import pkg from 'pg';
const { Client } = pkg;
import { getDatabaseUri } from '../config.js';

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
        username VARCHAR(30) NOT NULL,
        email VARCHAR(254) NOT NULL,
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

    CREATE TABLE critter_availability (
        id SERIAL PRIMARY KEY,
        crittername VARCHAR(255) NOT NULL,  
        crittertype VARCHAR(17) CHECK (crittertype IN ('Fish', 'Bug', 'Deep Sea Creature')),  
        monthsavailablenorth JSON,  
        monthsavailablesouth JSON,  
        timesavailable JSON,  
        image_url VARCHAR(255),
        location VARCHAR(255),
        rarity VARCHAR(255),
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
        updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
        UNIQUE (crittername, crittertype)  
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
  console.log('Schema setup successfully.');
}

async function commonBeforeAll() {
  await db.connect();
  console.log('Database connected and schema set up.');

}

async function commonBeforeEach() {
  await setupSchema();
  console.log('Schema reset before each test.');
}

async function commonAfterEach() {
  await db.query('DROP TABLE IF EXISTS critter_availability, collections, users, items CASCADE');
  console.log('Cleaned up after each test.'); 
}

async function commonAfterAll() {
  await db.end(); 
  console.log('Database connection closed.');

}

export {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
};

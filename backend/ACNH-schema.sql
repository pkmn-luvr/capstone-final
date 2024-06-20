-- Drop existing tables and types to prevent errors on rerun
DROP TABLE IF EXISTS critter_availability, collections, users, items CASCADE;
DROP TYPE IF EXISTS hemisphere;

-- Create hemisphere type
CREATE TYPE hemisphere AS ENUM ('north', 'south');

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    email VARCHAR(254) NOT NULL,
    passwordhash VARCHAR(80) NOT NULL,  
    userhemisphere hemisphere NOT NULL,  
    profilephoto VARCHAR(255),  
    bio VARCHAR(140),
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isadmin BOOLEAN DEFAULT FALSE
);

-- Create collections table
CREATE TABLE collections (
    id SERIAL PRIMARY KEY,
    userid INTEGER REFERENCES users(id) ON DELETE CASCADE,  
    itemname VARCHAR(255) NOT NULL,  
    itemtype VARCHAR(17) CHECK (itemtype IN ('Fish', 'Fossil', 'Art', 'Bug', 'Deep Sea Creature')),  
    donated BOOLEAN DEFAULT FALSE,
    image_url VARCHAR(255), 
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    UNIQUE (userid, itemname, itemtype)  
);

-- Create items table
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    itemname VARCHAR(255) NOT NULL,
    itemtype VARCHAR(17) CHECK (itemtype IN ('Fish', 'Fossil', 'Art', 'Bug', 'Deep Sea Creature')),
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
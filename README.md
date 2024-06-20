# Animal Crossing New Horizon's Companion App

Currently not deployed due to confusion with Heroku; reached out to Student Advising via email on 6/9/24 to arrange a mentor call with someone who can walk me through this process.

This README.md details the execution of a companion app for Animal Crossing: New Horizons players. Utilizing the Animal Crossing: New Horizons API offered by Nookipedia (https://api.nookipedia.com/), the app aims to help players of the Animal Crossing: New Horizons game on the Nintendo Switch to track their collection of critters (bugs, fish, and deep-sea creatures), fossils, and art pieces. Users can check off items as they collect them, mark them as donated to the museum, and provide personalized suggestions towards completing their collections depending on the user's hemisphere settings.

### Technology Stack
- **Front-end**: React.js is used for UI/UX.
- **Back-end**: Node.js handles API requests and data processing with Express.
- **Database**: PostgreSQL for storing user data, in-game items, and user collections.

This app aims to help players of the Animal Crossing: New Horizons game on the Nintendo Switch to track their collection of critters (bugs, fish, and deep-sea creatures), fossils, and art pieces. Users can check off items as they collect them, mark them as donated to the museum, and receive personalized suggestions towards completing their collections.

### Target Audience
Animal Crossing: New Horizons players of all ages looking for an easy way to track progress towards their in-game achievements. It caters especially to players aiming to complete their museum collections and keep track of their critter captures.

### Data Sources
The app utilizes data from the Animal Crossing: New Horizons API from Nookipedia for information on critters, fossils, and art pieces. User inputs and collection statuses are stored in PostgreSQL.

### User Flow
Upon visiting, a viewer is presented with a homepage. All app features are protected unless the user is registered and logged in.

Upon login, users are redirected to the homepage. Users will see the navigation at the top with options: "Home/Critter, Artwork, and Fossil Index/Critter Availability Tool/My Collections/User Profile/Logout".

- **Critter, Artwork, and Fossil Index**: Users can browse categories (critters, fossils, art) and check off items as collected.
- **Critter Availability Tool**: In this game, some items are only available during certain months of the year. This page displays all available items for the current user depending on the current month and user hemisphere (north or south).
- **My Collections**: View all items in the current user's collections. CollectionCards have the option to mark the collected item as 'Donated' to the in-game Museum.
- **User Profile**: This page includes a form for the current user to edit their email & hemisphere settings. 

### Schema Design
- **Users**
  - `id`: Primary Key
  - `username`: String
  - `email`: String
  - `passwordHash`: String
  - `userHemisphere`: String (ENUM: 'north', 'south')
  - `profilePhoto`: String (optional)
  - `bio`: String (optional)
  - `createdAt`: DateTime
  - `updatedAt`: DateTime
  - `isAdmin`: Boolean (default: FALSE)

- **Collections**
  - `id`: Primary Key
  - `userId`: Foreign Key (References Users.id, ON DELETE CASCADE)
  - `itemName`: String
  - `itemType`: String (CHECK: 'Fish', 'Fossil', 'Art', 'Bug', 'Deep Sea Creature')
  - `donated`: Boolean (default: FALSE)
  - `image_url`: String
  - `createdAt`: DateTime
  - `updatedAt`: DateTime
  - **Unique Constraint**: (userId, itemName, itemType)

- **Items**
  - `id`: Primary Key
  - `itemName`: String
  - `itemType`: String (CHECK: 'Fish', 'Fossil', 'Art', 'Bug', 'Deep Sea Creature')
  - `image_url`: String
  - `location`: String (optional)
  - `rarity`: String (optional)
  - `timesAvailable`: JSON (optional)
  - `monthsAvailableNorth`: JSON (optional)
  - `monthsAvailableSouth`: JSON (optional)
  - `description`: Text (optional)
  - `createdAt`: DateTime
  - `updatedAt`: DateTime
  - **Unique Constraint**: (itemName, itemType)

### SQL Schema Creation
```sql
-- Drop existing tables and types to prevent errors on rerun
DROP TABLE IF EXISTS collections, users, items CASCADE;
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

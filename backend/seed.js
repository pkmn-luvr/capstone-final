import db from './db.js';
import fetch from 'node-fetch';
import { apiConfig } from './config.js';
import bcrypt from 'bcrypt';

const endpoints = [
  { url: 'https://api.nookipedia.com/nh/fish', type: 'Fish' },
  { url: 'https://api.nookipedia.com/nh/bugs', type: 'Bug' },
  { url: 'https://api.nookipedia.com/nh/sea', type: 'Deep Sea Creature' },
  { url: 'https://api.nookipedia.com/nh/fossils/individuals', type: 'Fossil' },
  { url: 'https://api.nookipedia.com/nh/art', type: 'Art' }
];

async function createInitialUser() {
  const password = 'ssdfdt5'; 
  const hashedPassword = await bcrypt.hash(password, 10); 

  const createUserQuery = `
    INSERT INTO users (username, email, passwordhash, userhemisphere, isadmin)
    VALUES ('marissa', 'mickles.marissa@gmail.com', $1, 'north', true)
    RETURNING id;`;
  try {
    const result = await db.query(createUserQuery, [hashedPassword]);
    console.log("Initial user created successfully with ID:", result.rows[0].id);
    return result.rows[0].id;
  } catch (error) {
    console.error("Failed to create initial user:", error);
    return null;
  }
}

async function fetchDataAndSeedItems(endpoint) {
  try {
    console.log(`Fetching data from ${endpoint.url}`);
    const response = await fetch(endpoint.url, {
      headers: { 'X-API-KEY': apiConfig.apiKey }
    });

    if (!response.ok) {
      console.error(`Failed to fetch data from ${endpoint.url}: ${response.statusText}`);
      return;
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      console.error(`Unexpected response format from ${endpoint.url}:`, data);
      return;
    }

    for (const item of data) {
      const query = `
        INSERT INTO items (
          itemname, itemtype, image_url, location, rarity, timesavailable, monthsavailablenorth, monthsavailablesouth, description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (itemname, itemtype) DO NOTHING;
      `;
      const values = [
        item.name, endpoint.type, item.image_url, item.location || null, item.rarity,
        JSON.stringify(item.times_available || []), JSON.stringify(item.north?.availability_array || []), JSON.stringify(item.south?.availability_array || []), item.description || ''
      ];

      try {
        await db.query(query, values);
      } catch (error) {
        console.error(`Failed to insert data for ${item.name}:`, error);
      }
    }

    console.log(`Data for ${endpoint.type} seeded successfully.`);
  } catch (error) {
    console.error(`Error seeding data for ${endpoint.type}:`, error);
  }
}

async function fetchDataAndSeedCollections(userId, endpoint) {
  if (endpoint.type !== 'Bug') {
    return; // Only seed collections if the item type is 'Bug'
  }
  try {
    console.log(`Fetching data from ${endpoint.url}`);
    const response = await fetch(endpoint.url, {
      headers: { 'X-API-KEY': apiConfig.apiKey }
    });

    if (!response.ok) {
      console.error(`Failed to fetch data from ${endpoint.url}: ${response.statusText}`);
      return;
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      console.error(`Unexpected response format from ${endpoint.url}:`, data);
      return;
    }

    for (const item of data) {
      const query = `INSERT INTO collections (userId, itemname, itemtype, donated, image_url)
                     VALUES ($1, $2, $3, $4, $5)
                     ON CONFLICT (userId, itemname, itemtype) DO NOTHING;`;
      const values = [userId, item.name, endpoint.type, false, item.image_url]; 

      try {
        await db.query(query, values);
      } catch (error) {
        console.error(`Failed to insert data for ${item.name}:`, error);
      }
    }

    console.log(`Data for ${endpoint.type} seeded successfully.`);
  } catch (error) {
    console.error(`Error seeding data for ${endpoint.type}:`, error);
  }
}

async function seedAllData() {
  // Reset the tables
  await db.query("TRUNCATE TABLE users, collections, items RESTART IDENTITY CASCADE");

  const userId = await createInitialUser();
  if (!userId) {
    console.log("Seeding aborted due to no user being created.");
    return;
  }

  for (const endpoint of endpoints) {
    await fetchDataAndSeedItems(endpoint);
    await fetchDataAndSeedCollections(userId, endpoint);
  }

  await db.end();
  console.log('All data seeded successfully.');
}

seedAllData();

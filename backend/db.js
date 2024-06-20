"use strict";


import pkg from 'pg';
const { Client } = pkg;
import { getDatabaseUri } from './config.js';

const db = new Client({
  connectionString: getDatabaseUri(),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

db.connect();

export default db;

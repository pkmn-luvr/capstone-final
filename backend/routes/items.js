import express from 'express';
import Item from '../models/item.js';
import { ExpressError, BadRequestError, InternalServerError } from '../expressError.js';

const router = express.Router();

// Route to get all items
router.get('/', async (req, res, next) => {
  try {
    console.log("GET / route hit");
    const items = await Item.findAll();
    console.log("Items fetched:", items);
    res.json(items);
  } catch (err) {
    console.error("Error fetching all items:", err);
    next(new InternalServerError('Failed to fetch items', req.method, req.originalUrl));
  }
});

// Route to get items based on current month and user hemisphere
router.get('/availability', async (req, res, next) => {
  try {
    const { month, hemisphere } = req.query;
    console.log("Received month:", month);
    console.log("Received hemisphere:", hemisphere);
    const items = await Item.findByMonthAndHemisphere(month, hemisphere);
    console.log("Items fetched:", items);
    res.json(items);
  } catch (err) {
    console.error("Error fetching availability:", err);
    next(new InternalServerError('Failed to fetch availability', req.method, req.originalUrl));
  }
});

// Route to get items filtered by itemtype
router.get('/type/:itemtype', async (req, res, next) => {
  try {
    const { itemtype } = req.params;
    console.log("Received item type:", itemtype);
    const items = await Item.findByType(itemtype);
    console.log("Items fetched by type:", items);
    res.json(items);
  } catch (err) {
    console.error("Error fetching items by type:", err);
    next(new InternalServerError('Failed to fetch items by type', req.method, req.originalUrl));
  }
});

// Route to query items while filtered by itemtype 
router.get('/search', async (req, res, next) => {
  try {
    const { name, type } = req.query;
    console.log("Received search parameters - Name:", name, "Type:", type);
    if (!type || !['Fish', 'Bug', 'Fossil', 'Art', 'Deep Sea Creature'].includes(type)) {
      console.error("Invalid item type provided");
      return next(new BadRequestError('Invalid item type provided', req.method, req.originalUrl));
    }
    const items = await Item.searchItems(name, type);
    console.log("Search results:", items);
    res.json(items);
  } catch (err) {
    console.error("Error searching items:", err);
    next(new InternalServerError('Failed to search items', req.method, req.originalUrl));
  }
});

export default router;

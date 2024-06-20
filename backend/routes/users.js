import express from 'express';
import jsonschema from "jsonschema";
import User from '../models/user.js';
import Collection from '../models/collections.js';
import userUpdateSchema from '../schemas/userUpdate.json' assert { type: "json" }; 
import collectionItemSchema from '../schemas/CollectionItem.json' assert { type: "json" }; 
import { sqlForPartialUpdate } from '../helpers/sql.js';
import { ensureCorrectUserOrAdmin, authenticateJWT } from '../middleware/auth.js';
import db from '../db.js'; 

const router = express.Router();

router.use(authenticateJWT);


// router.post('/users', async (req, res, next) => {
//     try {
//         // Here you'd typically check if the requester is an admin
//         // Assuming isAdmin is a function that checks user's admin status
//         if (!isAdmin(req.user)) {
//             return res.status(403).send("Access denied.");
//         }

//         const { username, password, email, userhemisphere, profilephoto, bio, isadmin } = req.body;
//         const newUser = await User.register({ username, password, email, userhemisphere, profilephoto, bio, isadmin });
//         return res.status(201).json({ newUser });
//     } catch (err) {
//         next(err);
//     }
// });

router.get('/:username', ensureCorrectUserOrAdmin, async (req, res, next) => {
    try {
        const user = await User.findByUsername(req.params.username);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

router.get('/:username/collections', ensureCorrectUserOrAdmin, async (req, res, next) => {
    try {
        console.log(`Fetching collections for user: ${req.params.username}`);
        const user = await User.findByUsername(req.params.username);
        if (!user) {
            console.log(`User not found: ${req.params.username}`);
            return res.status(404).json({ error: "User not found" });
        }
        console.log(`User found: ${JSON.stringify(user)}`);
        const collections = await Collection.findByUserId(user.id);
        console.log(`Collections found: ${JSON.stringify(collections)}`);
        return res.json({ collections });
    } catch (err) {
        console.error("Error fetching collections:", err);
        return next(err);
    }
});

router.patch('/:username', ensureCorrectUserOrAdmin, async (req, res, next) => {
    try {
        const validation = jsonschema.validate(req.body, userUpdateSchema);
        if (!validation.valid) {
            return res.status(400).json({ errors: validation.errors.map(err => err.stack) });
        }

        const updateData = req.body;
        const { setCols, values } = sqlForPartialUpdate(updateData, {
            username: 'username',
            email: 'email',
            userhemisphere: 'userhemisphere',
            profilephoto: 'profilephoto',
            bio: 'bio'
        });

        const usernameVarIdx = `$${values.length + 1}`;
        const querySql = `UPDATE users SET ${setCols} WHERE username = ${usernameVarIdx} RETURNING id, username, email, userhemisphere, profilephoto, bio, createdat, updatedat`;
        const user = await db.query(querySql, [...values, req.params.username]);

        if (!user.rows[0]) {
            return res.status(404).send("User not found.");
        }

        return res.json({ user: user.rows[0] });
    } catch (err) {
        next(err);
    }
});

router.post('/:username/collections/add', ensureCorrectUserOrAdmin, async (req, res, next) => {
    console.log(`Received request to add item to collection for user: ${req.params.username}`);
    try {
        const validation = jsonschema.validate(req.body, collectionItemSchema);
        if (!validation.valid) {
            console.log('Validation failed:', validation.errors);
            return res.status(400).json({ errors: validation.errors.map(err => err.stack) });
        }

        const user = await User.findByUsername(req.params.username);
        const { itemname, itemtype } = req.body;
        const result = await Collection.add({ userid: user.id, itemname, itemtype });
        console.log('Item added to collection:', result);
        return res.json(result);
    } catch (err) {
        console.error('Error adding collection item:', err);
        return next(err);
    }
});

router.post('/:username/collections/remove', ensureCorrectUserOrAdmin, async (req, res, next) => {
    console.log(`Received request to remove item from collection for user: ${req.params.username}`);
    try {
        const validation = jsonschema.validate(req.body, collectionItemSchema);
        if (!validation.valid) {
            console.log('Validation failed:', validation.errors);
            return res.status(400).json({ errors: validation.errors.map(err => err.stack) });
        }

        const user = await User.findByUsername(req.params.username);
        const { itemname, itemtype } = req.body;
        const result = await Collection.remove({ userid: user.id, itemname, itemtype });
        console.log('Item removed from collection:', result);
        return res.json(result);
    } catch (err) {
        console.error('Error removing collection item:', err);
        return next(err);
    }
});

router.patch('/:username/collections/donate', ensureCorrectUserOrAdmin, async (req, res, next) => {
    console.log(`Received request to toggle donation status for user: ${req.params.username}`);
    try {
        const validation = jsonschema.validate(req.body, collectionItemSchema);
        if (!validation.valid) {
            console.log('Validation failed:', validation.errors);
            return res.status(400).json({ errors: validation.errors.map(err => err.stack) });
        }
  
        const user = await User.findByUsername(req.params.username);
        const { itemname, itemtype } = req.body;
        const result = await Collection.toggleDonationStatus(user.id, itemname, itemtype);
        console.log('Donation status toggled:', result);
        return res.json(result);
    } catch (err) {
        console.error('Error toggling donation status:', err);
        return next(err);
    }
  });
  

export default router;

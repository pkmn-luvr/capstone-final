import db from '../db.js';
import Item from './item.js';

class Collection {
  // Add an item to the user's collection
  static async add({ userid, itemname, itemtype }) {
    try {
      const item = await Item.findByName(itemname);
      if (!item || item.itemtype !== itemtype) {
        throw new Error(`Item ${itemname} of type ${itemtype} does not exist in the items database.`);
      }
      const existingItem = await db.query(
        `SELECT id FROM collections WHERE userid = $1 AND itemname = $2::text AND itemtype = $3::text`,
        [userid, itemname, itemtype]
      );
      if (existingItem.rows.length > 0) {
        throw new Error(`Item ${itemname} is already in the collection.`);
      }
      const result = await db.query(
        `INSERT INTO collections (userid, itemname, itemtype, donated, image_url)
         VALUES ($1, $2::text, $3::text, false, (SELECT image_url FROM items WHERE itemname = $2::text AND itemtype = $3::text))
         RETURNING id, userid AS "userid", itemname AS "itemname", itemtype AS "itemtype", donated, image_url AS "image_url", createdAt, updatedAt`,
        [userid, itemname, itemtype]
      );
      return { action: "added", item: result.rows[0] };
    } catch (err) {
      console.error('Error adding collection item:', err);
      throw err;
    }
  }
  
  static async remove({ userid, itemname, itemtype }) {
    try {
      const result = await db.query(
        `DELETE FROM collections WHERE userid = $1 AND itemname = $2::text AND itemtype = $3::text RETURNING id`,
        [userid, itemname, itemtype]
      );
      if (result.rows.length === 0) {
        throw new Error(`Item ${itemname} is not in the collection.`);
      }
      return { action: "removed", itemId: result.rows[0].id };
    } catch (err) {
      console.error('Error removing collection item:', err);
      throw err;
    }
  }
  
  

  // Toggle donation status of an item in the collection
  static async toggleDonationStatus(userid, itemname, itemtype) {
    try {
      const result = await db.query(
        `UPDATE collections
         SET donated = NOT donated, updatedAt = CURRENT_TIMESTAMP
         WHERE userid = $1 AND itemname = $2 AND itemtype = $3
         RETURNING id, userid AS "userid", itemname AS "itemname", itemtype AS "itemtype", donated, image_url AS "image_url", createdAt, updatedAt`,
        [userid, itemname, itemtype]
      );
      return result.rows[0];
    } catch (err) {
      console.error('Error toggling donation status:', err);
      throw err;
    }
  }

  static async findByUserId(userid, itemtype = null) {
    let query = `
        SELECT id, userid AS "userid", itemname AS "itemname", itemtype AS "itemtype", donated, 
               image_url AS "image_url", createdAt, updatedAt
        FROM collections
        WHERE userid = $1`;

    let queryParams = [userid];

    if (itemtype) {
        query += ` AND itemtype = $2`;
        queryParams.push(itemtype);
    }

    const result = await db.query(query, queryParams);
    return result.rows;
}

}

// Export Collection using ES6 default export
export default Collection;

import db from '../db.js';

class Item {
  static async findByType(itemtype) {
    console.log("Finding items by type:", itemtype);
    const result = await db.query(
      `SELECT id, 
              itemname AS "itemname", 
              itemtype AS "itemtype", 
              image_url AS "imageUrl", 
              location AS "location", 
              rarity AS "rarity", 
              timesavailable AS "timesavailable", 
              monthsavailablenorth AS "monthsavailablenorth", 
              monthsavailablesouth AS "monthsavailablesouth", 
              description AS "description"
       FROM items
       WHERE itemtype = $1`,
      [itemtype]
    );
    console.log("Find items by type result:", result.rows);  
    return result.rows;
  }

  static async findByName(itemname) {
    console.log("Finding item by name:", itemname);
    const result = await db.query(
      `SELECT id, 
              itemname AS "itemname", 
              itemtype AS "itemtype", 
              image_url AS "imageUrl", 
              location AS "location", 
              rarity AS "rarity", 
              timesavailable AS "timesavailable", 
              monthsavailablenorth AS "monthsavailablenorth", 
              monthsavailablesouth AS "monthsavailablesouth", 
              description AS "description"
       FROM items
       WHERE itemname = $1`,
      [itemname]
    );
    console.log("Query result:", result.rows);
    return result.rows[0];
  }

  static async searchItems(name, itemtype) {
    console.log("Searching items with name:", name, "and type:", itemtype);
    let query = `SELECT id, 
                        itemname AS "itemname", 
                        itemtype AS "itemtype", 
                        image_url AS "imageUrl", 
                        location AS "location", 
                        rarity AS "rarity", 
                        timesavailable AS "timesavailable", 
                        monthsavailablenorth AS "monthsavailablenorth", 
                        monthsavailablesouth AS "monthsavailablesouth", 
                        description AS "description"
                 FROM items 
                 WHERE itemtype = $1`;
    let params = [itemtype];

    if (name) {
        query += ` AND itemname ILIKE $2`;
        params.push(`%${name}%`);
    }

    const result = await db.query(query, params);
    console.log("Search result:", result.rows);
    return result.rows;
  }

  static async findAll() {
    console.log("Fetching all items");
    const result = await db.query(
      `SELECT id, 
              itemname AS "itemname", 
              itemtype AS "itemtype", 
              image_url AS "imageUrl", 
              location AS "location", 
              rarity AS "rarity", 
              timesavailable AS "timesavailable", 
              monthsavailablenorth AS "monthsavailablenorth", 
              monthsavailablesouth AS "monthsavailablesouth", 
              description AS "description"
       FROM items`
    );
    console.log("Find all items result:", result.rows);  
    return result.rows;
  }

  static async findByMonthAndHemisphere(month, hemisphere) {
    try {
      console.log("Fetching items for month:", month, "and hemisphere:", hemisphere);
      
      const query = `
      SELECT *
      FROM items
      WHERE
        (
          EXISTS (
            SELECT 1
            FROM json_array_elements(CASE
                                      WHEN json_typeof(monthsavailablenorth) = 'array'
                                      THEN monthsavailablenorth
                                      ELSE '[]'::json
                                    END) AS elem
            WHERE (
              $1 = ANY (STRING_TO_ARRAY(elem->>'months', ' – '))
              OR elem->>'months' = 'All year'
            )
          )
          AND $2 = 'north'
        )
        OR
        (
          EXISTS (
            SELECT 1
            FROM json_array_elements(CASE
                                      WHEN json_typeof(monthsavailablesouth) = 'array'
                                      THEN monthsavailablesouth
                                      ELSE '[]'::json
                                    END) AS elem
            WHERE (
              $1 = ANY (STRING_TO_ARRAY(elem->>'months', ' – '))
              OR elem->>'months' = 'All year'
            )
          )
          AND $2 = 'south'
        );
      `;
      
      console.log("Executing query:", query, [month, hemisphere]);
      const result = await db.query(query, [month, hemisphere]);
      console.log("Query result:", result.rows);
      return result.rows;
    } catch (err) {
      console.error("Error fetching availability:", err);
      throw err;
    }
  }
}

export default Item;
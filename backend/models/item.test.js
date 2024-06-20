import { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } from './_testCommon';
import Item from './item';
import db from '../db';

beforeAll(commonBeforeAll);
beforeEach(async () => {
  await commonBeforeEach();

  // Insert items and log the result
  const insertResult = await db.query(`
    INSERT INTO items (itemname, itemtype, image_url, location, rarity, timesavailable, monthsavailablenorth, monthsavailablesouth, description)
    VALUES 
      ('Bitterling', 'Fish', 'http://example.com/bitterling.jpg', 'River', 'Common', '[]', '[]', '[]', 'A small fish.'),
      ('Grasshopper', 'Bug', 'http://example.com/grasshopper.jpg', 'Ground', 'Common', '[]', '[]', '[]', 'A common insect.'),
      ('Seaweed', 'Deep Sea Creature', 'http://example.com/seaweed.jpg', 'Sea', 'Common', '[]', '[]', '[]', 'A type of seaweed.')
    ON CONFLICT DO NOTHING RETURNING *;
  `);
  console.log("Inserted items:", insertResult.rows);
});

afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("Item model", () => {
  test('finds all items', async () => {
    const items = await Item.findAll();
    console.log("All items found:", items); 
    expect(items).toBeInstanceOf(Array);
    expect(items.length).toBeGreaterThan(0); 
  });

  test('finds an item by name', async () => {
    const itemname = 'Seaweed';
    const item = await Item.findByName(itemname);
    console.log("Item found by name:", item); 
    expect(item).toBeDefined();
    expect(item.itemname).toEqual(itemname);
  });

  test('finds items by type', async () => {
    const itemtype = 'Grasshopper';
    const items = await Item.findByType(itemtype);
    console.log("Items found by type:", items); 
    expect(items).toBeInstanceOf(Array);
    items.forEach(item => {
      expect(item.itemtype).toEqual(itemtype);
    });
  });

  describe("searchItems method", () => {
    test("should find items by partial name and type", async () => {
      const partialName = 'sea'; 
      const itemType = 'Deep Sea Creature';
      const items = await Item.searchItems(partialName, itemType);
      expect(items).toBeInstanceOf(Array);
      expect(items).toHaveLength(1); 
      expect(items[0].itemname.toLowerCase()).toContain(partialName.toLowerCase());
      expect(items[0].itemtype).toEqual(itemType);
    });
    
  
    test("should return items of a type when name is empty", async () => {
      const items = await Item.searchItems('', 'Bug');
      expect(items).toBeInstanceOf(Array);
      expect(items.every(i => i.itemtype === 'Bug')).toBe(true);
    });
  });
  
});

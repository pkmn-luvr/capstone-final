import { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } from './_testCommon';
import Collection from './collections';
import db from '../db';


beforeAll(async () => {
  await commonBeforeAll();
});

beforeEach(async () => {
  await commonBeforeEach();
  
  await db.query(`
    INSERT INTO users (id, username, email, passwordhash, userhemisphere)
    VALUES (1, 'testuser', 'test@example.com', 'passwordhash', 'north')
    ON CONFLICT (id) DO NOTHING;
  `);
  
  await db.query(`
    INSERT INTO items (itemname, itemtype, image_url, location, rarity, timesavailable, monthsavailablenorth, monthsavailablesouth, description)
    VALUES 
      ('Bitterling', 'Fish', 'http://example.com/bitterling.jpg', 'River', 'Common', '[]', '[]', '[]', 'A small fish.'),
      ('Grasshopper', 'Bug', 'http://example.com/grasshopper.jpg', 'Ground', 'Common', '[]', '[]', '[]', 'A common insect.'),
      ('Seaweed', 'Deep Sea Creature', 'http://example.com/seaweed.jpg', 'Sea', 'Common', '[]', '[]', '[]', 'A type of seaweed.')
    ON CONFLICT (itemname, itemtype) DO NOTHING;
  `);
  
  await db.query(`
    INSERT INTO collections (userid, itemname, itemtype, donated, image_url)
    VALUES 
      (1, 'Bitterling', 'Fish', false, 'http://example.com/bitterling.jpg'),
      (1, 'Grasshopper', 'Bug', true, 'http://example.com/grasshopper.jpg')
    ON CONFLICT (userid, itemname, itemtype) DO NOTHING;
  `);
});


afterEach(async () => {
  await commonAfterEach();
});

afterAll(async () => {
  await commonAfterAll();
});

describe("Collection Model Tests", () => {
  test("Collection.add adds a new collection item or removes it if already exists", async () => {
    // Add a new item
    let response = await Collection.add({
      userid: 1,
      itemname: "Seaweed",
      itemtype: "Deep Sea Creature"
    });

    expect(response.action).toEqual("added");
    expect(response.item).toHaveProperty("id");
    expect(response.item.userid).toEqual(1);
    expect(response.item.itemname).toEqual("Seaweed");
    expect(response.item.itemtype).toEqual("Deep Sea Creature");
    expect(response.item.donated).toEqual(false);
    expect(response.item.image_url).toEqual("http://example.com/seaweed.jpg");

    response = await Collection.add({
      userid: 1,
      itemname: "Seaweed",
      itemtype: "Deep Sea Creature"
    });

    expect(response.action).toEqual("removed");
    expect(response).toHaveProperty("itemId");
  });

  test("Collection.toggleDonationStatus toggles the donation status of a collection item", async () => {
    const itemname = "Bitterling";
    const itemtype = "Fish";

    // Toggle the donation status to true
    let updatedItem = await Collection.toggleDonationStatus(1, itemname, itemtype);
    expect(updatedItem.donated).toEqual(true);

    // Toggle the donation status back to false
    updatedItem = await Collection.toggleDonationStatus(1, itemname, itemtype);
    expect(updatedItem.donated).toEqual(false);
  });

  test("Collection.findByUserId returns all collections for a user", async () => {
    const items = await Collection.findByUserId(1);
    expect(items.length).toBeGreaterThan(0);
  });

  describe("Collection.findByUserId", () => {
    test("returns all collections for a user without filtering", async () => {
      const items = await Collection.findByUserId(1);
      expect(items.length).toEqual(2); // Assuming 2 items are inserted in the setup
      expect(items[0].itemname).toEqual('Bitterling');
      expect(items[1].itemname).toEqual('Grasshopper');
    });
  
    test("returns only collections of a specified type for a user", async () => {
      const fishItems = await Collection.findByUserId(1, 'Fish');
      expect(fishItems.length).toEqual(1);
      expect(fishItems[0].itemname).toEqual('Bitterling');
      expect(fishItems[0].itemtype).toEqual('Fish');
  
      const bugItems = await Collection.findByUserId(1, 'Bug');
      expect(bugItems.length).toEqual(1);
      expect(bugItems[0].itemname).toEqual('Grasshopper');
      expect(bugItems[0].itemtype).toEqual('Bug');
    });
  
    test("returns an empty array if no collections match the type for a user", async () => {
      const artItems = await Collection.findByUserId(1, 'Art');
      expect(artItems.length).toEqual(0);
    });
  });  
});

import { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } from './_testCommon';
import CritterAvailability from './critterAvailability';
import db from '../db';

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("CritterAvailability model", () => {
  test('adds critter availability correctly', async () => {
    const newCritter = {
      crittername: 'Clown Fish',
      crittertype: 'Fish',
      monthsavailablenorth: ['April', 'May'],
      monthsavailablesouth: ['October', 'November'],
      timesavailable: ['9 AM', '4 PM'],
      image_url: 'http://example.com/clownfish.jpg', 
      location: 'Sea',
      rarity: 'Common'
    };
    
    const critter = await CritterAvailability.add(newCritter);
    expect(critter.crittername).toEqual(newCritter.crittername);
  });

  test('finds all critter availabilities', async () => {
    await db.query(`
      INSERT INTO critter_availability (crittername, crittertype, monthsavailablenorth, monthsavailablesouth, timesavailable, image_url, location, rarity)
      VALUES ('Clown Fish', 'Fish', '["April", "May"]', '["October", "November"]', '["9 AM", "4 PM"]', 'http://example.com/clownfish.jpg', 'Sea', 'Common')
      ON CONFLICT DO NOTHING;
    `);

    const critters = await CritterAvailability.findAll();
    expect(critters).toBeInstanceOf(Array);
    if (critters.length > 0) {
      expect(critters[0].crittername).toEqual('Clown Fish');
    } else {
      fail("No critters found - test setup failed.");
    }
  });
});

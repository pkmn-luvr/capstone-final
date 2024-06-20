import db from '../db.js';

class CritterAvailability {
    static add = async ({ crittername, crittertype, monthsavailablenorth, monthsavailablesouth, timesavailable, image_url, location, rarity }) => {
        try {
            console.log("Adding new critter:", crittername);
            const result = await db.query(
                `INSERT INTO critter_availability (crittername, crittertype, monthsavailablenorth, monthsavailablesouth, timesavailable, image_url, location, rarity)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 RETURNING id, crittername AS "crittername", crittertype AS "crittertype", monthsavailablenorth AS "monthsavailablenorth", monthsavailablesouth AS "monthsavailablesouth", timesavailable AS "timesavailable", image_url AS "imageUrl", location AS "location", rarity AS "rarity"`,
                [crittername, crittertype, JSON.stringify(monthsavailablenorth), JSON.stringify(monthsavailablesouth), JSON.stringify(timesavailable), image_url, location, rarity]
            );
            console.log("Result of adding new critter:", result.rows[0]);
            return result.rows[0];
        } catch (err) {
            console.error("Error adding new critter:", err);
            throw err;
        }
    };

    static findAll = async () => {
        try {
            console.log("Fetching all critters");
            const result = await db.query(
                `SELECT id, 
                        crittername AS "crittername", 
                        crittertype AS "crittertype", 
                        monthsavailablenorth AS "monthsavailablenorth", 
                        monthsavailablesouth AS "monthsavailablesouth", 
                        timesavailable AS "timesavailable", 
                        image_url AS "imageUrl", 
                        location AS "location", 
                        rarity AS "rarity"
                 FROM critter_availability`
            );
            console.log("All critters fetched:", result.rows);
            return result.rows;
        } catch (err) {
            console.error("Error fetching all critters:", err);
            throw err;
        }
    };

    static findByMonthAndHemisphere = async (month, hemisphere) => {
        try {
            console.log("Fetching critters for month:", month, "and hemisphere:", hemisphere);
            const result = await db.query(
                `SELECT id, crittername, crittertype, monthsavailablenorth, monthsavailablesouth, timesavailable, image_url AS "imageUrl", location, rarity
                 FROM critter_availability,
                 LATERAL json_array_elements(monthsavailablenorth) AS mn,
                 LATERAL json_array_elements(monthsavailablesouth) AS ms
                 WHERE (($1 = ANY (STRING_TO_ARRAY(mn->>'months', ' – ')) OR mn->>'months' = 'All year') AND 'north' = $2)
                    OR (($1 = ANY (STRING_TO_ARRAY(ms->>'months', ' – ')) OR ms->>'months' = 'All year') AND 'south' = $2);`,
                [month, hemisphere]
            );
            console.log("Critters available in given month and hemisphere:", result.rows);
            return result.rows;
        } catch (err) {
            console.error("Error fetching availability:", err);
            throw err;
        }
    };
}

export default CritterAvailability;

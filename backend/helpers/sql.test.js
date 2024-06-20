import { sqlForPartialUpdate } from '../helpers/sql.js';
import { BadRequestError } from '../expressError.js';  

describe("sqlForPartialUpdate", () => {
    test("works: generate SQL and values", () => {
      const result = sqlForPartialUpdate(
        { firstName: 'Marissa', age: 29 },
        { firstName: 'first_name', age: 'age' }
      );
      expect(result).toEqual({
        setCols: '"first_name"=$1, "age"=$2',
        values: ['Marissa', 29]
      });
    });
  
    test("handles potential SQL injection safely", () => {
      const injectionAttempt = {
        firstName: "Robert'); DROP TABLE users; --"
      };
      const result = sqlForPartialUpdate(
        injectionAttempt,
        { firstName: 'first_name' }
      );
      expect(result.setCols).toContain('first_name');
      expect(result.values).toContain(injectionAttempt.firstName);
      expect(result.setCols).not.toContain(';');
      expect(result.setCols).not.toContain('--');
    });
  
    test("throws BadRequestError with no data", () => {
      expect(() => {
        sqlForPartialUpdate({}, {});
      }).toThrow(BadRequestError);
    });
});

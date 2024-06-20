import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.API_KEY;

function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
      ? "postgresql://marissa:0428@localhost:5432/ACNH_test"
      : `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
}


const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("ACNH Config:");
console.log("SECRET_KEY:", SECRET_KEY);
console.log("PORT:", PORT.toString());
console.log("BCRYPT_WORK_FACTOR:", BCRYPT_WORK_FACTOR);
console.log("Database:", getDatabaseUri());
console.log("---");

export const apiConfig = {
  apiKey: API_KEY
};

export {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri
};

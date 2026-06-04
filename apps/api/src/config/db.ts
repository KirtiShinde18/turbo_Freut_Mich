// import { Pool } from "pg";
// import dotenv from "dotenv";
// import { drizzle } from "drizzle-orm/node-postgres";

// // 🌸 Load environment variables from .env file
// dotenv.config();

// // 💖 Create PostgreSQL connection pool using connection string
// const pool = new Pool({
//   connectionString: process.env.PG_URL,
// });

// // 🚀 Initialize Drizzle ORM with PostgreSQL pool (database ready to shine ✨)
// export default drizzle(pool);



import { Pool } from "pg";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";

dotenv.config();

if (!process.env.PG_URL) {
  throw new Error("❌ PG_URL is missing in environment variables");
}

const pool = new Pool({
  connectionString: process.env.PG_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : false,
});

// Test database connection
pool
  .connect()
  .then((client) => {
    console.log("✅ PostgreSQL Connected Successfully");
    client.release();
  })
  .catch((err) => {
    console.error("❌ PostgreSQL Connection Failed");
    console.error(err);
  });

const db = drizzle(pool);

export default db;
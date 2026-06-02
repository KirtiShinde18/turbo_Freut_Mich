import { Pool } from "pg";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";

// 🌸 Load environment variables from .env file
dotenv.config();

// 💖 Create PostgreSQL connection pool using connection string
const pool = new Pool({
  connectionString: process.env.PG_URL,
});

// 🚀 Initialize Drizzle ORM with PostgreSQL pool (database ready to shine ✨)
export default drizzle(pool);
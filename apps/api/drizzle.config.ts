import dotenv from "dotenv"
import { Config } from "drizzle-kit"

// 🌸 Load environment variables (so we can use PG_URL safely)
dotenv.config()

// ⚙️ Drizzle configuration — database setup starts here ✨
export default {
    dialect: "postgresql", // 
    schema: "./src/models/index.ts", 
    out: "./drizzle", // 📦 Folder where migrations will be generated
    dbCredentials: {url: process.env.PG_URL as string }     
} satisfies Config
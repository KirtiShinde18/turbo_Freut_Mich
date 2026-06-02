
import { eq } from "drizzle-orm";
import db from "./config/db";
import { user } from "./models";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv"
dotenv.config()

  const ADMIN_NAME = process.env.ADMIN_NAME as string
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL as string
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD as string
  const ADMIN_MOBILE = process.env.ADMIN_MOBILE as string
  const ADMIN_ROLE = process.env.ADMIN_ROLE as string

export const seedAdmin = async () => {
    try {

        // Check Already exists
        const [result] = await db.select().from(user).where(eq(user.email, ADMIN_EMAIL))
        
        if(result){
            console.log("⚠️ ADMIN Already Exist 🚫 👑 ");
            process.exit()
            
        }
        
        // 🔐 Hash password
        const hashedPassword = await bcryptjs.hash(ADMIN_PASSWORD, 10);
        
        // 👑 Insert ADMIN into DB
        await db.insert(user).values({
          name: ADMIN_NAME ,
          email : ADMIN_EMAIL,
          mobile: ADMIN_MOBILE, 
          password: hashedPassword,
          role: ADMIN_ROLE
        });
        
        console.log("ADMIN seeded successfully 👑 ✨");
        process.exit()
    } catch (error) {
        // uh-oh bug spotted 🐞
        console.log(error);
        process.exit()
    }
};

seedAdmin();
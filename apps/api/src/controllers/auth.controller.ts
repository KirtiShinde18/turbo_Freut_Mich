import { LOGIN_REQUEST, LOGIN_RESPONSE, LOGOUT_REQUEST, LOGOUT_RESPONSE, ME_RESPONSE, REGISTER_CUSTOMER_REQUEST, REGISTER_CUSTOMER_RESPONSE} from "@repo/types";
import { Request, Response } from "express";
import db from "../config/db";

import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { COOKIE_NAME, JWT_KEY, NODE_ENV, PRODUCTION } from "../config/env";
import { user } from "../models";


//=================================== SIGNIN ===================================

// 💖 admin login endpoint — welcome to the system admin 👑
export const loginAdmin = async (req: Request<{}, {}, LOGIN_REQUEST> , res: Response<LOGIN_RESPONSE>) => {
  try {
    // frontend 👇🏻
    const {email, password} = req.body

    // Check if user exists in database using email
    const [result] = await db.select().from(user).where(eq(user.email, email))
    console.log(result);
    
    // If user not found, return error message
    if(!result){
      return res.status(401).json({message: "Invalid credentials"})
    }
    
    // Compare entered password with hashed password in DB
    const verify = await bcrypt.compare(password, result.password)
    
    // If password doesn't match, return error
    if(!verify){
      return res.status(401).json({message: "Invalid credentials"})

    }

    // Send token in HTTP-only cookie
    const token = jwt.sign({ id: result.id }, JWT_KEY, {expiresIn: "1d"})
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true, // Prevent access from js (🔐 security)
      maxAge: 1000 * 60 * 60 * 24, // 24 hour
      secure: NODE_ENV === PRODUCTION
    })

    res.status(200).json({
      message: "Welcome admin 🔥, you’re in 🎀",
      result: {
        id: result.id,
        email: result.email,
        mobile: result.mobile,
        name: result.name,
        role: result.role,

      } 
    })
  } catch (error) {
    console.log(error);  // uh-oh bug spotted 🐞
    res.status(500).json({message: "Oops… unable to sign in 💔"})
    
  }
}

//=================================== SIGNOUT ===================================

// signout handler — saying bye to the admin 👋🏻 💖
export const logoutAdmin = async (req: Request<{}, {}, LOGOUT_REQUEST> , res: Response<LOGOUT_RESPONSE>) => {
  try {
    res.clearCookie(COOKIE_NAME)
    res.status(200).json({message: "Logged out successfully, see you soon 💖👋🏻" }) // bye bye session ✨
  } catch (error) {
    console.log(error); // uh-oh bug spotted 🐞
    res.status(500).json({message: "Oops… logout failed 💔 please try again"})
    
  }
}


//=================================== ME ===================================
// 🌸 getMe — returns current logged-in user from JWT cookie
export const getMe = async (req: Request, res: Response<{ data: ME_RESPONSE } | { message: string }>) => {
  try {
    const token = req.cookies[COOKIE_NAME];

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, JWT_KEY) as { id: number };

    const [result] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      })
      .from(user)
      .where(eq(user.id, decoded.id));

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ data: result });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};



//=================================== Register ===================================

export const registerCustomer = async (
  req: Request<{}, {}, REGISTER_CUSTOMER_REQUEST>,
  res: Response<REGISTER_CUSTOMER_RESPONSE | { message: string }>
) => {
  try {
    const { name, email, mobile, password } = req.body;

    // check existing user
    // const exists = await db
    //   .select()
    //   .from(user)
    //   .where(eq(user.email, email));

    // if (exists.length > 0) {
    //   return res.status(400).json({
    //     message: "User already exists",
    //   });
    // }
    const existingEmail = await db
      .select()
      .from(user)
      .where(eq(user.email, email));

    if (existingEmail.length > 0) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }
    
    const existingMobile = await db
      .select()
      .from(user)
      .where(eq(user.mobile, mobile));
    
    if (existingMobile.length > 0) {
      return res.status(400).json({
        message: "Mobile number already registered",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert Customer
    const newCustomer = await db
      .insert(user)
      .values({
        name,
        email,
        mobile,
        password: hashedPassword,
        role: "customer",
      })
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      });

    return res.status(201).json({ message: "Customer registered successfully", data: newCustomer[0]!, });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Customer registration failed",
    });
  }
};
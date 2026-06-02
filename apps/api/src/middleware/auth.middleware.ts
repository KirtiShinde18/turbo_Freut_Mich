import { NextFunction, Request, Response } from "express"
import { JWT_KEY } from "../config/env"
import jwt from "jsonwebtoken"
import db from "../config/db"
import { eq } from "drizzle-orm"
import { user } from "../models"

// Adding optional user field to Request
interface AuthRequest extends Request {
    user? : string
}

export const protect = (role: string) => async ( req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.QUEEN
    if(!token){
        return res.status(401).json({message: 'Unauthorised access'})
    }
    jwt.verify(token, JWT_KEY, async (err: any, decode: any) => {
        if(err){
            return res.status(401).json({message: 'Invalid token'})
        }
        
        //                                                                👇🏻 auth controller -> Login fun
        const [result ] = await db.select().from(user).where(eq(user.id, decode.id))
        if(result && result.role === role){
            req.user = decode.id
            next()

        }else {
            return res.status(401).json({message: 'Admin only route'})

        }

        //req.user = decode.id

    })
}
import { Router } from "express";
import { loginAdmin, logoutAdmin, registerCustomer, getMe } from "../controllers/auth.controller";


const router = Router()

router
    .post("/login", loginAdmin)
    .post("/logout", logoutAdmin)

    // ================= current user =================
    .get("/me", getMe)

    // ================= customer register =================
    .post("/register-customer", registerCustomer)

export default router
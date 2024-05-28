import express from "express";
import {
  login,
  register,
  forgotPassword,
} from "../controllers/AdminControllers.js";
const router = express.Router();

// POST /admins/signup - Sign up a new admin
router.post("/signup", register);

// POST /admins/login - Log in an admin
router.post("/login", login);

// Get /admins/forgotpassword - Forgot password
router.get("/forgotpassword", forgotPassword);

export default router;

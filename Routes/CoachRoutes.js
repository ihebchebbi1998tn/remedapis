import express from "express";
import { createCoach, getAllCoaches } from "../controllers/CoachControllers.js";
const router = express.Router();

// POST /coaches/create - Create a new coach
router.post("/create", createCoach);

// GET /coaches/all - Get all coaches
router.get("/all", getAllCoaches);

export default router;

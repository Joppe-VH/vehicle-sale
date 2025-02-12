import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import { getUser } from "../controllers/userController";

const router = express.Router();

router.get("/:id", authMiddleware, getUser);

export default router;

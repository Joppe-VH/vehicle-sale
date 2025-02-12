import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import userIsResourceOwner from "../middleware/userIsResourceOwner";
import {
  addToFavorites,
  getUser,
  removeFromFavorites,
} from "../controllers/userController";

const router = express.Router();

router
  .get("/:id", authMiddleware, userIsResourceOwner, getUser)
  .patch(
    "/add-to-favorites/:id",
    authMiddleware,
    userIsResourceOwner,
    addToFavorites
  )
  .patch(
    "/remove-from-favorites/:id",
    authMiddleware,
    userIsResourceOwner,
    removeFromFavorites
  );

export default router;

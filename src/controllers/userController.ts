import { Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
const { ValidationError } = MongooseError;
import { User } from "../models/userModel";

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user || user._id !== id) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const userDetails = await User.findById(id)
      .select("-password")
      .populate("favorites");
    res.status(200).json({ status: "success", data: userDetails });
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    } else if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

import { Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
const { ValidationError } = MongooseError;
import { User } from "../models/userModel";

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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

export const addToFavorites = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { vehicleId } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $addToSet: { favorites: vehicleId },
      },
      { new: true }
    )
      .select("-password")
      .populate("favorites");
    res.status(200).json({ status: "success", data: updatedUser });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

export const removeFromFavorites = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { vehicleId } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $pull: { favorites: vehicleId },
      },
      { new: true }
    )
      .select("-password")
      .populate("favorites");
    res.status(200).json({ status: "success", data: updatedUser });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

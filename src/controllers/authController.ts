import { Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
const { ValidationError } = MongooseError;
import { User } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET, NODE_ENV } from "../config/env";
import validator from "validator";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      res.status(403).json({ message: "Email already in use" });
      return;
    }

    const isStrongPassword = validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
    });

    if (!isStrongPassword) {
      res.status(403).json({ message: "Password is not strong enough" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    if (!JWT_SECRET) throw new Error("no JWT secret available");
    const token = jwt.sign(
      { _id: newUser._id, email: newUser.email },
      JWT_SECRET as string
    );
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000 /* 1 dag */,
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax",
    });
    res.status(201).json({ status: "success", data: newUser });
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

// env === production or env === development
// how know which cookie is ours

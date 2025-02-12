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
      minSymbols: 0,
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
      JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000 /* 1 dag */,
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax",
    });
    const userObj = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
    };
    res.status(201).json({ status: "success", data: userObj });
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

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(404)
        .json({ message: "User does not exist. Please register!" });
      return;
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    if (!JWT_SECRET) throw new Error("no JWT secret available");
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      JWT_SECRET as string,
      { expiresIn: "1d" }
    );
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000 /* 1 dag */,
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax",
    });
    const userObj = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };
    res.status(200).json({ status: "success", data: userObj });
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

export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("token", "", {
      maxAge: 1,
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax",
    });
    res
      .status(200)
      .json({ status: "success", message: "Logged out successfully" });
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

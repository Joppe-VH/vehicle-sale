import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import { User } from "../models/userModel";

const localAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.redirect("/login");
      return;
    }
    if (!JWT_SECRET) {
      res.status(500).json({ message: "No JWT_SECRET env" });
      return;
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      res.redirect("/login");
      return;
    }

    const user = {
      _id: (decoded as JwtPayload)._id,
      email: (decoded as JwtPayload).email,
    };
    const userDetails = await User.findById(user._id).select("-password");
    req.user = user;
    req.locals = { user: userDetails };
    next();
  } catch (err: unknown) {
    const error = err as Error;
    console.log(error.message ?? "oops");
  }
};

export default localAuthMiddleware;

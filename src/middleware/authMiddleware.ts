import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(403).json({ message: "Not Authorized" });
      return;
    }
    if (!JWT_SECRET) {
      res.status(500).json({ message: "No JWT_SECRET env" });
      return;
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      res.status(403).json({ message: "Not Authorized" });
      return;
    }

    const user = {
      _id: (decoded as JwtPayload)._id,
      email: (decoded as JwtPayload).email,
    };
    req.user = user;
    next();
  } catch (err: unknown) {
    const error = err as Error;
    console.log(error.message ?? "oops");
  }
};

export default authMiddleware;

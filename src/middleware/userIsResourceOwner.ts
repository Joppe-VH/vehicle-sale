import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (id !== user?._id) {
      res
        .status(403)
        .json({ message: "Unauthorized, user does not own this resource" });
      return;
    }
    next();
  } catch (err: unknown) {
    const error = err as Error;
    console.log(error.message ?? "oops");
  }
};

export default authMiddleware;

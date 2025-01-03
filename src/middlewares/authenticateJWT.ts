/**
 * Authenticates a user using JWT
 * @param req Request object
 * @param res Response object
 * @param next Next function
 */

import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtUtils";

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Token is required" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = await verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Employee from "../models/Employee";

interface JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      employee?: any;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Token missing.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const employee = await Employee.findById(decoded.id).select("-password");

    if (!employee) {
      return res.status(401).json({
        success: false,
        message: "Employee not found.",
      });
    }

    req.employee = employee;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token.",
    });
  }
};
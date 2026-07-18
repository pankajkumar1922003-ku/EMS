import { Request, Response, NextFunction } from "express";

export const authorize = (...roles: string[]) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.employee) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!roles.includes(req.employee.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    next();
  };
};

export const selfOrAuthorize = (...roles: string[]) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.employee) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const isSelf = req.employee._id.toString() === req.params.id;
    const isAuthorized = roles.includes(req.employee.role);

    if (!isSelf && !isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    next();
  };
};
import { Request, Response } from "express";
import Employee from "../models/Employee";

export const getDashboardStats = async (
  req: Request,
  res: Response
) => {
  try {
    const totalEmployees = await Employee.countDocuments();

    const activeEmployees = await Employee.countDocuments({
      status: "Active",
    });

    const inactiveEmployees = await Employee.countDocuments({
      status: "Inactive",
    });

    const departmentStats = await Employee.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          department: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        departmentStats,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
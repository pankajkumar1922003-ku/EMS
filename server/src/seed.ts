import dotenv from "dotenv";
import bcrypt from "bcrypt";
import connectDB from "./config/db";
import Employee from "./models/Employee";
import mongoose from "mongoose";
import { generateEmployeeId } from "./utils/generateEmployeeId";

dotenv.config();

const ADMIN_EMAIL = "admin@ems.com";
const ADMIN_PASSWORD = "Admin@123";

const seedSuperAdmin = async () => {
  try {
    await connectDB();

    const existing = await Employee.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      console.log("Super Admin already exists:", ADMIN_EMAIL);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const employeeId = await generateEmployeeId();

    const admin = await Employee.create({
      employeeId,
      name: "Super Admin",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      phone: "9999999999",
      department: "Management",
      designation: "Super Admin",
      salary: 100000,
      joiningDate: new Date(),
      status: "Active",
      role: "Super Admin",
    });

    console.log("Super Admin created successfully!");
    console.log("Email:", ADMIN_EMAIL);
    console.log("Password:", ADMIN_PASSWORD);
    console.log("ID:", admin._id);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedSuperAdmin();
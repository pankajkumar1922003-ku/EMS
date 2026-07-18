import { body } from "express-validator";

export const createEmployeeValidator = [
  body("employeeId").notEmpty().withMessage("Employee ID is required"),

  body("name").notEmpty().withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("phone")
    .notEmpty()
    .withMessage("Phone number is required"),

  body("department")
    .notEmpty()
    .withMessage("Department is required"),

  body("designation")
    .notEmpty()
    .withMessage("Designation is required"),

  body("salary")
    .isNumeric()
    .withMessage("Salary must be a number"),

  body("joiningDate")
    .notEmpty()
    .withMessage("Joining Date is required"),

  body("role")
    .isIn(["Super Admin", "HR Manager", "Employee"])
    .withMessage("Invalid role"),
];
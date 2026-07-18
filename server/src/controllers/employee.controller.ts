import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Employee from "../models/Employee";
import mongoose from "mongoose";
import { generateEmployeeId } from "../utils/generateEmployeeId";

const wouldCreateCycle = async (
    employeeId: string,
    candidateManagerId: string
): Promise<boolean> => {
    if (!candidateManagerId) return false;
    if (candidateManagerId.toString() === employeeId.toString()) return true;

    const visited = new Set<string>();
    let currentId: string | null = candidateManagerId;

    while (currentId) {
        if (currentId.toString() === employeeId.toString()) return true;
        if (visited.has(currentId.toString())) break;
        visited.add(currentId.toString());

        const current: any = await Employee.findById(currentId).select(
            "manager"
        );
        currentId = current?.manager ? current.manager.toString() : null;
    }

    return false;
};

export const createEmployee = async (req: Request, res: Response) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            department,
            designation,
            salary,
            joiningDate,
            status,
            role,
            manager,
        } = req.body;

        if (role === "Super Admin" && req.employee?.role !== "Super Admin") {
            return res.status(403).json({
                success: false,
                message: "Only a Super Admin can assign the Super Admin role.",
            });
        }

        // Check existing employee by email only — employeeId is auto-generated below
        const existingEmployee = await Employee.findOne({ email });

        if (existingEmployee) {
            return res.status(400).json({
                success: false,
                message: "Employee already exists.",
            });
        }

        const employeeId = await generateEmployeeId();

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create employee
        const employee = await Employee.create({
            employeeId,
            name,
            email,
            password: hashedPassword,
            phone,
            department,
            designation,
            salary,
            joiningDate,
            status,
            role,
            manager,
        });

        return res.status(201).json({
            success: true,
            message: "Employee created successfully.",
            data: employee,
        });
    } catch (error) {
        console.error(error);


        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getEmployees = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            search,
            department,
            status,
            sort = "createdAt",
            order = "desc",
            page = "1",
            limit = "10",
        } = req.query;

        const query: any = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { employeeId: { $regex: search, $options: "i" } },
            ];
        }

        if (department) {
            query.department = department;
        }

        if (status) {
            query.status = status;
        }

        const currentPage = Number(page);
        const pageSize = Number(limit);

        const employees = await Employee.find(query)
            .select("-password")
            .sort({
                [sort as string]: order === "asc" ? 1 : -1,
            })
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize);

        const total = await Employee.countDocuments(query);

        return res.status(200).json({
            success: true,
            total,
            page: currentPage,
            totalPages: Math.ceil(total / pageSize),
            data: employees,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getEmployeeById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Employee ID",
            });
        }

        const employee = await Employee.findById(id).select("-password");

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: employee,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const updateEmployee = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Employee ID",
            });
        }

        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        const {
            name,
            email,
            phone,
            department,
            designation,
            salary,
            joiningDate,
            status,
            role,
            manager,
            profileImage,
        } = req.body;

        const isSelf = req.employee?._id?.toString() === id;
        const isPrivileged = ["Super Admin", "HR Manager"].includes(
            req.employee?.role
        );

        if (isSelf && !isPrivileged) {
            employee.name = name ?? employee.name;
            employee.phone = phone ?? employee.phone;
            employee.profileImage = profileImage ?? employee.profileImage;
        } else {
            if (role === "Super Admin" && req.employee?.role !== "Super Admin") {
                return res.status(403).json({
                    success: false,
                    message: "Only a Super Admin can assign the Super Admin role.",
                });
            }

            if (manager && manager !== String(employee.manager ?? "")) {
                const cycle = await wouldCreateCycle(id, manager);

                if (cycle) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Cannot assign this manager — it would create a circular reporting relationship.",
                    });
                }
            }

            employee.name = name ?? employee.name;
            employee.email = email ?? employee.email;
            employee.phone = phone ?? employee.phone;
            employee.department = department ?? employee.department;
            employee.designation = designation ?? employee.designation;
            employee.salary = salary ?? employee.salary;
            employee.joiningDate = joiningDate ?? employee.joiningDate;
            employee.status = status ?? employee.status;
            employee.role = role ?? employee.role;
            employee.manager = manager ?? employee.manager;
            employee.profileImage = profileImage ?? employee.profileImage;
        }

        await employee.save();

        const updatedEmployee = await Employee.findById(id).select("-password");

        return res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            data: updatedEmployee,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const deleteEmployee = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Employee ID",
            });
        }

        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        await employee.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Employee deleted successfully",
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getOrganizationHierarchy = async (
    req: Request,
    res: Response
) => {
    try {
        const employees = await Employee.find()
            .select("-password")
            .lean();

        const employeeMap: any = {};

        employees.forEach((emp: any) => {
            employeeMap[emp._id.toString()] = {
                ...emp,
                children: [],
            };
        });

        const hierarchy: any[] = [];

        employees.forEach((emp: any) => {
            if (emp.manager) {
                const managerId = emp.manager.toString();

                if (employeeMap[managerId]) {
                    employeeMap[managerId].children.push(
                        employeeMap[emp._id.toString()]
                    );
                }
            } else {
                hierarchy.push(employeeMap[emp._id.toString()]);
            }
        });

        return res.status(200).json({
            success: true,
            data: hierarchy,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
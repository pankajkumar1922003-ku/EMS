import { Router } from "express";
import { validate } from "../middleware/validation.middleware";
import { createEmployeeValidator } from "../validators/employee.validator";
import {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    getOrganizationHierarchy,
} from "../controllers/employee.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize, selfOrAuthorize } from "../middleware/role.middleware";

const router = Router();

router.post(
    "/",
    protect,
    authorize("Super Admin", "HR Manager"),
    createEmployeeValidator,
    validate,
    createEmployee
);

router.get(
    "/",
    protect,
    authorize("Super Admin", "HR Manager"),
    getEmployees
);

router.get(
    "/hierarchy",
    protect,
    authorize("Super Admin", "HR Manager"),
    getOrganizationHierarchy
);

router.get(
    "/:id",
    protect,
    selfOrAuthorize("Super Admin", "HR Manager"),
    getEmployeeById
);

router.put(
    "/:id",
    protect,
    selfOrAuthorize("Super Admin", "HR Manager"),
    updateEmployee
);

router.delete(
    "/:id",
    protect,
    authorize("Super Admin"),
    deleteEmployee
);  

export default router;
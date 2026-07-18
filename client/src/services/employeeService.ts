import api from "./api";
import type { EmployeeQueryParams } from "../types/employee";

export const getEmployees = (params?: EmployeeQueryParams) =>
  api.get("/employees", { params });

export const getEmployee = (id: string) =>
  api.get(`/employees/${id}`);

export const createEmployee = (data: Record<string, unknown>) =>
  api.post("/employees", data);

export const updateEmployee = (id: string, data: Record<string, unknown>) =>
  api.put(`/employees/${id}`, data);

export const deleteEmployee = (id: string) =>
  api.delete(`/employees/${id}`);

export const getHierarchy = () =>
  api.get("/employees/hierarchy");
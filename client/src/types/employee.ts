export interface Employee {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  joiningDate: string;
  status: string;
  role: string;
  manager?: string;
  profileImage?: string;
}

export interface EmployeeResponse {
  success: boolean;
  total: number;
  page: number;
  totalPages: number;
  data: Employee[];
}

export interface EmployeeQueryParams {
  search?: string;
  department?: string;
  status?: string;
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  departmentStats: { department: string; count: number }[];
}

export interface HierarchyNode extends Employee {
  children: HierarchyNode[];
}
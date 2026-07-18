import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  createEmployee,
  updateEmployee,
  getEmployee,
  getEmployees,
} from "../services/employeeService";
import type { Employee } from "../types/employee";

interface FormValues {
  employeeId: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  joiningDate: string;
  status: "Active" | "Inactive";
  role: "Super Admin" | "HR Manager" | "Employee";
  manager?: string;
}

const DEPARTMENTS = [
  "Engineering",
  "Sales",
  "Marketing",
  "HR",
  "Finance",
  "Operations",
];

const EmployeeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [managers, setManagers] = useState<Employee[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      status: "Active",
      role: "Employee",
    },
  });

  useEffect(() => {
    // load possible managers for the dropdown
    const fetchManagers = async () => {
      try {
        const response = await getEmployees({ limit: 100 });
        setManagers(response.data.data);
      } catch {
        // non-blocking, manager dropdown just stays empty
      }
    };

    fetchManagers();
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const response = await getEmployee(id);
        const emp: Employee = response.data.data;

        reset({
          employeeId: emp.employeeId,
          name: emp.name,
          email: emp.email,
          phone: emp.phone,
          department: emp.department,
          designation: emp.designation,
          salary: emp.salary,
          joiningDate: emp.joiningDate?.slice(0, 10),
          status: emp.status as "Active" | "Inactive",
          role: emp.role as FormValues["role"],
          manager: emp.manager || "",
        });
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to load employee"
        );
        navigate("/employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, reset, navigate]);

  const onSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true);

      const payload: Record<string, unknown> = {
        ...values,
        salary: Number(values.salary),
        manager: values.manager || null,
      };

      if (isEditMode) {
        // password isn't editable from this form once the employee exists
        delete payload.password;
        await updateEmployee(id as string, payload);
        toast.success("Employee updated successfully");
      } else {
        await createEmployee(payload);
        toast.success("Employee created successfully");
      }

      navigate("/employees");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} employee`
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <h2 className="text-center text-2xl font-semibold text-gray-500">
        Loading...
      </h2>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500";
  const labelClass = "mb-1 block text-sm font-medium text-gray-700";
  const errorClass = "mt-1 text-sm text-red-500";

  return (
    <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow">
      <h1 className="mb-6 text-2xl font-bold">
        {isEditMode ? "Edit Employee" : "Add Employee"}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2"
      >
        <div>
          <label className={labelClass}>Employee ID</label>
          <input
            className={inputClass}
            disabled={isEditMode}
            {...register("employeeId", {
              required: "Employee ID is required",
            })}
          />
          {errors.employeeId && (
            <p className={errorClass}>{errors.employeeId.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Full Name</label>
          <input
            className={inputClass}
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            className={inputClass}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
          />
          {errors.email && (
            <p className={errorClass}>{errors.email.message}</p>
          )}
        </div>

        {!isEditMode && (
          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              className={inputClass}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className={errorClass}>{errors.password.message}</p>
            )}
          </div>
        )}

        <div>
          <label className={labelClass}>Phone</label>
          <input
            className={inputClass}
            {...register("phone", {
              required: "Phone is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter a valid 10-digit phone number",
              },
            })}
          />
          {errors.phone && (
            <p className={errorClass}>{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Department</label>
          <select
            className={inputClass}
            {...register("department", {
              required: "Department is required",
            })}
          >
            <option value="">Select Department</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {errors.department && (
            <p className={errorClass}>{errors.department.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Designation</label>
          <input
            className={inputClass}
            {...register("designation", {
              required: "Designation is required",
            })}
          />
          {errors.designation && (
            <p className={errorClass}>{errors.designation.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Salary</label>
          <input
            type="number"
            step="0.01"
            className={inputClass}
            {...register("salary", {
              required: "Salary is required",
              min: { value: 1, message: "Salary must be greater than 0" },
            })}
          />
          {errors.salary && (
            <p className={errorClass}>{errors.salary.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Joining Date</label>
          <input
            type="date"
            className={inputClass}
            {...register("joiningDate", {
              required: "Joining date is required",
            })}
          />
          {errors.joiningDate && (
            <p className={errorClass}>{errors.joiningDate.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <select className={inputClass} {...register("status")}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Role</label>
          <select className={inputClass} {...register("role")}>
            <option value="Employee">Employee</option>
            <option value="HR Manager">HR Manager</option>
            <option value="Super Admin">Super Admin</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Reporting Manager</label>
          <select className={inputClass} {...register("manager")}>
            <option value="">None</option>
            {managers
              .filter((m) => m._id !== id)
              .map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} ({m.designation})
                </option>
              ))}
          </select>
        </div>

        <div className="col-span-1 flex justify-end gap-3 sm:col-span-2">
          <button
            type="button"
            onClick={() => navigate("/employees")}
            className="rounded-lg border px-5 py-2 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {submitting
              ? "Saving..."
              : isEditMode
              ? "Update Employee"
              : "Create Employee"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { getEmployee, updateEmployee } from "../services/employeeService";
import type { Employee } from "../types/employee";

interface FormValues {
  name: string;
  phone: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getEmployee(user.id);
        const emp: Employee = response.data.data;
        setEmployee(emp);
        reset({ name: emp.name, phone: emp.phone });
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, reset]);

  const onSubmit = async (values: FormValues) => {
    if (!user) return;

    try {
      setSubmitting(true);
      await updateEmployee(user.id, { ...values });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !employee) {
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
  const readOnlyBox =
    "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500";

  return (
    <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow">
      <h1 className="mb-6 text-2xl font-bold">My Profile</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2"
      >
        <div>
          <label className={labelClass}>Employee ID</label>
          <p className={readOnlyBox}>{employee.employeeId}</p>
        </div>

        <div>
          <label className={labelClass}>Email</label>
          <p className={readOnlyBox}>{employee.email}</p>
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
          <p className={readOnlyBox}>{employee.department}</p>
        </div>

        <div>
          <label className={labelClass}>Designation</label>
          <p className={readOnlyBox}>{employee.designation}</p>
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <p className={readOnlyBox}>{employee.status}</p>
        </div>

        <div>
          <label className={labelClass}>Role</label>
          <p className={readOnlyBox}>{employee.role}</p>
        </div>

        <div>
          <label className={labelClass}>Salary</label>
          <p className={readOnlyBox}>₹{employee.salary}</p>
        </div>

        <div className="col-span-1 flex justify-end sm:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <p className="mt-4 text-xs text-gray-400">
        Department, designation, role, and salary can only be changed by an
        admin or HR manager.
      </p>
    </div>
  );
};

export default Profile;
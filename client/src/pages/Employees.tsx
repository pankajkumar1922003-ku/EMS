import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import EmployeeTable from "../components/employees/EmployeeTable";
import Pagination from "../components/common/Pagination";
import {
  getEmployees,
  deleteEmployee,
} from "../services/employeeService";

import type { Employee } from "../types/employee";

const DEPARTMENTS = [
  "Engineering",
  "Sales",
  "Marketing",
  "HR",
  "Finance",
  "Operations",
];

const Employees = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("joiningDate");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const response = await getEmployees({
        search: search || undefined,
        department: department || undefined,
        status: status || undefined,
        sort,
        order,
        page,
        limit,
      });

      setEmployees(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch employees"
      );
    } finally {
      setLoading(false);
    }
  };

  // debounce search so we don't fire a request on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchEmployees();
    }, 400);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department, status, sort, order, page]);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) return;

    try {
      await deleteEmployee(id);
      toast.success("Employee deleted successfully");
      fetchEmployees();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/employees/edit/${id}`);
  };

  const toggleSort = (field: string) => {
    if (sort === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(field);
      setOrder("asc");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Employees</h1>

        <button
          onClick={() => navigate("/employees/add")}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Add Employee
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-3 rounded-xl bg-white p-4 shadow">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
        />

        <select
          value={department}
          onChange={(e) => {
            setPage(1);
            setDepartment(e.target.value);
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <select
          value={`${sort}-${order}`}
          onChange={(e) => {
            const [field, dir] = e.target.value.split("-");
            setSort(field);
            setOrder(dir as "asc" | "desc");
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
        >
          <option value="joiningDate-desc">Newest Joined</option>
          <option value="joiningDate-asc">Oldest Joined</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
        </select>
      </div>

      <div className="rounded-xl bg-white shadow">
        {loading ? (
          <p className="py-10 text-center text-gray-500">Loading...</p>
        ) : (
          <>
            <EmployeeTable
              employees={employees}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSortChange={toggleSort}
              activeSort={sort}
              activeOrder={order}
            />

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Employees;

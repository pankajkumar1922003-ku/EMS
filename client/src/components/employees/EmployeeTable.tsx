import type { Employee } from "../../types/employee";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Props {
  employees: Employee[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSortChange?: (field: string) => void;
  activeSort?: string;
  activeOrder?: "asc" | "desc";
}

const EmployeeTable = ({
  employees,
  onEdit,
  onDelete,
  onSortChange,
  activeSort,
  activeOrder,
}: Props) => {
  const sortArrow = (field: string) => {
    if (activeSort !== field) return "";
    return activeOrder === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow">
      <table className="min-w-full">
        <thead className="bg-slate-800 text-white">
          <tr>
            <th className="px-4 py-3 text-left">Employee ID</th>
            <th
              onClick={() => onSortChange?.("name")}
              className="cursor-pointer select-none px-4 py-3 text-left hover:text-blue-300"
            >
              Name{sortArrow("name")}
            </th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Department</th>
            <th className="px-4 py-3 text-left">Designation</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th
              onClick={() => onSortChange?.("joiningDate")}
              className="cursor-pointer select-none px-4 py-3 text-left hover:text-blue-300"
            >
              Joined{sortArrow("joiningDate")}
            </th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="py-8 text-center text-gray-500"
              >
                No Employees Found
              </td>
            </tr>
          ) : (
            employees.map((emp) => (
              <tr
                key={emp._id}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-4 py-3">{emp.employeeId}</td>

                <td className="px-4 py-3">{emp.name}</td>

                <td className="px-4 py-3">{emp.email}</td>

                <td className="px-4 py-3">{emp.department}</td>

                <td className="px-4 py-3">{emp.designation}</td>

                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-sm text-white ${
                      emp.status === "Active"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {emp.joiningDate
                    ? new Date(emp.joiningDate).toLocaleDateString()
                    : "-"}
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => onEdit(emp._id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => onDelete(emp._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
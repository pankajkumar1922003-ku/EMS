import { NavLink } from "react-router-dom";
import {
  FaUsers,
  FaHome,
  FaUserCircle,
  FaSitemap,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  const isPrivileged =
    user?.role === "Super Admin" || user?.role === "HR Manager";

  return (
    <aside className="w-64 bg-slate-900 text-white shadow-lg">
      <div className="border-b border-slate-700 p-6">
        <h1 className="text-2xl font-bold">
          EMS
        </h1>
      </div>

      <nav className="mt-6 flex flex-col gap-2 px-3">

        {isPrivileged && (
          <NavLink
            to="/"
            end
            className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-800"
          >
            <FaHome />
            Dashboard
          </NavLink>
        )}

        {isPrivileged && (
          <NavLink
            to="/employees"
            className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-800"
          >
            <FaUsers />
            Employees
          </NavLink>
        )}

        {isPrivileged && (
          <NavLink
            to="/hierarchy"
            className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-800"
          >
            <FaSitemap />
            Organization
          </NavLink>
        )}

        <NavLink
          to="/profile"
          className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-800"
        >
          <FaUserCircle />
          Profile
        </NavLink>

      </nav>
    </aside>
  );
};

export default Sidebar;
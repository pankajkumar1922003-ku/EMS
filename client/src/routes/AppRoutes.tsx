import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Employees from "../pages/Employees";
import EmployeeForm from "../pages/EmployeeForm";
import OrganizationHierarchy from "../pages/OrganizationHierarchy";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";

import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

const ADMIN_ROLES = ["Super Admin", "HR Manager"];

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route
            index
            element={
              <RoleRoute allowedRoles={ADMIN_ROLES}>
                <Dashboard />
              </RoleRoute>
            }
          />

          <Route
            path="employees"
            element={
              <RoleRoute allowedRoles={ADMIN_ROLES}>
                <Employees />
              </RoleRoute>
            }
          />

          <Route
            path="employees/add"
            element={
              <RoleRoute allowedRoles={ADMIN_ROLES}>
                <EmployeeForm />
              </RoleRoute>
            }
          />

          <Route
            path="employees/edit/:id"
            element={
              <RoleRoute allowedRoles={ADMIN_ROLES}>
                <EmployeeForm />
              </RoleRoute>
            }
          />

          <Route
            path="hierarchy"
            element={
              <RoleRoute allowedRoles={ADMIN_ROLES}>
                <OrganizationHierarchy />
              </RoleRoute>
            }
          />

          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  allowedRoles: string[];
  children: React.ReactNode;
}

const RoleRoute = ({ allowedRoles, children }: Props) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};

export default RoleRoute;
import { Navigate } from "react-router-dom";
import { usePermission } from "../hooks/usePermission";

const ProtectedRoute = ({ module, action, children }) => {
  const hasPermission = usePermission(module, action);

  // If permission is denied
  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;

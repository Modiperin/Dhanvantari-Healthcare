import { useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";
import { getAuthToken, removeAuthToken } from "../services/cookies";
import HospitalLoader from "../components/loader/HospitalLoader";
import { errorToastMessage } from "../utils/toastMessage";

export default function ProtectedLayout({ children, allowedRoles = [] }) {
  const location = useLocation();
  const token = getAuthToken();
  const { userInfo, isLoading } = useSelector((state) => state.user);

  const user = userInfo?.response;

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && allowedRoles.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/not-found" replace />;
  }

  if (isLoading || !user) {
    return <HospitalLoader />;
  }

  if (user && user.isLocked) {
    removeAuthToken();
    errorToastMessage("Your account has been locked. Please contact admin.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

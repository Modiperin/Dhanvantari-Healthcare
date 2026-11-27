// import Header from "./components/Header";
import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "./routes";
import { Toaster } from "react-hot-toast";
import { getAuthToken, removeDataFromCookies } from "./services/cookies";
import { useEffect } from "react";
import { fetchUserSettings } from "./slices/userSlice";
import { RouteErrorBoundary } from "./components/ErrorBoundaries/ErrorBoundary";
import useSocket from "./hooks/useSocket";
// import useNavigateTo from "./hooks/useNavigateTo";
import { useInactivityLogout } from "./hooks/useInactivityLogout";
import NetworkListener from "./components/NetworkListener";

export default function App() {
  const dispatch = useDispatch();
  const token = getAuthToken();
  const user = useSelector((state) => state.user.userInfo?.response);
  // const navigate = useNavigateTo();

  const logoutUser = () => {
    // removeDataFromCookies(['token'])
    // navigate("/login")
  };
  useInactivityLogout({ logoutFn: logoutUser });

  useEffect(() => {
    if (token) {
      dispatch(fetchUserSettings());
    }
  }, [token, dispatch]);

  // Initialize WebSocket connection
  useSocket({ token, user });

  return (
    <div className="h-[100%]">
      <RouteErrorBoundary routeName="AppRoutes">
        <Toaster position="top-right" reverseOrder={false} />
        <NetworkListener />
        <AppRoutes />
      </RouteErrorBoundary>
    </div>
  );
}

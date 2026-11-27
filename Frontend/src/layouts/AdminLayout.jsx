import { Outlet } from "react-router-dom";
import ProtectedLayout from "./ProtectedLayout";
import Sidebar from "../features/dashboard/components/Sidebar";
import BuildingsIcon from "../assets/svg/buildings.svg?react";
// import HeartAddIcon from "../assets/svg/heart-add.svg?react";
// import MessagesIcon from "../assets/svg/messages.svg?react";
import LogoutIcon from "../assets/svg/logout.svg?react";
import { useCallback, useMemo, useState } from "react";
import { removeAuthToken } from "../services/cookies";
import useNavigateTo from "../hooks/useNavigateTo";

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    return stored === "true"; // default is false if not set
  });
  const goTo = useNavigateTo();

  const Logout = useCallback(() => {
    removeAuthToken();
    setTimeout(() => {
      goTo("/login");
    }, 1000);
  }, [goTo]); // goTo is likely stable, but include it as dependency

  const sidebars = useMemo(
    () => [
      {
        id: 1,
        label: "Hospital Onboarding",
        icon: BuildingsIcon,
        to: "/admin/onboard",
        children: ["admin"],
      },
      // {
      //   id: 2,
      //   label: "Create Branches",
      //   icon: HeartAddIcon,
      //   to: "/admin/createbranch",
      // },
      // {
      //   id: 3,
      //   label: "Help Center",
      //   icon: MessagesIcon,
      //   to: "/help-center",
      // },
      {
        id: 4,
        label: "Logout",
        icon: LogoutIcon,
        onClick: Logout,
      },
    ],
    [Logout]
  );

  const handleToggle = () => {
    setIsCollapsed((prev) => {
      localStorage.setItem("sidebar-collapsed", !prev);
      return !prev;
    });
  };
  return (
    <ProtectedLayout allowedRoles={["O"]}>
      <div className="relative flex">
        <div className="fixed">
          <Sidebar
            data={sidebars}
            isCollapsed={isCollapsed}
            handleToggle={handleToggle}
          />
        </div>

        {/* <div>Admin top bar</div> */}
        <main className="w-full">
          {/* page container */}
          <div
            className={`${
              isCollapsed
                ? "ml-[60px] lg:ml-[90px]"
                : "ml-[170px] lg:ml-[240px]"
            } transition-all duration-300`}
          >
            <div className="max-w-[1650px] w-[99%] py-1 mx-auto">
              {/* Scrollable content */}
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </ProtectedLayout>
  );
};

export default AdminLayout;

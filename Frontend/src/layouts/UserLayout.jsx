import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import BuildingsIcon from "../assets/svg/buildings.svg?react";
import DashboardIcon from "../assets/svg/dashboard.svg?react";
import NurseOPDIcon from "../assets/svg/message-add.svg?react";
import Patient from "../assets/svg/patient.svg?react";
import ProfileIcon from "../assets/svg/profile-circle.svg?react";
import UserAdd from "../assets/svg/user-add.svg?react";
import UserTagIcon from "../assets/svg/user-tag.svg?react";
import TopBar from "../components/TopBar";
import Sidebar from "../features/dashboard/components/Sidebar";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { ROUTES } from "../routes/helper";
import ProtectedLayout from "./ProtectedLayout";

const sidebars = (setChatOpen) => [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: DashboardIcon,
    to: ROUTES.DASHBOARD,
    children: ["dashboard", ""],
  },
  {
    id: "administration",
    label: "Administration",
    moduleName: "admin",
    icon: BuildingsIcon,
    to: ROUTES.STAFF_MANAGEMENT,
    children: [
      "profiles",
      "departments",
      "staff",
      "pricingcatalog",
      "pricings",
      "doctors",
      "doctor/create",
    ],
  },
  {
    id: "patient-registration",
    label: "Patient Registration",
    moduleName: "patient",
    icon: ProfileIcon,
    to: ROUTES.REGISTRATION_CREATE,
    children: ["registration", "registrations"],
  },
  // {
  //   id: "roaster",
  //   label: "Roster Management",
  //   moduleName: "roaster",
  //   icon: CalenderIcon,
  //   to: ROUTES.ROSTER_MANAGEMENT,
  //   children: ["roster"],
  // },
  {
    id: "appointments",
    label: "Appointments",
    moduleName: "appointment",
    icon: UserTagIcon,
    to: ROUTES.APPOINTMENTS,
    children: ["appointments", "appointment"],
  },
  {
    id: "nurse",
    label: "Nurse OPD ",
    moduleName: "nurse",
    icon: NurseOPDIcon,
    to: ROUTES.NURSE_OPD,
    children: ["nurse-opd"],
  },
  {
    id: "doctor",
    label: "Doctor OPD",
    moduleName: "doctor",
    icon: UserAdd,
    to: ROUTES.DOCTOR_OPD,
    children: ["doctor-opd"],
  },
  {
    id: "patients",
    label: "Patients",
    moduleName: "patient",
    to: ROUTES.PATIENTS,
    icon: Patient,
    children: ["patients", "patient"],
  },
  // {
  //   id: "pharmacy",
  //   label: "Pharmacy",
  //   moduleName: "pharmacy",
  //   to: ROUTES.PHARMACY,
  //   icon: BuildingsIcon,
  //   children: ["pharmacy"],
  // },
  // {
  //   id: "payment",
  //   label: "Payment",
  //   moduleName: "cashier",
  //   to: ROUTES.PAYMENTS,
  //   icon: PaymentIcon,
  //   children: ["payments", "payment"],
  // },

  // {
  //   id: "help-center",
  //   label: "Help Center",
  //   icon: MessagesIcon,
  //   to: "/help-center",
  // },
  // {
  //   id: "ai-chat",
  //   label: "Chat with AI",
  //   icon: AiIcon,
  //   onClick: () => {
  //     setChatOpen((prev) => !prev);
  //   },
  //   className: "animate-custom-border",
  // },
];

const HIDE_TOPBAR_ROUTES = [`${ROUTES.DOCTOR_OPD}/consultation`];

const UserLayout = () => {
  const user = useSelector((state) => state.user.userInfo?.response);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    return stored === "true"; // default is false if not set
  });
  const [isTabletScreen, setIsTabletScreen] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);

  const handleToggle = () => {
    setIsCollapsed((prev) => {
      localStorage.setItem("sidebar-collapsed", !prev);
      return !prev;
    });
  };

  const { pathname } = useLocation();
  const hideTopBar = HIDE_TOPBAR_ROUTES.some((route) =>
    pathname.includes(route)
  );

  let accessibleSidebar = sidebars(setChatOpen);
  if (!["O", "S"].includes(user?.role)) {
    accessibleSidebar = sidebars(setChatOpen).filter((item) => {
      if (item.moduleName) {
        if (
          item.label === "Patient Registration" &&
          !user?.access?.[item.moduleName]?.modify
        )
          return false;

        return user?.access?.[item.moduleName]?.view;
      }
      return true;
    });
  }
  const handleResize = () => {
    const isTablet = window.innerWidth < 1024;
    setIsTabletScreen(isTablet);

    // Auto-collapse sidebar when screen becomes tablet size
    if (isTablet && !isCollapsed) {
      setIsCollapsed(true);
    }

    // When expanding from tablet to desktop, restore the stored preference
    if (!isTablet && isCollapsed) {
      const stored = localStorage.getItem("sidebar-collapsed");
      setIsCollapsed(stored === "true");
    }
  };

  // Use the custom title hook
  useDocumentTitle();

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    // Clean up the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, [isCollapsed]);

  return (
    <ProtectedLayout allowedRoles={["S", "A", "D", "T"]}>
      <div className="relative flex">
        <div className="fixed">
          <Sidebar
            data={accessibleSidebar}
            isCollapsed={isCollapsed}
            handleToggle={handleToggle}
            isTabletScreen={isTabletScreen}
          />
        </div>
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
              {/* Fixed header */}
              {!hideTopBar && <TopBar />}
              {/* Scrollable content */}
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </ProtectedLayout>
  );
};

export default UserLayout;

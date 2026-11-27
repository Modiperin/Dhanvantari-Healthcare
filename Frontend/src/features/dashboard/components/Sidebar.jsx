import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import white_logo_2 from "../../../assets/images/logo/dhanvantari-logo-white.svg";
import DoubleNext from "../../../components/svgs/DoubleNext";
import { cn } from "../../../lib/utils";
import SliderButton from "./SliderButton";

const Sidebar = ({ data, isCollapsed, handleToggle }) => {
  const n = data?.length - 1;
  const location = useLocation();
  const activeTab = data.find((tab) => {
    const pathKey = location.pathname.split("/")[1];
    // const subModule = location.pathname.split("/")[2];
    // console.log({ subModule });
    // console.log({ pathKey });
    return [...(tab?.children || [])].includes(pathKey);
  });

  // console.log({ activeTab });

  const [active, setActive] = useState(null);
  const { userInfo } = useSelector((state) => state.user);
  const hospitalDetails = useMemo(
    () => userInfo?.response?.hospitalData || {},
    [userInfo]
  );

  // console.log({ active });

  const navigate = useNavigate();

  const navigateSidebar = (to, id, onClick) => {
    if (to) {
      navigate(to);
      setActive(id);
    }
    if (onClick) {
      onClick();
    }
  };

  useEffect(() => {
    if (activeTab?.id) {
      setActive(activeTab?.id);
    }
  }, [activeTab?.id]);

  return (
    <div
      className={`z-50 text-xs lg:text-sm h-[100vh] bg-blue overflow-y-scroll scrollbar-hide transition-all duration-300
        ${
          isCollapsed
            ? "w-[60px] lg:w-[90px] items-center"
            : "w-[170px] lg:w-[240px]"
        }
      `}
    >
      <div
        className={`flex gap-2 items-center p-4 justify-between w-full border-b border-gray-400 ${
          isCollapsed ? "justify-center" : ""
        }`}
      >
        {!isCollapsed && (
          <img
            src={hospitalDetails.logo || white_logo_2}
            alt="logo"
            className="h-[50px] lg:h-[46px] min-w-auto m-auto"
          />
        )}
        <span
          className="cursor-pointer p-2 bg-[#0B4B81] rounded-xl"
          onClick={handleToggle}
        >
          <DoubleNext
            color="#ffffff"
            className={cn(
              isCollapsed ? "rotate-0" : "rotate-180",
              "duration-300"
            )}
          />
        </span>
      </div>

      <>
        <div className="flex flex-col p-2 lg:p-4">
          {data.slice(0, n+1).map((item) => (
            <SliderButton
              key={item.id}
              {...item}
              isActive={active}
              navigateSidebar={navigateSidebar}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </>
    </div>
  );
};

export default Sidebar;

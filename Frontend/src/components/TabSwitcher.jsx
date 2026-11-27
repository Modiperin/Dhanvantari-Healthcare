import { useState } from "react";
import useNavigateTo from "../hooks/useNavigateTo";

const TabSwitcher = ({ tabs, selected, id = "" }) => {
  const [active, setActive] = useState(selected);
  // const activeIndex = tabs.findIndex((tab) => tab.id === active);
  const goTo = useNavigateTo();

  const selectTab = (id, to) => {
    if (id === active) return;
    setActive(id);
    goTo(to);
  };

  return (
    <ul className="text-sm lg:text-base relative font-medium list flex items-center justify-start px-3 py-2 text-blue bg-extra-light-blue rounded-md w-fit">
      {/* <div className="rounded-lg absolute top-2 h-[calc(100%-16px)] w-[150px]  bg-blue transition-all duration-300 z-0" /> */}
      {tabs.map((tab) => {
        return (
          <li
            key={tab.id}
            className={`${
              tab.id === active ? "text-white bg-blue" : "bg-transparent"
            } px-5 py-2 cursor-pointer duration-300 w-fit relative z-10 text-center rounded-lg`}
            onClick={() => selectTab(tab.id, id ? `${tab.to}/${id}` : tab.to)}
          >
            {tab.name}
          </li>
        );
      })}
    </ul>
  );
};

export default TabSwitcher;

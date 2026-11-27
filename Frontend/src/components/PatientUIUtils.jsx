import React from "react";
import { dobToAge } from "../utils/common";
import TooltipWrapper from "./ReactTooltip";

const PatientUIUtils = (name, gender, dob, goto, path) => {
  return (
    <div className="flex flex-col text-blue-500 text-sm leading-tight w-full capitalize">
      {/* Top row: Name scrollable, Age/Gender fixed */}
      <div className="flex flex-col lg:flex-row items-start gap-2">
        {/* Scrollable name */}
        <div className=" overflow-x-auto whitespace-nowrap scrollbar-hide max-w-[150px]">
          <TooltipWrapper
            id="patient-name"
            content={name}
            // className="!font-sans !text-blue !bg-white !border !border-light-blue"
          >
            <span
              className="font-semibold inline-block cursor-pointer"
              onClick={() => goto && path && goto(path)}
            >
              {name}
            </span>
          </TooltipWrapper>
        </div>

        {/* Age | Gender */}
        <span className="flex text-gray-500 text-xs whitespace-nowrap">
          {dob ? `${dobToAge(dob)}y | ` : ""}
          <span className="capitalize">{gender ? `${gender}` : ""}</span>
        </span>
      </div>
    </div>
  );
};

export default PatientUIUtils;

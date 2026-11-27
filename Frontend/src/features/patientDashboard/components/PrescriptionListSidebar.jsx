import React from "react";
import HorizontalLine from "../../../components/lines/HorizontalLine";
import { formatDate } from "../../../utils/dateAndTime";

const PrescriptionListSidebar = ({
  prescriptionsList = [],
  selectedVisit,
  setSelectedVisit,
}) => (
  <div className="w-60 xl:w-120 text-blue h-full bg-light-blue rounded-md flex flex-col overflow-y-auto border border-light-blue p-2 xl:p-4">
    <div className="overflow-y-auto flex flex-col gap-1 xl:gap-2">
      {prescriptionsList.map((visit, index) => (
        <React.Fragment key={visit.visitId || index}>
          <div
            className={`px-2 gap-2 text-xs xl:text-sm flex bg-white rounded-md items-center py-1 hover:scale-105 duration-200 hover:border-blue cursor-pointer ${
              selectedVisit === visit.visitId ? "!bg-blue text-white" : ""
            }`}
            onClick={() => setSelectedVisit(visit.visitId)}
          >
            <span className="flex bg-light-blue/90 text-[10px] lg:text-xs text-blue rounded-full p-2">
              Rx
            </span>
            <h3>{formatDate(visit.createdAt, "MMMM do yyyy, hh:mm a")}</h3>
          </div>
          <HorizontalLine />
        </React.Fragment>
      ))}
    </div>
  </div>
);

export default PrescriptionListSidebar;

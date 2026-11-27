import React from "react";
import HorizontalLine from "../../../components/lines/HorizontalLine";
import VerticalLine from "../../../components/lines/VerticalLine";

const MedicationCard = ({ data = [] }) => {
  return (
    <div className="rounded-lg border border-light-blue text-light-blue-text">
      {data.map((d, i) => {
        return (
          <div key={i}>
            <div className="grid grid-cols-3 gap-2 py-2 px-4 text-sm">
              <div className="text-blue">{d.name}</div>
              <div className="flex items-center col-span-2 gap-2 text-sm">
                <VerticalLine />
                <div>
                  <span>Doses : </span>{" "}
                  <span className="text-blue">{d.doses}</span>
                </div>
                <VerticalLine />
                <div>
                  <span>Days : </span>{" "}
                  <span className="text-blue">{d.noOfDays}</span>
                </div>
                <VerticalLine />
                <div className="flex text-xs">({d.timeSlot?.join("-")})</div>
              </div>
            </div>
            {data.length - 1 > i && <HorizontalLine />}
          </div>
        );
      })}
    </div>
  );
};

export default MedicationCard;

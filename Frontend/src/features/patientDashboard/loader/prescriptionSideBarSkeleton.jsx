import React from "react";
import Skeleton from "../../../components/Skeleton";
import HorizontalLine from "../../../components/lines/HorizontalLine";

const PrescriptionListSkeleton = () => (
  <div className="w-120 text-blue h-full bg-light-blue rounded-md flex flex-col overflow-y-auto border border-light-blue">
    <div className="overflow-y-scroll py-2">
      {[...Array(12)].map((_, idx) => (
        <React.Fragment key={idx}>
          <div className="px-2 m-2 mx-4 gap-2 text-sm flex bg-white rounded-md items-center py-1">
            <Skeleton className="bg-light-blue/90 text-xs rounded-full p-2 h-7 w-7" />
            <Skeleton className="h-5 w-40 rounded" />
          </div>
          <HorizontalLine />
        </React.Fragment>
      ))}
    </div>
  </div>
);

export default PrescriptionListSkeleton;

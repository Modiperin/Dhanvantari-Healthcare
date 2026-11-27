import React from "react";
import Skeleton from "../../../components/Skeleton";

const VitalBoxSkeleton = () => {
  return (
    <div className="col-span-6 row-span-3 border rounded-md border-light-blue p-4">
      <Skeleton className="h-6 w-1/4 mb-8" />
      <div className="grid grid-cols-2 gap-4">
        {[...Array(12)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
};

export default VitalBoxSkeleton;

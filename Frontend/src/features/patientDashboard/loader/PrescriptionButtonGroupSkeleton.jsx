import React from "react";
import Skeleton from "../../../components/Skeleton";

const PrescriptionButtonGroupSkeleton = () => (
  <div className="flex justify-end mt-2 gap-2">
    {[...Array(5)].map((_, idx) => (
      <Skeleton key={idx} className="h-10 w-40 rounded-md" />
    ))}
  </div>
);

export default PrescriptionButtonGroupSkeleton;

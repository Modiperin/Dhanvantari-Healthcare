import React from "react";
import Skeleton from "../../../components/Skeleton";

const PaymentSkeleton = ({ count = 3 }) => {
  return (
    <>
      <div className="w-full rounded-md overflow-hidden">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="grid grid-cols-12 gap-3 p-3 items-center">
            <Skeleton className="h-4 w-42 col-span-3" />
            <Skeleton className="h-4 w-10 col-span-1" />
            <Skeleton className="h-4 w-20 col-span-2" />
            <Skeleton className="h-4 w-20 col-span-2" />
            <Skeleton className="h-4 w-16 col-span-2" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-8" />
          </div>
        ))}
      </div>
    </>
  );
};

export default PaymentSkeleton;

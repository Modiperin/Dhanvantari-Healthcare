import React from "react";
import Skeleton from "../../../components/Skeleton";

const PatientRegisterSkeleton = () => {
  return (
    <>
      <div className="w-full h-full">
        <div className="grid grid-cols-2 gap-2 h-auto w-full">
          {/* Left Column */}
          <div className="flex flex-col gap-2">
            {/* Patient Details Card */}
            <div className="bg-white border-[1.5px] border-[var(--color-light-blue)] rounded-lg p-6 flex flex-col gap-4">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-10 w-full" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24 ml-auto" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-10 w-1/4" />
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            {/* Emergency Contact Card */}
            <div className="bg-white border-[1.5px] border-[var(--color-light-blue)] rounded-lg p-6 flex flex-col gap-4">
              <Skeleton className="h-6 w-56 mb-2" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-10 w-1/2" />
              </div>
              <Skeleton className="h-10 w-1/2" />
            </div>
          </div>
          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Address Details Card */}
            <div className="bg-white border-[1.5px] border-[var(--color-light-blue)] rounded-lg p-6 flex flex-col gap-4">
              <Skeleton className="h-6 w-48 mb-2" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-10 w-1/2" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-10 w-1/2" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-10 w-1/3" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-10 w-1/2" />
              </div>
            </div>
            {/* Department & Doctor Details Card */}
            <div className="bg-white border-[1.5px] border-[var(--color-light-blue)] rounded-lg p-6 flex flex-col gap-4">
              <Skeleton className="h-6 w-64 mb-2" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-10 w-1/2" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-10 w-1/2" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </>
  );
};

export default PatientRegisterSkeleton;

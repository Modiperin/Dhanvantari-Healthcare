import React from "react";
import Skeleton from "../../../components/Skeleton";

const EditPatientDetailsSkeleton = () => {
  return (
    <div className="page">
      <div className="mb-6">
        <Skeleton className="h-10 w-1/3" />
      </div>
      <form>
        <div className="columns-2 h-auto w-full gap-6 flex">
          {/* Basic Info Card */}
          <div className="flex-1 bg-white rounded-xl p-6 shadow">
            <Skeleton className="h-6 w-40 mb-6" />
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-4">
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex col-span-4 gap-4">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-10 w-1/2" />
              </div>
              <div className="col-span-2">
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="col-span-2">
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="col-span-2">
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="col-span-2">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <Skeleton className="h-6 w-56 mt-8 mb-4" />
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2">
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="col-span-2">
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="col-span-4">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
          {/* Address & Medical History Card */}
          <div className="flex-1 bg-white rounded-xl p-6 shadow">
            <Skeleton className="h-6 w-40 mb-6" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div className="col-span-2" key={i}>
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
            <Skeleton className="h-6 w-40 mt-8 mb-4" />
            {/* Medical History fields */}
            <div className="flex gap-4 mb-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-24" />
              ))}
            </div>
            <div className="flex flex-col gap-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <Skeleton className="h-10 w-32" />
        </div>
      </form>
    </div>
  );
};

export default EditPatientDetailsSkeleton;

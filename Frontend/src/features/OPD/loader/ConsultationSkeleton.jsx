import React from "react";
import VitalBoxSkeleton from "./VitalBoxSkeleton";
import MedicalHistorySkeletonLoader from "./MedicalHistorySkeletonLoader";
import ConsultationCardSkeleton from "./ConsultationCardSkeleton";
import Skeleton from "../../../components/Skeleton";

const ConsultationSkeleton = () => {
  return (
    <div className="bg-white rounded-lg w-full h-full p-5 flex flex-1 flex-col gap-3 my-3">
      {/* Form Container Skeleton */}
      <div className="grid grid-cols-2 gap-5 rounded-lg">
        {/* Vitals Section */}
        <div>
          <VitalBoxSkeleton />
        </div>

        {/* Patient History Section */}
        <div className="w-auto h-full border border-light-blue rounded-lg p-5">
          <Skeleton className="h-6 w-32 mb-4" /> {/* Title */}
          <MedicalHistorySkeletonLoader />
        </div>

        {/* Complaints Section */}
        <div className="col-span-full w-auto h-full border border-light-blue rounded-lg px-5 py-3">
          <Skeleton className="h-8 w-40 mb-3" /> {/* Title */}
          <div className="space-y-3">
            {Array.from({ length: 1 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* Diagnosis Card */}
        <div className="col-span-full w-auto rounded-lg">
          {Array.from({ length: 1 }).map((_, i) => (
            <ConsultationCardSkeleton key={i} />
          ))}
        </div>

        {/* Medications Card */}
        <div className="col-span-full w-auto rounded-lg">
          {Array.from({ length: 1 }).map((_, i) => (
            <ConsultationCardSkeleton key={i} />
          ))}
        </div>

        {/* Labs Section */}
        <div className="col-span-full w-auto rounded-lg">
          {Array.from({ length: 1 }).map((_, i) => (
            <ConsultationCardSkeleton key={i} />
          ))}
        </div>

        {/* Clinical Findings */}
        <div className="col-span-full w-auto rounded-lg">
          {Array.from({ length: 1 }).map((_, i) => (
            <ConsultationCardSkeleton key={i} />
          ))}
        </div>

        {/* Refer To Doctor */}
        <div className="col-span-full w-auto rounded-lg">
          {Array.from({ length: 1 }).map((_, i) => (
            <ConsultationCardSkeleton key={i} />
          ))}
        </div>

        {/* Follow Up Details */}
        <div className="col-span-1 w-auto h-full border border-light-blue rounded-lg p-5">
          <Skeleton className="h-6 w-40 mb-5" /> {/* Title */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-5">
              <Skeleton className="h-12 flex-1" /> {/* Days input */}
              <Skeleton className="h-4 w-8" /> {/* "OR" text */}
              <Skeleton className="h-12 flex-1" /> {/* Date picker */}
            </div>
            <Skeleton className="h-12 w-full" /> {/* Instruction input */}
          </div>
        </div>

        {/* Advice Section */}
        <div className="col-span-1 w-auto h-full border border-light-blue rounded-lg p-5">
          <Skeleton className="h-24 w-full" /> {/* Textarea */}
        </div>

        {/* Notes Section */}
        <div className="col-span-full w-auto h-full border border-light-blue rounded-lg p-5 flex flex-col">
          <Skeleton className="h-6 w-64 mb-5" /> {/* Title */}
          <div className="w-full flex items-center gap-5 h-full">
            <Skeleton className="h-32 flex-1" /> {/* Private notes */}
            <Skeleton className="h-32 flex-1" /> {/* Public notes */}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-5 items-end justify-between w-full col-span-full">
          <Skeleton className="h-12 w-24 rounded-lg" /> {/* Reset button */}
          <Skeleton className="h-12 w-24 rounded-lg" /> {/* Submit button */}
        </div>
      </div>
    </div>
  );
};

export default ConsultationSkeleton;

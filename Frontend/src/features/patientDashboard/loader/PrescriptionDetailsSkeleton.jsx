import React from "react";
import Skeleton from "../../../components/Skeleton";
import VerticalLine from "../../../components/lines/VerticalLine";
import HorizontalLine from "../../../components/lines/HorizontalLine";

const PrescriptionDetailsSkeleton = () => (
  <div className="flex flex-col overflow-scroll border p-4 text-blue border-light-blue w-full rounded-md">
    {/* Header */}
    <div className="flex justify-between items-center pb-4 mb-4 border-b border-light-blue">
      <Skeleton className="h-6 w-32 rounded" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-6 w-40 rounded" />
        <Skeleton className="h-4 w-24 rounded" />
      </div>
    </div>

    {/* Patient Info */}
    <div className="flex items-center justify-between mb-2">
      <div className="flex gap-1 items-center justify-center">
        <Skeleton className="h-5 w-24 rounded" />
        <VerticalLine />
        <Skeleton className="h-4 w-16 rounded" />
        <VerticalLine />
        <Skeleton className="h-4 w-12 rounded" />
        <VerticalLine />
        <Skeleton className="h-4 w-16 rounded" />
      </div>
      <div className="text-sm flex gap-1 items-center">
        <Skeleton className="h-4 w-20 rounded" />
      </div>
    </div>

    {/* Habits */}
    <div className="flex items-center my-2 gap-2">
      <div className="min-w-40">
        <Skeleton className="h-4 w-24 rounded" />
      </div>
      <VerticalLine />
      <Skeleton className="h-4 w-20 rounded" />
      <Skeleton className="h-4 w-20 rounded" />
    </div>
    <HorizontalLine />

    {/* Complaints */}
    <div className="flex items-center my-2 gap-2">
      <div className="min-w-40">
        <Skeleton className="h-4 w-24 rounded" />
      </div>
      <VerticalLine />
      <Skeleton className="h-4 w-32 rounded" />
    </div>
    <HorizontalLine />

    {/* Diagnosis */}
    <div className="flex items-center my-2 gap-2">
      <div className="min-w-40">
        <Skeleton className="h-4 w-24 rounded" />
      </div>
      <VerticalLine />
      <Skeleton className="h-4 w-32 rounded" />
    </div>
    <HorizontalLine />

    {/* Prescription Table */}
    <div className="my-3">
      <Skeleton className="h-6 w-32 rounded mb-2" />
      <div className="mt-3 border border-light-blue rounded-lg">
        <div className="flex justify-between px-4 py-2 gap-4 border-b border-light-blue">
          {[...Array(4)].map((_, idx) => (
            <Skeleton key={idx} className="h-8 w-full rounded" />
          ))}
        </div>
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className="flex justify-between px-4 py-2 gap-4 border-b border-light-blue"
          >
            <Skeleton className="h-8 w-full rounded" />
            <Skeleton className="h-8 w-full rounded" />
            <Skeleton className="h-8 w-full rounded" />
            <Skeleton className="h-8 w-full rounded" />
          </div>
        ))}
      </div>
    </div>

    {/* Labs */}
    <div className="flex items-center my-2 gap-2">
      <div className="min-w-40">
        <Skeleton className="h-4 w-32 rounded" />
      </div>
      <VerticalLine />
      <Skeleton className="h-4 w-24 rounded" />
    </div>
    <HorizontalLine />

    {/* Findings */}
    <div className="flex items-center my-2 gap-2">
      <div className="min-w-40">
        <Skeleton className="h-4 w-32 rounded" />
      </div>
      <VerticalLine />
      <Skeleton className="h-4 w-24 rounded" />
    </div>
    <HorizontalLine />

    {/* Referred To */}
    <div className="flex items-center my-2 gap-2">
      <div className="min-w-40">
        <Skeleton className="h-4 w-32 rounded" />
      </div>
      <VerticalLine />
      <Skeleton className="h-4 w-32 rounded" />
    </div>
    <HorizontalLine />

    {/* Follow-up */}
    <div className="flex items-center my-2 gap-2">
      <div className="min-w-40">
        <Skeleton className="h-4 w-32 rounded" />
      </div>
      <VerticalLine />
      <Skeleton className="h-4 w-24 rounded" />
    </div>
  </div>
);

export default PrescriptionDetailsSkeleton;

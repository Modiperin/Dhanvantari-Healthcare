import Skeleton from "../../../components/Skeleton";
import { cn } from "../../../lib/utils";

const ConsultationCardSkeleton = ({ itemCount = 1 }) => {
  return (
    <div>
      {/* Title Skeleton */}
      <div className="bg-[#6100AC]/10 w-fit px-5 py-2 rounded-t-xl ml-5 my-0">
        <Skeleton className="h-6 w-24" />
      </div>

      {/* Main Container */}
      <div className="border border-light-blue rounded-lg min-h-28 p-5 flex flex-col gap-4">
        {/* Search Box Skeleton */}
        <div className="relative">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        {/* Diagnosis Items */}
        {Array.from({ length: itemCount }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "relative grid gap-5 border-light-blue items-center rounded-lg justify-items-stretch",
              itemCount > 1 ? "grid-cols-9" : "grid-cols-8"
            )}
          >
            {/* Name */}
            <div className="col-span-2">
              <Skeleton className="h-6 w-full" />
            </div>

            {/* Duration Selector */}
            <div className="col-span-2">
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>

            {/* Status Selector */}
            <div className="col-span-2">
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>

            {/* Note Input */}
            <div className="col-span-2">
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>

            {/* Remove Button (conditionally shown) */}
            {itemCount > 1 && (
              <div className="w-fit">
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsultationCardSkeleton;

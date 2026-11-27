import Skeleton from "../../../components/Skeleton";
import ClockIcon from "../../../assets/svg/clock.svg?react";

const PaymentLogsModalSkeleton = () => (
  <div className="flex max-h-[85vh] flex-col space-y-4 py-4 animate-pulse">
    {[...Array(10)].map((_, idx) => (
      <div key={idx} className="flex gap-4">
        {/* Icon Skeleton */}
        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <ClockIcon className="w-4 h-4 text-gray-300" />
        </div>
        {/* Content Skeleton */}
        <div className="flex-1 min-w-0">
          <Skeleton className="h-4 w-3/4 mb-2 rounded" />
          <div className="flex gap-3 mt-1">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        </div>
      </div>
    ))}
    {/* Button Skeleton */}
    <div className="flex justify-end gap-3 mt-6 mb-6">
      <Skeleton className="h-10 w-24 rounded" />
    </div>
  </div>
);

export default PaymentLogsModalSkeleton;

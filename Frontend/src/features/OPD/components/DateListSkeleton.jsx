import Skeleton from "../../../components/Skeleton";

const DateListSkeleton = ({ count = 5 }) => {
  return (
    <div className="flex gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-col">
          {/* Date box skeleton */}
          <div className="flex flex-col items-center rounded-t-lg border border-gray-200 px-6 py-1 text-xs">
            <Skeleton className="h-3 w-6 mb-1" />
            <Skeleton className="h-5 w-6 mb-1" />
            <Skeleton className="h-3 w-6" />
          </div>
          {/* Time skeleton */}
          <Skeleton className="h-4 rounded-b-lg text-[10px]" />
        </div>
      ))}
    </div>
  );
};

export default DateListSkeleton;
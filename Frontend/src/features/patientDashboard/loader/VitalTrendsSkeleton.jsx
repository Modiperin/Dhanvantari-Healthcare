import Skeleton from "../../../components/Skeleton";

const VitalTrendsSkeleton = () => (
  <div className="page animate-pulse">
    {/* Table Header Skeleton */}
    <div className="border border-light-blue rounded-lg">
      <div className="flex px-4 py-3 gap-2">
        {[...Array(12)].map((_, idx) => (
          <Skeleton key={idx} className="h-6 w-24 rounded" />
        ))}
      </div>
      {/* Table Rows Skeleton */}
      {[...Array(10)].map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="grid grid-cols-12 gap-2 py-2 px-4 border-b border-light-blue"
        >
          {[...Array(12)].map((_, colIdx) => (
            <Skeleton key={colIdx} className="h-4 m-1 w-full rounded" />
          ))}
        </div>
      ))}
    </div>

    {/* Chart Skeleton */}
    <div className="border border-light-blue rounded-lg p-4 my-4">
      <Skeleton className="h-8 w-1/4 mb-4 rounded" />
      <Skeleton className="h-60 w-full rounded" />
    </div>
  </div>
);

export default VitalTrendsSkeleton;

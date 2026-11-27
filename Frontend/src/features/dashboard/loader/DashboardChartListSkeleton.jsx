import Skeleton from "../../../components/Skeleton";

const DashboardChartListSkeleton = () => (
  <div className="grid grid-cols-12 items-center justify-between mt-4 gap-4">
    {/* Most Dispensed Medicines */}
    <div className="text-blue h-full justify-center col-span-6 flex flex-col gap-2 p-4 border border-light-blue rounded-lg animate-pulse">
      <Skeleton className="h-4 w-48 mb-2" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-32 w-32 rounded-full" />
        <div className="space-y-3 flex-1">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <Skeleton className="w-3 h-3 rounded-full" />
              <Skeleton className="h-4 w-34" />
              <Skeleton className="h-4 w-12 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Recent Returning Patients */}
    <div className="text-blue col-span-6 flex flex-col gap-2 p-4 border border-light-blue rounded-lg animate-pulse">
      <Skeleton className="h-4 w-48 mb-2" />
      <div className="flex flex-col gap-2">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="grid grid-cols-3 gap-1 p-2 border border-light-blue rounded-lg"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32 col-span-2" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>

    {/* Most Common Diagnoses */}
    <div className="text-blue h-full justify-center col-span-6 flex flex-col gap-2 p-4 border border-light-blue rounded-lg animate-pulse">
      <Skeleton className="h-4 w-48 mb-2" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-32 w-32 rounded-full" />
        <div className="space-y-3 flex-1">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <Skeleton className="w-3 h-3 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-12 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default DashboardChartListSkeleton;

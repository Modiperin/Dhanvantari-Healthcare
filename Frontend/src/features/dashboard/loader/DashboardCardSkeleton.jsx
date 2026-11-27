import Skeleton from "../../../components/Skeleton";

const DashboardCardSkeleton = () => (
  <div className="grid text-blue grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Registrations Skeleton */}
    <div className="border flex flex-col justify-between border-light-blue p-6 rounded-lg animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="p-2 rounded-full h-10 w-10" />
      </div>
      <div className="flex items-center justify-between mt-4">
        <Skeleton className="h-4 w-24 rounded-lg" />
        <Skeleton className="h-4 w-24 rounded-lg" />
        <Skeleton className="h-4 w-24 rounded-lg" />
      </div>
    </div>

    {/* Vitals Skeleton */}
    <div className="border border-light-blue p-6 rounded-lg animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="p-2 rounded-full h-10 w-10" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-4 w-24 mb-2" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-20 rounded-lg" />
          <Skeleton className="h-4 w-20 rounded-lg" />
        </div>
      </div>
    </div>

    {/* Appointments Skeleton */}
    <div className="border flex flex-col justify-between border-light-blue p-6 rounded-lg animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-40 mb-2" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="p-2 rounded-full h-10 w-10" />
      </div>
      <div className="flex items-center justify-between mt-4">
        <Skeleton className="h-4 w-40 rounded-lg" />
      </div>
    </div>
  </div>
);

export default DashboardCardSkeleton;

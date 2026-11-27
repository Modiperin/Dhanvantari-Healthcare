import Skeleton from "../../../components/Skeleton";

const PatientCardSkeleton = () => (
  <div className="relative border border-light-blue rounded-xl p-4 flex flex-col gap-2 bg-white animate-pulse">
    {/* <Skeleton className="absolute -top-7 left-8 h-6 w-24 rounded-sm" /> */}
    <div className="flex items-center gap-2 justify-between">
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-16" />
      </div>
      {/* <div className="flex gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div> */}
    </div>
    <div className="flex text-sm items-center gap-2 justify-between">
      <div className="flex gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
    <div className="flex gap-2 mt-3 flex-wrap">
      <Skeleton className="h-8 w-24 rounded-full" />
      <Skeleton className="h-8 w-24 rounded-full" />
      <Skeleton className="h-8 w-40 rounded-full" />
    </div>
  </div>
);

export default PatientCardSkeleton;

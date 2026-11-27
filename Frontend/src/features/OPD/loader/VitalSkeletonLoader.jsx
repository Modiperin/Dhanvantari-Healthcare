import Skeleton from "../../../components/Skeleton";
import VitalBoxSkeleton from "./VitalBoxSkeleton";

const VitalSkeletonLoader = () => (
  <div className="bg-white rounded-lg w-full min-h-[100dvh] p-10 flex flex-1 flex-col gap-3 my-3">
    <div className="flex items-center gap-3 mb-2">
      <Skeleton className="h-10 w-10" circle />
      <Skeleton className="h-6 w-1/3" />
    </div>
    <div className="grid grid-cols-12 grid-rows-3 gap-2 text-blue">
      <div className="col-span-3 row-span-3 border rounded-md border-light-blue p-4 flex flex-col gap-4">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
      <VitalBoxSkeleton />
      <div className="col-span-3 row-span-2 border rounded-md border-light-blue p-4 flex flex-col gap-3">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-6 w-full" />

        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
      <div className="col-span-3 row-span-1 border rounded-md border-light-blue p-4 flex flex-col gap-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
    <div className="grid grid-cols-12 gap-2 text-blue mt-6">
      <div className="col-span-9 row-span-3 border border-light-blue rounded-md p-4">
        <Skeleton className="h-10 w-full mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="col-span-3 row-span-3 justify-end mb-2 p-4 flex flex-col gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  </div>
);

export default VitalSkeletonLoader;

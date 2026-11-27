import Skeleton from "../../../components/Skeleton";

const DoctorDetailsCardSkeleton = () => (
  <div className="flex flex-col gap-3 p-2">
    <Skeleton className="h-6 w-1/2 mb-2" />
    <Skeleton className="h-10 w-full mb-2" />
    <Skeleton className="h-10 w-full mb-2" />
    <Skeleton className="h-8 w-1/3" />
  </div>
);

export default DoctorDetailsCardSkeleton;

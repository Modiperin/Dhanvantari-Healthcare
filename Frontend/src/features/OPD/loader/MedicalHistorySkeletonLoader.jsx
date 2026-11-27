import Skeleton from "../../../components/Skeleton";

const MedicalHistorySkeletonLoader = () => (
    <div className="max-w-full">
      <div className="flex gap-2 mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))} 
      </div>
      <div className="flex flex-col gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i}>
            <Skeleton className="h-10 w-full rounded" />
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <Skeleton className="h-10 w-24 rounded" />
      </div>
    </div>
);

export default MedicalHistorySkeletonLoader;
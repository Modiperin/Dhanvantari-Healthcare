import Skeleton from "../../../components/Skeleton";

const PaymentCardSkeleton = () => (
  <div className="flex p-4 rounded-lg items-center gap-4 bg-light-blue/50 animate-pulse min-h-[80px]">
    <Skeleton className="h-16 w-16 rounded-full" />
    <div className="flex flex-col gap-2 flex-1">
      <Skeleton className="h-4 w-24 rounded" />
      <Skeleton className="h-6 w-20 rounded" />
    </div>
  </div>
);

export default PaymentCardSkeleton;

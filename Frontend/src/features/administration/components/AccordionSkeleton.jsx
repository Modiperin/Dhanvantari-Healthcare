import Skeleton from "../../../components/Skeleton";
import { cn } from "../../../lib/utils";

const AccordionItemSkeleton = () => {
  return (
    <div className="accordion">
      {/* Accordion Header Skeleton */}
      <div
        className={cn(
          "relative flex items-center justify-between w-full border border-light-blue rounded-lg p-6 h-[117px] text-blue/80 cursor-pointer"
        )}
      >
        <div className="w-1/3 flex flex-col gap-2 items-start">
          <div className="flex items-center gap-2">
            <Skeleton circle className="h-6 w-6" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="w-1/3 flex flex-col gap-2 items-end mr-14">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
        <div className="absolute top-1/2 right-5 -translate-y-1/2 flex items-center gap-1">
          <Skeleton circle className="h-6 w-6" />
          <Skeleton circle className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

const AccordionGroupSkeleton = () => {
  return (
    <div className="accordion-group flex flex-col gap-5">
      {[...Array(10)].map((_, i) => (
        <AccordionItemSkeleton key={i} />
      ))}
    </div>
  );
};

export default AccordionGroupSkeleton;

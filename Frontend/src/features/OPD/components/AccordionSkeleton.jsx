import { cn } from "../../../lib/utils";

const AccordionSkeleton = ({ count = 5 }) => {
  return (
    <div className="space-y-2">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="rounded-lg overflow-hidden">
          {/* Header Skeleton */}
          <div
            className={cn(
              "flex items-center justify-between p-4 h-20",
              "bg-gray-100 animate-pulse"
            )}
          >
            
          </div>

          {/* Body Skeleton - only shown if you want to simulate an open accordion */}
          <div className="p-4 space-y-2 hidden">
            {" "}
            {/* Remove 'hidden' to show body skeleton */}
            <div className="h-4 w-full rounded bg-gray-200"></div>
            <div className="h-4 w-5/6 rounded bg-gray-200"></div>
            <div className="h-4 w-4/6 rounded bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccordionSkeleton;

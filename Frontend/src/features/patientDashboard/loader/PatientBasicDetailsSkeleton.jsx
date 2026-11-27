import Skeleton from "../../../components/Skeleton";

const PatientBasicDetailsSkeleton = () => {
  return (
    <>
      <div className="page">
        <div className="h-10 w-1/3 mb-4">
          <Skeleton className="h-10 w-1/2" />
        </div>
        <div className="flex justify-end mb-4">
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="w-full min-h-[100dvh] bg-white rounded-lg p-8 flex flex-col gap-8">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 mb-6">
            <div className="flex items-center gap-6">
              <Skeleton className="w-20 h-20 rounded-full" />
              <div>
                <Skeleton className="h-7 w-40 mb-2" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-8">
            {/* Patient Details */}
            <div className="bg-white rounded-xl p-0">
              <div className="text-xl font-semibold text-blue-900 mb-2 px-6 pt-6">
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="grid grid-cols-2 px-6 py-3 gap-2">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </div>
            </div>

            {/* Address Details */}
            <div className="bg-white rounded-xl p-0">
              <div className="text-xl font-semibold text-blue-900 mb-2 px-6 pt-6">
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="grid grid-cols-2 px-6 py-3 gap-2">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contact Details */}
            <div className="bg-white rounded-xl p-0">
              <div className="text-xl font-semibold text-blue-900 mb-2 px-6 pt-6">
                <Skeleton className="h-6 w-56" />
              </div>
              <div className="">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="grid grid-cols-2 px-6 py-3 gap-2">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </div>
            </div>

            {/* Patient History */}
            <div className="bg-white rounded-xl p-0">
              <div className="text-xl font-semibold text-blue-900 mb-2 px-6 pt-6">
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="grid grid-cols-2 px-6 py-3 gap-2">
                    <Skeleton className="h-5 w-32" />
                    <div className="flex gap-2 flex-wrap">
                      {[...Array(3)].map((_, j) => (
                        <Skeleton key={j} className="h-5 w-16" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientBasicDetailsSkeleton;

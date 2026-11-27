import Skeleton from "../../../components/Skeleton";


const WeekyCalenderLoader = ({ rows = 5, cols = 7 }) => (
  <>
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="grid grid-cols-12 border-b border-light-blue">
        <div className="col-span-3 p-4 flex flex-col justify-center gap-2">
          <Skeleton className="h-4 w-[120px]"/>
          <Skeleton className="h-4 w-20" />
        </div>
        {[...Array(cols)].map((_, j) => (
          <div
            key={j}
            className="col-span-[(9/7)] p-2 flex flex-col items-center justify-center text-center min-h-[56px]"
            style={{ flex: `0 0 ${100 / cols}%` }}
          >
            <Skeleton className="h-6 w-[60px]" />

          </div>
        ))}
      </div>
    ))}
  </>
);

export default WeekyCalenderLoader;

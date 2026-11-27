import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const WeekyCalenderLoader = ({ rows = 5, cols = 7 }) => (
  <>
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="grid grid-cols-12 border-b border-light-blue">
        <div className="col-span-3 p-4 flex flex-col justify-center">
          <Skeleton height={24} width={120} />
          <Skeleton height={16} width={80} className="mt-2" />
        </div>
        {[...Array(cols)].map((_, j) => (
          <div
            key={j}
            className="col-span-[(9/7)] p-2 flex flex-col items-center justify-center text-center min-h-[56px]"
            style={{ flex: `0 0 ${100 / cols}%` }}
          >
            <Skeleton height={24} width={60} />
          </div>
        ))}
      </div>
    ))}
  </>
);

export default WeekyCalenderLoader;

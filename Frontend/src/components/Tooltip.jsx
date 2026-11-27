import { cn } from "../lib/utils";
import TooltipWrapper from "./ReactTooltip";

const Tooltip = ({ _class, data = [] }) => {
  return (
    //don't write overflow-x: scroll, it will break the tooltip
    <div
      className={cn(
        _class,
        "cursor-pointer relative whitespace-nowrap scrollbar-hide"
      )}
    >
      {data.length <= 2 ? (
        data.slice(0, 2).join(", ")
      ) : (
        <TooltipWrapper
          id={"tooltip-" + data.join("-")}
          content={data.join(", ")}
        >
          {data.slice(0, 2).join(", ")}...
        </TooltipWrapper>
      )}
    </div>
  );
};

export default Tooltip;

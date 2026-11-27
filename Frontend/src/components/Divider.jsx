import React from "react";
import { cn } from "../lib/utils";

const Divider = ({ items, separator = "," }) => {
  return (
    <div className="max-w-[200px] lg:max-w-[600px] overflow-x-auto overflow-y-hidden scrollbar-hide">
      <span className={cn("flex items-center gap-0.5")}>
        {items?.map((item, index) => (
          <div key={index} className="text-nowrap items-center flex gap-1">
            {index !== 0 && <span>{separator}</span>}
            <>{item}</>
          </div>
        ))}
      </span>
    </div>
  );
};

export default Divider;

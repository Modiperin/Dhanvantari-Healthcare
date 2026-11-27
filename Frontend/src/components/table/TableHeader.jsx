import { cn } from "../../lib/utils";

const TableHeader = ({
  data,
  isCompressView,
  extraClass = "",
  isSticky = false,
}) => {
  return (
    <div
      className={cn(
        isCompressView ? "p-0" : "p-2 xl:p-4",
        isSticky && "sticky top-0",
        "grid grid-cols-12 font-semibold text-xs xl:text-sm bg-extra-light-blue rounded-t-lg text-blue",
        extraClass
      )}
    >
      {data.map((header, idx) => {
        const { name, _class = "col-span-1" } = header;
        return (
          <div
            key={idx}
            className={cn(
              _class,
              "px-2 py-2 overflow-x-auto whitespace-nowrap scrollbar-hide"
            )}
          >
            {name}
          </div>
        );
      })}
    </div>
  );
};

export default TableHeader;

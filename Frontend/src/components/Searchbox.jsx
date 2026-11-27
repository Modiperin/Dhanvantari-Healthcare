import { useRef } from "react";
import SearchNormal from "../assets/svg/search-normal.svg?react";
import useClickOutside from "../hooks/useClickOutside";
import { cn } from "../lib/utils";

const SearchBox = ({
  search,
  setSearch,
  placeholder = "Search Modules",
  showData = false,
  dataJSX = <></>,
  extraClass = "",
  onKeyDown,
  disabled = false,
  isCompressed = false,
}) => {
  // const boxRef = ;
  useClickOutside(useRef(null));
  return (
    <div
      ref={useRef(null)}
      className={cn(
        `relative flex flex-col gap-3 min-w-fit lg:min-w-1/2 xl:min-w-4/12 max-w-full`,
        extraClass,
        disabled && "cursor-not-allowed"
      )}
    >
      <div
        className={cn(
          "flex flex-1 p-2 justify-between items-center text-xs lg:text-lg relative bg-white w-auto border border-blue-border rounded-lg focus-within:border-blue hover:border-blue duration-300",
          isCompressed ? "max-h-10" : "max-h-12"
        )}
      >
        <span
          className={cn(
            "mx-3",
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          )}
        >
          <SearchNormal />
        </span>
        <input
          disabled={disabled}
          type="search"
          placeholder={
            disabled ? "Remove Current Doctor to add Another" : placeholder
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(
            "outline-none bg-transparent text-blue w-full xl:!text-base",
            disabled && "cursor-not-allowed opacity-80 text-sm"
          )}
          onKeyDown={(e) => onKeyDown?.(e)}
        />
      </div>
      {showData && (
        <div className="divide-light-blue divide-y-1 p-1 absolute top-[46px] z-38 w-full border border-blue-border flex flex-col rounded-lg bg-white text-blue shadow-lg h-max overflow-y-scroll overflow-x-hidden">
          {dataJSX}
        </div>
      )}
    </div>
  );
};

export default SearchBox;

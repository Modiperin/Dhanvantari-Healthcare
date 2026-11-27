import IconButton from "../../../components/IconButton";
import FilterSearchIcon from "../../../assets/svg/filter-search.svg?react";
import { useRef, useState } from "react";
import useClickOutside from "../../../hooks/useClickOutside";
import { cn } from "../../../lib/utils";
import CaretIcon from "../../../assets/svg/caret.svg?react";
import DoubleRangeSlider from "../../../components/DoubleRangeSlider";
import OptionGroup from "../../../components/OptionGroup";
import Button from "../../../components/Buttons/Button";

const FilterBox = ({
  filterConfig = [],
  titleName = "Filter",
  setSearchFilters,
}) => {
  const initial = filterConfig?.reduce((accum, filter) => {
    switch (filter.type) {
      case "slider":
        accum[filter.key] = [filter.min, filter.max];
        break;
      case "checkbox":
        accum[filter.key] = [];
    }
    return accum;
  }, {});
  const [searchBy, setSearchBy] = useState(initial);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  useClickOutside(boxRef, () => setOpen(false));

  const handleFilterChange = (key, value) => {
    setSearchBy((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyingFilter = () => {
    let searchQuery = filterConfig.reduce((accum, curr) => {
      const key = curr.key;
      const value = searchBy[key];

      if (!value || (Array.isArray(value) && value.length === 0)) {
        return accum;
      }

      switch (curr.type) {
        case "slider":
          if (value[0] === curr.min && value[1] === curr.max) break;
          accum += `&${key}Start=${encodeURIComponent(
            value[0]
          )}&${key}End=${encodeURIComponent(value[1])}`;
          break;

        case "checkbox":
          accum += `&${key}=${value
            .map((v) => encodeURIComponent(v))
            .join(",")}`;
          break;

        default:
          break;
      }

      return accum;
    }, "");
    setSearchFilters(searchQuery);
    setOpen(false);
  };
  return (
    <div className="relative inline-block" ref={boxRef}>
      <Button
        onClick={() => setOpen(!open)}
        variant="light"
        className="h-10 w-fit !py-2 !px-2"
      >
        <FilterSearchIcon />

        <CaretIcon
          className={cn(
            "text-xl duration-300 h-6 overflow-clip w-6",
            open ? "rotate-180" : "rotate-0 opacity-40"
          )}
        />
      </Button>
      {open && (
        <div className="absolute bg-white z-50 min-h-96 w-96 rounded-lg border border-light-blue shadow-sm p-6 flex flex-col gap-3">
          <h2 className="font-medium text-blue text-xl"> {titleName}</h2>
          {filterConfig.map((filter, i) => {
            switch (filter?.type) {
              case "slider":
                return (
                  <DoubleRangeSlider
                    key={i}
                    label={filter.label}
                    min={filter.min}
                    max={filter.max}
                    value={searchBy[filter.key]}
                    onChange={(newAge) =>
                      handleFilterChange(filter.key, newAge)
                    }
                  />
                );
              case "checkbox":
                return (
                  <OptionGroup
                    key={i}
                    name={filter.key}
                    // labelName={filter.label}
                    options={filter.options}
                    type="checkbox"
                    selected={searchBy[filter.key]}
                    onChange={(val) => handleFilterChange(filter.key, val)}
                  />
                );
            }
          })}
          <div className="flex items-center gap-2 justify-between mt-5">
            <Button
              variant="light"
              className="!shadow-none"
              onClick={() => {
                setSearchBy(initial);
                setSearchFilters("");
              }}
            >
              Reset
            </Button>
            <Button
              variant="dark"
              className="!border-0 !shadow-none"
              selected
              onClick={() => applyingFilter()}
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBox;

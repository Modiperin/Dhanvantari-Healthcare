import PlusIcon from "../assets/svg/plus.svg?react";
import { getNestedError } from "../utils/common";
import { cn } from "../lib/utils";

const CommonSelect = ({
  id,
  name,
  labelName = "",
  required = false,
  options = [],
  errors = {},
  disabled = false,
  isCompressed = false,
  register = null, // 👈 accept RHF register instead of Controller
  value: propValue,
  onChange: propOnChange = () => {},
  _class = "",
  defaultOption = "",
  selected = true,
}) => {
  const errorMessage = getNestedError(errors, name)?.message;

  const selectProps = register
    ? {
        ...register(name),
      }
    : {
        value: propValue,
        onChange: (e) => {
          const selectedValue = e.target.value;
          const selected = options.find((opt) => opt.value === selectedValue);
          propOnChange?.(selected?.value);
        },
      };

  return (
    <div
      className={cn(
        "relative text-blue z-0 flex flex-col",
        isCompressed ? "min-w-fit h-[56px]" : "w-full h-full",
        _class
      )}
    >
      <select
        id={id}
        name={name}
        disabled={disabled}
        {...selectProps}
        className={cn(
          `p-2 block w-full min-w-[120px] px-2 mt-0 bg-transparent
          border border-light-blue appearance-none focus:outline-none
          focus:ring-0 focus:border-blue rounded-lg`,
          !isCompressed && "max-h-12"
        )}
      >
        <option value="" selected={selected} hidden>
          {defaultOption}
        </option>
        {options.length > 0 ? (
          options?.map((option, i) => (
            <option
              key={`${option.name}-${i}`}
              value={option.value}
              selected={!selected ? i === 0 : false}
            >
              {option.name}
            </option>
          ))
        ) : (
          <option disabled>No Data Available</option>
        )}
      </select>

      {/* Floating Icon */}
      <PlusIcon
        className={cn(
          "pointer-events-none duration-300 hover:rotate-45 focus:rotate-45 absolute right-3 transform -translate-y-1/2",
          isCompressed ? "top-7" : "top-1/2"
        )}
      />

      {/* Floating Label */}
      {labelName && (
        <label
          htmlFor={id}
          className={cn(
            "absolute duration-300 top-2 -z-1 origin-0 text-gray-500 px-2"
          )}
        >
          {labelName}
          {required && <span>*</span>}
        </label>
      )}

      {/* Error Message */}
      {errorMessage && (
        <p className="text-xs text-red-600 text-start ml-1 mt-0.5">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default CommonSelect;

import { useState, useRef, useEffect } from "react";
import { Controller } from "react-hook-form";
import { cn } from "../lib/utils";
import PlusIcon from "./svgs/PlusIcon";
import CommonInput from "./CommonInput";

const ControlledInputWithDropdown = ({
  name,
  control,
  inputLabel = "",
  inputType = "text",
  options,
  inputExtraClass = "",
  selectBoxClass = "",
  dropdownClass = "",
  placeholder = "Enter text",
  onChange, // Add this prop
  disabled = false,
  showPlusIcon = true,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const currentValue = field.value || {
          value: "",
          unit: options[0]?.value || "",
        };

        const handleChange = (newValue) => {
          // Update react-hook-form's internal state
          field.onChange(newValue);

          // Notify parent component if onChange prop is provided
          if (onChange) {
            onChange({
              name, // Field name
              value: newValue.value, // The input value
              unit: newValue.unit, // The selected unit
              fullValue: newValue, // The complete { value, unit } object
            });
          }
        };

        return (
          <div>
            <div className="flex w-full" ref={dropdownRef}>
              <div className="w-3/5">
                <CommonInput
                  id={`${name}-input`}
                  name={`${name}-input`}
                  labelName={inputLabel}
                  value={currentValue.value}
                  type={inputType}
                  disabled={disabled}
                  onChange={(value) => {
                    handleChange({
                      ...currentValue,
                      value:
                        inputType === "number"
                          ? value === ""
                            ? ""
                            : +value
                          : value,
                    });
                  }}
                  placeholder={placeholder}
                  extraClass={`rounded-r-none ${inputExtraClass}`}
                />
              </div>

              {/* Dropdown Button */}
              <div className="h-10 flex relative w-2/5">
                <button
                  type="button"
                  onClick={() => setOpen((prev) => !prev)}
                  disabled={disabled}
                  className={`group z-10 bg-extra-light-blue border border-light-blue hover:border-blue duration-300 rounded-r-md px-4 py-2 flex items-center justify-between text-sm focus:outline-none focus:ring-1 w-full ${selectBoxClass}`}
                >
                  <span>
                    {options.find((opt) => opt.value === currentValue.unit)
                      ?.label || "Select"}
                  </span>
                  <span
                    className={cn(
                      "duration-300 focus:rotate-45 absolute right-3 transform -translate-y-1/2 group-focus:rotate-45",
                      "top-1/2"
                    )}
                  >
                    {showPlusIcon && <PlusIcon />}
                  </span>
                </button>

                {/* Dropdown Options */}
                {open && (
                  <ul
                    className={`absolute right-0 top-full mt-1 bg-white border border-light-blue rounded-md shadow-lg z-100 text-sm ${dropdownClass}`}
                  >
                    {options.map((opt) => (
                      <li
                        key={opt.value}
                        onClick={() => {
                          const newValue = {
                            ...currentValue,
                            unit: opt.value,
                          };
                          handleChange(newValue);
                          setOpen(false);
                        }}
                        className="px-4 py-2 hover:bg-light-blue cursor-pointer text-nowrap"
                      >
                        {opt.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {error?.message && (
              <p className="text-xs text-red-600 text-start ml-1 mt-0.5">
                {error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
};

export default ControlledInputWithDropdown;

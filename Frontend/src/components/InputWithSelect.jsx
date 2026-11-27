import { useState, useRef, useEffect } from "react";
import { cn } from "../lib/utils";
import PlusIcon from "./svgs/PlusIcon";
import CommonInput from "./CommonInput";
import { getNestedError } from "../utils/common";

const InputWithDropdown = ({
  name,
  inputValue,
  inputLable = "",
  inputType = "text",
  onInputChange,
  selectedValue,
  onSelectChange,
  options,
  errors,
  inputExtraClass = "",
  selectBoxClass = "",
  dropdownClass = "",
  placeholder = "Enter text",
  isBpInput = false,
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

  const errorMessage = getNestedError(errors, name)?.message;

  const handleBpChange = (rawValue) => {
    // Only allow digits and one slash
    let cleaned = rawValue.replace(/[^0-9/]/g, "");

    // Allow only one slash and split
    const parts = cleaned.split("/").slice(0, 2);
    if (parts.length === 2) {
      // Check if both systolic and diastolic values are valid
      const [systolic, diastolic] = parts;
      if (systolic.length > 3 || diastolic.length > 3) return;
      cleaned = `${systolic}/${diastolic}`;
    } else {
      // If no slash yet, just limit the digits
      cleaned = parts[0].slice(0, 3);
    }

    onInputChange(cleaned);
  };

  return (
    <div>
      <div className="flex" ref={dropdownRef}>
        <CommonInput
          id={name}
          name={name}
          labelName={inputLable}
          value={inputValue}
          type={inputType}
          onChange={(value) => {
            if (isBpInput) {
              handleBpChange(value);
            } else {
              if (inputType === "number") {
                onInputChange(value === "" ? "" : +value);
              } else {
                onInputChange(value);
              }
            }
          }}
          placeholder={placeholder}
          extraClass={`rounded-r-none ${inputExtraClass}`}
        />

        {/* Dropdown Button */}
        <div className="h-10 flex relative">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className={`group z-10 bg-extra-light-blue border border-light-blue hover:border-blue duration-300 rounded-r-md px-4 py-2 flex items-center justify-between text-sm focus:outline-none focus:ring-1 focus:light-blue ${selectBoxClass}`}
          >
            <span>{selectedValue || "Select"}</span>
            <span
              className={cn(
                "duration-300 focus:rotate-45 absolute right-3 transform -translate-y-1/2 group-focus:rotate-45",
                "top-1/2"
              )}
            >
              <PlusIcon />
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
                    onSelectChange(opt.value);
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

      {errorMessage && (
        <p className="text-xs text-red-600 text-start ml-1 mt-0.5">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default InputWithDropdown;

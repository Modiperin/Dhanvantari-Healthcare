import { useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import CalanderIcon from "../assets/svg/calendar.svg?react";
import { Controller } from "react-hook-form";
import { getNestedError } from "../utils/common";
import { splitDate } from "../utils/dateAndTime";

const AntDatePicker = ({
  id,
  name,
  label = "Date",
  required = false,
  control,
  onChange: propOnChange = () => {},
  errors = {},
  disabled = false,
  placeholder = "DD/MM/YYYY",
}) => {
  const error = getNestedError(errors, name)?.message;
  const [localValue, setLocalValue] = useState(null);

  const commonClasses = `
  w-full
  ant-date-picker
  !h-10
  
  /* Input field */
  [&_.ant-picker-input>input]:!h-10
  [&_.ant-picker-input>input]:!text-blue
  [&_.ant-picker-suffix]:cursor-pointer
  
  /* Normal state */
  [&_.ant-picker]:border-light-blue
  [&_.ant-picker]:border
  
  /* Focus state */
  [&.ant-picker-focused]:!border-blue
  [&.ant-picker-focused]:!shadow-none
  [&.ant-picker-focused]:!outline-none
  
  /* Base styles */
  [&_.ant-picker]:rounded-lg
  [&_.ant-picker]:shadow-none
  [&_.ant-picker]:!border-light-blue
  focus:[&_.ant-picker]:shadow-none
  
  /* Calendar icon */
  [&_.ant-picker-suffix]:text-blue
  [&_.ant-picker-suffix]:transition-all
`;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="relative w-full text-blue max-h-14">
      {label && (
        <label
          htmlFor={id}
          className="absolute-label !z-10 text-sm !-top-2 bg-white mx-2 !text-blue"
        >
          {label}
          {required && <span>*</span>}
        </label>
      )}

      {control ? (
        // ✅ controlled RHF mode using `control `
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <DatePicker
              {...field}
              id={id}
              allowClear
              disabled={disabled}
              format={["D/M/YYYY", "DD/MM/YYYY"]}
              placeholder={placeholder}
              inputReadOnly={false}
              value={field.value ? dayjs(field.value, "D/M/YYYY") : null}
              onChange={(date, dateString) => {
                field.onChange(splitDate(dateString)); // updates RHF
                propOnChange?.(date, splitDate(dateString)); // for custom logic like setting age
              }}
              className={commonClasses}
              suffixIcon={
                <span className="ant-picker-suffix cursor-pointer">
                  <CalanderIcon className="w-4 h-4" />
                </span>
              }
              onKeyDown={handleKeyDown}
            />
          )}
        />
      ) : (
        // ✅ Controlled standalone version (non-RHF)
        <DatePicker
          id={id}
          format={["D/M/YYYY", "DD/MM/YYYY"]}
          allowClear
          disabled={disabled}
          placeholder={placeholder}
          inputReadOnly={false}
          value={localValue ? dayjs(localValue, "D/M/YYYY") : null}
          onChange={(date, dateString) => {
            setLocalValue(splitDate(dateString));
            propOnChange(date, splitDate(dateString));
          }}
          className={commonClasses}
          suffixIcon={
            <span className="ant-picker-suffix cursor-pointer">
              <CalanderIcon className="w-4 h-4" />
            </span>
          }
          onKeyDown={handleKeyDown}
        />
      )}

      {error && (
        <p className="text-xs text-red-600 text-start ml-1 mt-0.5">{error}</p>
      )}
    </div>
  );
};

export default AntDatePicker;

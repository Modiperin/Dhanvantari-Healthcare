import { useRef } from "react";
import CalanderIcon from "../assets/svg/calendar.svg?react";

const DateInput = ({
  id,
  name,
  label = "Date",
  required = false,
  register,
  onChange = () => {},
  errors = {},
  disable = false,
}) => {
  const inputRef = useRef(null);

  const openDatePicker = () => {
    if (!disable) {
      inputRef.current?.showPicker?.();
      inputRef.current?.focus();
    }
  };

  const error = errors[name];

  return (
    <div className={`relative w-full text-blue`}>
      <label
        htmlFor={id}
        className="absolute text-base -top-2 left-4 px-2 z-10 origin-[0] bg-white"
      >
        {label}
        {required && <span>*</span>}
      </label>

      <CalanderIcon
        className={`absolute top-1/2 right-3 transform -translate-y-1/2 ${
          disable ? "cursor-not-allowed" : "cursor-pointer"
        } duration-200 z-10 bg-white`}
        onClick={openDatePicker}
      />

      <div className="flex items-center rounded-lg">
        <input
          id={id}
          type="date"
          className={`max-h-12 custom-date-input block px-2.5 py-2 w-full text-sm
            bg-transparent rounded-lg border border-gray-300 focus:border-blue appearance-none 
            focus:outline-none focus:ring-0 peer ${
              disable ? "cursor-not-allowed" : "cursor-pointer"
            } 
            `}
          {...register(name, {
            required: required ? `${label} is required` : false,
          })}
          onChange={(e) => onChange(e)}
          ref={(e) => {
            register(name, {
              required: required ? `${label} is required` : false,
            }).ref(e);
            inputRef.current = e; // allow icon to trigger native picker
          }}
          disabled={disable}
        />
      </div>

      {error && (
        <p className="text-xs text-red-600 text-start ml-1 mt-0.5">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default DateInput;

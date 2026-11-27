import React from "react";
import DatePicker from "react-datepicker";
import CalanderIcon from "../assets/svg/calendar.svg?react";
import "react-datepicker/dist/react-datepicker.css";
import CommonInput from "./CommonInput";

const ReadOnlyInput = React.forwardRef(
  ({ value, onClick, placeholder }, ref) => (
    <div className="relative w-full">
      <CommonInput
        id={"date-picker-input"}
        labelName="Select Date"
        value={value}
        onClick={onClick}
        placeholder={placeholder}
        ref={ref}
        readOnly
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none">
        <CalanderIcon className="h-5 w-5" />
      </span>
    </div>
  )
);

const ReactDatePicker = ({
  selectedDate = null,
  onChange = () => {},
  outputFormat = "dd-MM-yyyy",
}) => {
  return (
    <div className=" w-full text-blue">
      <div>
        <DatePicker
          wrapperClassName="datePicker"
          selected={selectedDate}
          onChange={onChange}
          dateFormat={outputFormat}
          customInput={<ReadOnlyInput />}
          placeholderText="DD-MM-YYYY"
          className="!w-full !flex relative px-3 py-2 border border-light-blue rounded-md focus:outline-none"
          calendarClassName="!z-[9999]"
          popperContainer={({ children }) => (
            <div style={{ position: "absolute", zIndex: 9999 }}>{children}</div>
          )}
          popperPlacement="bottom-start"
          popperModifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 10],
              },
            },
            {
              name: "preventOverflow",
              options: {
                boundary: "clippingParents",
              },
            },
          ]}
          icon={<CalanderIcon className="h-12 w-12" />}
        />
      </div>
    </div>
  );
};

export default ReactDatePicker;

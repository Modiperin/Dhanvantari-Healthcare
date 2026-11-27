import { DatePicker, Space } from "antd";
// import dayjs from 'dayjs';
const { RangePicker } = DatePicker;
import SeperatIcon from "../assets/svg/seperator.svg?react";
import CalanderIcon from "../assets/svg/calendar.svg?react";

const DateRangeFilter = ({ handleDateSelection }) => {
  const handleChange = (dates, dateStrings) => {
    // console.log("Selected Dates:", dates); // dayjs objects
    // console.log("Formatted Strings:", dateStrings); // ["dd/mm/yyyy", "dd/mm/yyyy"]

    handleDateSelection(dateStrings);
  };

  return (
    <RangePicker
      format="DD/MM/YYYY"
      onChange={handleChange}
      className="!border !border-light-blue !h-10 !2xl:h-10 [&_.ant-picker-input>input]:!w-[85px] [&_.ant-picker-input>input]:!text-blue [&_.ant-picker-suffix]:cursor-pointer" // Tailwind override
      separator={<SeperatIcon />}
      suffixIcon={<CalanderIcon />}
    />
  );
};

export default DateRangeFilter;

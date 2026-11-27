import React from "react";

const SelectInput = ({
  label,
  id,
  name,
  required = false,
  options = [],
  value,
  onChange,
}) => {
  return (
    <div className="w-full">
      <div className="relative border  rounded-xl px-4 pt-5 pb-2 bg-white">
        <label
          htmlFor={id}
          className="absolute -top-2 left-4 bg-gray-50 px-1 text-[#0f3555] text-[17px] font-medium"
        >
          {label}
          {required && "*"}
        </label>
        <select
          id={id}
          name={name || id}
          required={required}
          value={value}
          onChange={onChange}
          className="w-full outline-none border-none bg-transparent text-[#0f3555] mt-1 text-[15px] appearance-none"
        >
          <option value="" disabled>
            Select {label}
          </option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectInput;

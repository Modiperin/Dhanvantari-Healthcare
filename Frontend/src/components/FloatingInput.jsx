import React from "react";

const FloatingInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  name,
}) => {
  return (
    <div className="w-full">
      <div className="relative border rounded-xl px-4 pt-5 pb-2">
        <label
          htmlFor={id}
          className="absolute -top-2 left-4 bg-gray-50 px-1 text-[#0f3555] text-[17px] font-medium"
        >
          {label}
          {required && "*"}
        </label>
        <input
          type={type}
          id={id}
          name={name || id}
          required={required}
          value={value}
          onChange={onChange}
          className="w-full outline-none border-none bg-transparent text-[#0f3555] mt-1 text-[15px]"
        />
      </div>
    </div>
  );
};

export default FloatingInput;

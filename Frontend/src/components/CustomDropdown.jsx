import { useRef, useState, useEffect } from "react";
import PlusIcon from "../assets/svg/plus.svg?react";
import CommonInput from "./CommonInput";

const CustomDropdown = ({
  name,
  labelName = "",
  value = "",
  onChange = () => {},
  options = [],
  placeholder = "",
  type = "text",
  errors,
  required = false,
  disabled = false,
}) => {
  const containerRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Sync input display value from external form value
  useEffect(() => {
    const selected = options.find((opt) => opt.value === value);
    setInputValue(selected?.name || "");
  }, [value, options]);

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (val) => {
    setInputValue(val);
    setShowDropdown(true);
    if (!val) {
      onChange(""); // clear selected value
    }
  };

  const handleSelect = (opt) => {
    onChange(opt.value); // update form value
    setInputValue(opt.name);
    setShowDropdown(false);
  };

  return (
    <div ref={containerRef} className="relative w-full text-blue min-h-[44px]">
      <CommonInput
        id={name}
        name={name}
        labelName={labelName}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        placeholder={placeholder}
        extraClass="w-full"
        type={type}
        errors={errors}
        required={required}
        disabled={disabled}
      />
      <PlusIcon
        className="absolute right-2 top-4 text-gray-400 cursor-pointer"
        onClick={() => setShowDropdown((prev) => !prev)}
      />
      {showDropdown && filteredOptions.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg text-sm flex flex-col gap-1 py-1 max-h-56">
          {filteredOptions.map((opt) => (
            <li
              key={opt.value}
              onClick={() => handleSelect(opt)}
              className="px-4 py-2 hover:bg-light-blue cursor-pointer"
            >
              {opt.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;

import { useRef, useState, useEffect } from "react";
import ArrowIcon from "../assets/svg/arrow-right.svg?react";
import CommonInput from "./CommonInput";

const SearchableDropdown = ({
  id,
  labelName = "",
  value = "",
  onChange = () => {},
  options = [],
  placeholder = "",
  type = "text",
}) => {
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [inputValue, setInputValue] = useState(value || "");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const selected = options.find((opt) => opt.value === value);
    setInputValue(selected ? selected.name : "");
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (opt) => {
    setInputValue(opt.name);
    onChange(opt);
    setShowDropdown(false);
  };

  return (
    <div ref={containerRef} className="relative w-full text-blue min-h-[44px]">
      <CommonInput
        ref={inputRef}
        id={id}
        labelName={labelName}
        value={inputValue}
        onChange={(val) => {
          setInputValue(val);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder={placeholder}
        extraClass="w-full"
        type={type}
      />
      <ArrowIcon
        className="absolute right-2 top-4 text-gray-400 cursor-pointer"
        onClick={() => setShowDropdown((prev) => !prev)}
      />
      {showDropdown && filteredOptions.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg text-xs lg:text-sm flex gap-1 flex-col py-1">
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

export default SearchableDropdown;

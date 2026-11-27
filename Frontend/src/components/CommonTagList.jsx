import { useRef, useState, useEffect } from "react";
import { useController } from "react-hook-form";
import ArrowIcon from "../assets/svg/arrow-right.svg?react";
import PlusIcon from "../assets/svg/plus.svg?react";
import { cn } from "../lib/utils";

const TagListInput = ({
  id,
  name,
  control,
  labelName = "",
  options = [],
  maxTags = 5,
  defaultValue = [],
  rules = {},
}) => {
  const {
    field: { value = [], onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
  });

  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const filteredOptions = options.filter(
    (opt) =>
      opt.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(opt)
  );

  const addTag = (tag) => {
    if (!tag || value.includes(tag) || value.length >= maxTags) return;
    onChange([...value, tag]);
    setInputValue("");
    setShowDropdown(false);
  };

  const removeTag = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setShowDropdown(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const shouldFloat = isFocused || inputValue.length > 0 || value.length > 0;

  return (
    <div ref={containerRef} className="relative w-full text-blue">
      <div
        className={cn(
          "flex flex-nowrap px-2.5 py-2 items-center gap-2 border rounded-lg bg-white overflow-x-scroll transition-all",
          isFocused ? "border-blue" : "border-light-blue"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag, index) => (
          <div
            key={index}
            className="text-nowrap bg-blue-100 text-blue px-3 rounded-full text-sm flex items-center gap-2 h-6"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-blue-500 hover:text-blue-700 cursor-pointer"
            >
              ×
            </button>
          </div>
        ))}

        <input
          ref={inputRef}
          id={id}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setShowDropdown(true);
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          placeholder=" "
          className="p-2 block w-full px-2 mt-0 bg-transparent outline-none focus:ring-0 text-sm"
        />

        <ArrowIcon
          className="ml-auto text-gray-400 cursor-pointer"
          onClick={() => setShowDropdown((prev) => !prev)}
        />
      </div>

      {/* Floating Label */}
      {labelName && (
        <label
          htmlFor={id}
          className={cn(
            "absolute left-3 px-1 text-sm text-gray-500 bg-white transition-all",
            "pointer-events-none",
            shouldFloat ? "top-0 -translate-y-2 text-blue" : "top-3.5"
          )}
        >
          {labelName}
        </label>
      )}

      {/* Dropdown */}
      {showDropdown && filteredOptions.length > 0 && value.length < maxTags && (
        <ul className="absolute mt-1 w-full h-auto overflow-y-scroll max-h-40 rounded-md border-gray-200 bg-white shadow-lg text-sm z-50 flex flex-col p-2 border">
          {filteredOptions.map((opt) => (
            <li
              key={opt}
              onClick={() => addTag(opt)}
              className="cursor-pointer hover:bg-blue-100 px-2 py-1 rounded"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}

      {/* Plus Icon */}
      <PlusIcon
        className="absolute right-3 top-3.5 cursor-pointer"
        onClick={() => addTag(inputValue.trim())}
      />

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-600 text-start ml-1 mt-0.5">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default TagListInput;

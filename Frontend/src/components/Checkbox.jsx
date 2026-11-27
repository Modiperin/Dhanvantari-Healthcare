import { cn } from "../lib/utils";

const CheckBox = ({
  checked = false,
  label = "",
  _class = "",
  handleChecked = () => {},
  disabled = false,
}) => {
  const handleCheckboxChange = () => {
    handleChecked();
  };

  return (
    <label
      className={cn(
        _class,
        "inline-flex cursor-pointer px-2 py-2",
        disabled && "opacity-60"
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
        className="peer hidden"
      />
      <div
        className={cn(
          `w-5 h-5 flex items-center justify-center rounded-md border 
           bg-white transition 
          peer-checked:bg-blue-50 peer-checked:border-blue-400
        `,
          disabled ? "border-light-blue" : "border-blue"
        )}
      >
        {/* Check icon */}
        <svg
          className={`w-3 h-3 text-blue-900 transition-opacity duration-200 ${
            checked ? "opacity-100" : "opacity-0"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      {label && <span>{label}</span>}
    </label>
  );
};

export default CheckBox;

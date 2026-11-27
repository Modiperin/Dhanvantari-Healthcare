import { cn } from "../lib/utils";

const CheckboxWithLabel = ({
  label,
  checked,
  onChange,
  className = "",
  inputClass = "",
  ...props
}) => (
  <label
    className={cn(
      className,
      "inline-flex items-center gap-2 cursor-pointer px-2 py-2"
    )}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={`peer sr-only ${inputClass}`}
      {...props}
    />
    <div
      className={`
            w-5 h-5 flex items-center justify-center rounded-md border 
            border-blue-100 bg-white transition 
            peer-checked:bg-blue-50 peer-checked:border-blue-400
          `}
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    {label && <span>{label}</span>}
  </label>
);

export default CheckboxWithLabel;

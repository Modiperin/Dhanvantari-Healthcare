import { cn } from "../lib/utils";
import CloseIcon from "../assets/svg/close-square.svg?react";
import AddIcon from "../assets/svg/receipt-add.svg?react";

const Alert = ({
  title,
  type,
  className = "",
  showClear = false,
  showAdd = false,
  clearFn,
  addFn,
}) => {
  // Define base classes
  const baseClasses =
    "border text-xs rounded-lg px-4 py-2 flex w-full justify-between";

  // Define type-specific classes
  const typeClasses = {
    dark: "bg-gray-100 border-gray-200 text-gray-700",
    secondary: "bg-gray-50 border-gray-200 text-gray-700",
    info: "bg-blue-100 border-blue-200 text-blue-700",
    success: "bg-teal-100 border-teal-200 text-teal-700",
    danger: "bg-red-100 border-red-200 text-red-700",
    warning: "bg-yellow-100 border-yellow-200 text-yellow-700",
    light: "bg-white/10 border-white/10 text-blue border-light-blue",
  };

  // Generate ID for accessibility
  const id = `hs-soft-color-${type}-label`;

  // Combine classes using cn (you can replace with your preferred utility)
  const classes = cn(baseClasses, typeClasses[type], className);

  return (
    <div className={classes} role="alert" tabIndex={-1} aria-labelledby={id}>
      <p id={id} className="flex items-center gap-2">
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {title}
      </p>
      <div className="text-blue flex gap-4">
        {showClear && (
          <span
            className="flex gap-1 cursor-pointer items-center"
            onClick={() => clearFn?.()}
          >
            <CloseIcon className="h-4 w-4" />
            Clear
          </span>
        )}
        {showAdd && (
          <span
            className="flex gap-1 cursor-pointer items-center"
            onClick={() => addFn?.()}
          >
            <AddIcon className="h-4 w-4" />
            Settle Up
          </span>
        )}
      </div>
    </div>
  );
};

export default Alert;

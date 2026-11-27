import { cn } from "../../lib/utils";

const VARIANT_CLASSES = {
  light:
    "text-blue bg-light-blue/50 hover:bg-light-blue border border-light-blue",
  dark: "bg-blue text-white hover:bg-blue/90",
};

export default function Button({
  children,
  onClick = () => {},
  type = "button",
  className = "",
  disabled = false,
  variant = "dark", // default to dark
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "cursor-pointer focus:ring-1 focus:outline-none font-medium rounded-lg px-3.5 lg:px-5 py-1.5 lg:py-2.5 text-center inline-flex items-center justify-center text-[10px] lg:text-xs h-10",
        VARIANT_CLASSES[variant] || VARIANT_CLASSES.dark,
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
    >
      {children}
    </button>
  );
}

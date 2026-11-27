import { cn } from "../lib/utils";
import Spinner from "./Spinner";

const IconButton = ({
  name = null,
  selected = false,
  className = "",
  children = null,
  onclick = () => {},
  type = "button",
  isLoading = false,
  isSquare = false,
}) => {
  return (
    <button
      type={type}
      title={name}
      onClick={onclick}
      className={cn(
        "flex items-center justify-center cursor-pointer shadow-sm gap-1",
        selected
          ? "bg-blue text-white border-blue-border"
          : "bg-secondary-light-blue text-blue border-blue-border",
        name
          ? "border px-5 text-xs min-w-[88px] h-[38px] text-nowrap"
          : "border-0",
        isSquare ? "rounded-lg" : "rounded-full",
        className
      )}
    >
      {children && <span className="flex items-center"> {children}</span>}
      {name && name}
      {isLoading && <Spinner border="border-blue-border" />}
    </button>
  );
};

export default IconButton;

import TooltipWrapper from "../../../components/ReactTooltip";
import { cn } from "../../../lib/utils";

const SliderButton = ({
  id,
  label: name,
  icon: Icon,
  isActive,
  navigateSidebar,
  to = "",
  isCollapsed,
  className = "",
  onClick = () => {},
}) => {
  let btnClass = "";

  if (isCollapsed) {
    if (isActive === id) {
      btnClass = "!bg-[#175e9e] justify-center";
    } else {
      // btnClass = "bg-[rgba(23,94,158,0.2)] hover:bg-[#175e9e] justify-center";
      btnClass = "hover:bg-[#175e9e] justify-center";
    }
  } else {
    // btnClass = isActive === id ? "bg-img-active" : "bg-img";
    btnClass =
      isActive === id ? "bg-[#175e9e]" : "hover:bg-[#175e9e] hover:scale-101";
  }

  return (
    <TooltipWrapper content={name} place="right" visible={isCollapsed}>
      <div className={cn(className, "rounded-lg p-0.5")}>
        <button
          className={cn(
            `p-2 lg:p-3 text-white cursor-pointer w-full rounded-md flex justify-between items-center transition-all duration-200 bg-blue`,
            btnClass,
            id === "ai-chat" &&
              "custom-gradient bg-[#114A7D] hover:bg-[#114A7D]"
          )}
          onClick={() => navigateSidebar(to, id, onClick)}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5 lg:w-auto lg:h-auto" />}
            {!isCollapsed && <span className="whitespace-nowrap">{name}</span>}
          </div>
          {/* {!isCollapsed && <ArrowIcon className="w-4 h-4" />} */}
        </button>
      </div>
    </TooltipWrapper>
  );
};

export default SliderButton;

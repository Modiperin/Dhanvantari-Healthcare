import TooltipWrapper from "./ReactTooltip";
import EyeIcon from "./svgs/EyeIcon";

const ViewOnly = ({
  tooltipContent = "Your current access allows you to view details only. For modification rights, reach out to your administrator.",
}) => (
  <TooltipWrapper
    id={"view-only-tooltip"}
    content={tooltipContent}
    place="left"
  >
    <div className="flex items-center px-4 py-1 border border-amber-200 rounded-lg text-amber-800 text-sm font-medium cursor-help transition-all duration-200  hover:border-amber-300 hover:shadow-sm">
      <EyeIcon color="oklch(47.3% 0.137 46.201)" />
      <span>View Only</span>
    </div>
  </TooltipWrapper>
);

export default ViewOnly;

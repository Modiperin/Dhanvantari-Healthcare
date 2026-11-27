import { cn } from "../lib/utils";
import TooltipWrapper from "./ReactTooltip";

const getTrimmedPreview = (str, maxLength, spitStringWise) => {
  if (str?.length <= maxLength) return str;

  if (spitStringWise) {
    // Word-wise trimming
    const words = str.split(" ");
    let result = "";
    for (let word of words) {
      if ((result + (result ? " " : "") + word).length > maxLength) break;
      result += (result ? " " : "") + word;
    }
    return result.trim();
  } else {
    // Character-wise trimming
    return str.slice(0, maxLength).trim();
  }
};

const LongDesc = ({ _class, str, length = 30, spitStringWise = true }) => {
  const preview = getTrimmedPreview(str, length, spitStringWise);

  return (
    <div
      className={cn(_class, "cursor-pointer relative scrollbar-hide text-blue")}
    >
      {str.length <= length ? (
        str
      ) : (
        <TooltipWrapper id={"long-desc-tooltip"} content={str} place="top">
          {preview}...
        </TooltipWrapper>
      )}
    </div>
  );
};

export default LongDesc;

import { useRef, useEffect, useState } from "react";
import { cn } from "../lib/utils";
import AccordionToggleIcon from "../features/administration/components/AccordionToggleIcon";

const CommonAccordionItem = ({
  id,
  headerContent,
  bodyContent,
  isOpen = false,
  onClick,
  actionMenu,
  headerClassName,
  bodyClassName,
  headerColor,
  headerBorderColor,
}) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [isOpen]);

  return (
    <div id={`heading-${id}`}>
      {/* Header Section */}
      <div
        className={cn(
          "accordion-toggle group inline-flex items-center justify-between px-5 w-full transition duration-300 cursor-pointer border-2 border-light-blue rounded-lg",
          headerClassName
        )}
        onClick={onClick}
        aria-controls={`collapse-${id}`}
        aria-expanded={isOpen}
        style={{
          backgroundColor: `${headerColor || "transparent"}`,
          border: `1px solid ${headerBorderColor || headerColor}`,
        }}
      >
        <div className="py-4 text-blue font-medium w-full">{headerContent}</div>

        <div className="flex items-center gap-2">
          {actionMenu && (
            <div onClick={(e) => e.stopPropagation()}>{actionMenu}</div>
          )}
          <AccordionToggleIcon isOpen={isOpen} />
        </div>
      </div>

      {/* Body Section */}
      <div
        id={`collapse-${id}`}
        ref={contentRef}
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out transform border border-t-0 rounded-b-lg border-light-blue -mt-0.5",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1",
          bodyClassName
        )}
        style={{ maxHeight: height }}
        aria-labelledby={`heading-${id}`}
      >
        {bodyContent}
      </div>
    </div>
  );
};

export default CommonAccordionItem;

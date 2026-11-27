import React, { useEffect, useState } from "react";
import Button from "./Button";
import ResetIcon from "../svgs/ResetIcon";
import TooltipWrapper from "../ReactTooltip";
import useCooldown from "../../hooks/useCooldown";

const rotateStyle = {
  animation: "rotate 1s linear infinite",
};

const RefreshButton = ({
  onClick,
  loading = false,
  cooldown = 2000,
  disabled = false,
  icon: Icon,
  className = "",
  variant = "light",
  content = "Refresh",
  fullWidth = false, // <-- new prop
  ...rest
}) => {
  const [isRotating, setIsRotating] = useState(false);
  const [refreshCooldown, triggerRefreshCooldown] = useCooldown(cooldown);

  const handleClick = (e) => {
    triggerRefreshCooldown();
    if (onClick) onClick(e);
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), cooldown);
  };

  useEffect(() => {
    if (loading) {
      setIsRotating(true);
    } else {
      setIsRotating(false);
    }
  }, [loading]);

  // Classes for bigger version
  const bigClasses = "w-full py-4 text-sm gap-2";
  const iconSize = fullWidth ? "h-8 w-8" : "h-6 w-6";

  return (
    <TooltipWrapper id="reset-toggle" content={content}>
      <Button
        type="button"
        variant={variant}
        className={`border border-light-blue items-center rounded-md hover:bg-light-blue p-3 cursor-pointer ${className} ${
          fullWidth ? bigClasses : ""
        }`}
        onClick={handleClick}
        disabled={disabled || loading || refreshCooldown}
        {...rest}
      >
        <span style={isRotating || refreshCooldown ? rotateStyle : {}}>
          <ResetIcon className={iconSize} />
        </span>
        {fullWidth && <span className="ml-2">{content}</span>}
      </Button>
    </TooltipWrapper>
  );
};

export default RefreshButton;

import React from "react";
import Button from "./Button";
import ResetIcon from "../svgs/ResetIcon";

const ResetButton = ({
  name,
  onClick = () => {},
  disabled = false,
  className = "",
  iconVisible = true,
}) => {
  return (
    <Button
      variant="light"
      disabled={disabled}
      onClick={(e) => {
        onClick(e);
      }}
      className={className}
    >
      {iconVisible && (
        <div className="mr-2">
          <ResetIcon />
        </div>
      )}
      {name ? name : "Reset"}
    </Button>
  );
};

export default ResetButton;

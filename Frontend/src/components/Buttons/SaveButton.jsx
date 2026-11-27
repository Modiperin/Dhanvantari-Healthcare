import React from "react";
import Button from "./Button";
import SaveIcon from "../svgs/SaveIcon";
import Spinner from "../Spinner";

const SaveButton = ({
  name,
  onClick = () => {},
  isLoading = false,
  type = "button",
  variant = "dark",
  className,
  disabled = false,
}) => {
  return (
    <Button
      variant={variant}
      onClick={(e) => onClick(e)}
      className={className}
      type={type}
      disabled={disabled ? disabled : isLoading}
    >
      {isLoading ? (
        <Spinner border="white" />
      ) : (
        <>
          <div className="mr-2">
            <SaveIcon />
          </div>
          {name ? name : "Save"}
        </>
      )}
    </Button>
  );
};

export default SaveButton;

import React from "react";
import Button from "./Button";
import useNavigateTo from "../../hooks/useNavigateTo";
import PlusIcon from "../../assets/svg/plus.svg?react";

const CancelButton = ({ name, to, onClick }) => {
  const goTo = useNavigateTo();
  return (
    <Button
      variant="light"
      onClick={(e) => {
        onClick ? onClick(e) : goTo(to ? to : -1);
      }}
      className="h-10 w-25"
    >
      <div className="rotate-45 -mr-1">
        <PlusIcon className="h-8 w-8" />
      </div>
      <span className="ml-1">{name ? name : "Cancel"}</span>
    </Button>
  );
};

export default CancelButton;

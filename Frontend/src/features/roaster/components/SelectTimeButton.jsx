import React from "react";

function SelectTimeButton({ onClick, isViewOnly = false }) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-50 hover:bg-blue-100 cursor-pointer text-blue text-xs rounded-full px-2 py-1 w-full  disabled:cursor-not-allowed"
      disabled={isViewOnly}
    >
      + Select
    </button>
  );
}

export default SelectTimeButton;

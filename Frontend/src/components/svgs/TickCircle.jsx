import React from "react";

const TickCircle = ({ color = "#0F3E69",className="" }) => {
  return (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7.99967 15.0421C11.6663 15.0421 14.6663 12.0421 14.6663 8.37541C14.6663 4.70874 11.6663 1.70874 7.99967 1.70874C4.33301 1.70874 1.33301 4.70874 1.33301 8.37541C1.33301 12.0421 4.33301 15.0421 7.99967 15.0421Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.16699 8.37544L7.05366 10.2621L10.8337 6.48877"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default TickCircle;

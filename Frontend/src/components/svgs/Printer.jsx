import React from "react";

const Printer = ({color="#0F3E69"}) => {
  return (
    <svg
      width="16"
      height="19"
      viewBox="0 0 16 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.83398 5.625H11.1673V4.125C11.1673 2.625 10.6673 1.875 9.16732 1.875H6.83398C5.33398 1.875 4.83398 2.625 4.83398 4.125V5.625Z"
        stroke={color}
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.6673 11.625V14.625C10.6673 16.125 10.0007 16.875 8.66732 16.875H7.33398C6.00065 16.875 5.33398 16.125 5.33398 14.625V11.625H10.6673Z"
        stroke={color}
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14 7.875V11.625C14 13.125 13.3333 13.875 12 13.875H10.6667V11.625H5.33333V13.875H4C2.66667 13.875 2 13.125 2 11.625V7.875C2 6.375 2.66667 5.625 4 5.625H12C13.3333 5.625 14 6.375 14 7.875Z"
        stroke={color}
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11.3327 11.625H10.526H4.66602"
        stroke={color}
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M4.66602 8.625H6.66602"
        stroke={color}
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default Printer;

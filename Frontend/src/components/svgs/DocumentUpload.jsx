import React from "react";

const DocumentUpload = ({ color = "#0F3E69" }) => {
  return (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.99984 11.709V7.70898L4.6665 9.04232"
        stroke={color}
        strokeLinejoin="round"
      />
      <path
        d="M6 7.70898L7.33333 9.04232"
        stroke={color}
        strokeLinejoin="round"
      />
      <path
        d="M14.6668 7.04232V10.3757C14.6668 13.709 13.3335 15.0423 10.0002 15.0423H6.00016C2.66683 15.0423 1.3335 13.709 1.3335 10.3757V6.37565C1.3335 3.04232 2.66683 1.70898 6.00016 1.70898H9.3335"
        stroke={color}
        strokeLinejoin="round"
      />
      <path
        d="M14.6668 7.04232H12.0002C10.0002 7.04232 9.3335 6.37565 9.3335 4.37565V1.70898L14.6668 7.04232Z"
        stroke={color}
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DocumentUpload;

const FemaleIcon = ({ color = "#0F3E69" }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0156 16C15.8816 16 19.0156 12.866 19.0156 9C19.0156 5.13401 15.8816 2 12.0156 2C8.14963 2 5.01562 5.13401 5.01562 9C5.01562 12.866 8.14963 16 12.0156 16Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.0156 16V22"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.0156 19H9.01562"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FemaleIcon;

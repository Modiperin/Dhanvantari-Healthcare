const ResetIcon = ({ color = "#0F3E69" }) => {
  return (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.3825 8.37484C14.3825 11.9016 11.5286 14.7555 8.00179 14.7555C4.47501 14.7555 2.32875 11.2055 2.32875 11.2055M2.32875 11.2055H5.20588M2.32875 11.2055V14.3959M1.62109 8.37484C1.62109 4.84805 4.4518 1.99414 8.00179 1.99414C12.2595 1.99414 14.3825 5.54413 14.3825 5.54413M14.3825 5.54413V2.35378M14.3825 5.54413H11.5518"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ResetIcon;

const ModifyIcon = ({ color = "#0F3E69" }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.8703 10.1699L19.2103 8.74993C20.6303 7.24993 21.2703 5.53993 19.0603 3.44993C16.8503 1.36993 15.1803 2.09993 13.7603 3.59993L5.55034 12.2899C5.24034 12.6199 4.94034 13.2699 4.88034 13.7199L4.51034 16.9599C4.38034 18.1299 5.22034 18.9299 6.38034 18.7299L9.60034 18.1799C10.0503 18.0999 10.6803 17.7699 10.9903 17.4299L14.9403 13.2499"
        stroke={color}
        stroke-width="1.5"
        stroke-miterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.3896 5.05005C12.8196 7.81005 15.0596 9.92005 17.8396 10.2"
        stroke={color}
        stroke-width="1.5"
        stroke-miterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 22H14.5"
        stroke={color}
        stroke-width="1.5"
        stroke-miterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 22H21.5"
        stroke={color}
        stroke-width="1.5"
        stroke-miterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ModifyIcon;

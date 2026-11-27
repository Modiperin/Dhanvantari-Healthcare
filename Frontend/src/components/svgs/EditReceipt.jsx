const EditReceipt = ({ color = "#0F3E69" }) => {
  return (
    <svg
      width="18"
      height="19"
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.375 8.84999V5.65501C15.375 2.63251 14.67 1.875 11.835 1.875H6.165C3.33 1.875 2.625 2.63251 2.625 5.65501V14.1C2.625 16.095 3.72001 16.5675 5.04751 15.1425L5.05499 15.135C5.66999 14.4825 6.60749 14.535 7.13999 15.2475L7.8975 16.26"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 5.625H12"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 8.625H11.25"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.6583 11.4532L11.0033 14.1082C10.8983 14.2132 10.8008 14.4082 10.7783 14.5507L10.6358 15.5632C10.5833 15.9307 10.8383 16.1857 11.2058 16.1332L12.2183 15.9907C12.3608 15.9682 12.5633 15.8707 12.6608 15.7657L15.3158 13.1107C15.7733 12.6532 15.9908 12.1207 15.3158 11.4457C14.6483 10.7782 14.1158 10.9957 13.6583 11.4532Z"
        stroke={color}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.2734 11.8359C13.4984 12.6459 14.1284 13.2759 14.9384 13.5009"
        stroke={color}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default EditReceipt;

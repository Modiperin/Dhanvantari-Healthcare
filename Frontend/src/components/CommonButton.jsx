
const CommonButton = ({ title }) => {
    return (
        <button className="flex items-center gap-2 text-[16px] bg-gradient-to-r from-[#175E9E] to-[#0F3E69] text-white py-3.5 px-5 rounded-md">
            {title}
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.88025 3.59649L11.7702 8.48649C12.3477 9.06399 12.3477 10.009 11.7702 10.5865L6.88025 15.4765" stroke="white" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    )
}

export default CommonButton
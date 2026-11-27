import { useState } from "react";
import Eye from "../assets/svg/eye.svg?react";
import EyeOff from "../assets/svg/eye-off.svg?react";
import CommonInput from "./CommonInput";

const PasswordInput = (props) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative w-full">
      <CommonInput {...props} type={show ? "text" : "password"} />
      <span
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="absolute right-3 top-5 transform -translate-y-1/2 text-gray-500 cursor-pointer"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </span>
    </div>
  );
};

export default PasswordInput;

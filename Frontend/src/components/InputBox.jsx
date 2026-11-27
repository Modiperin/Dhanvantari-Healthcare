import { useState } from "react";
import Eye from "../assets/svg/eye.svg?react";
import EyeOff from "../assets/svg/eye-off.svg?react";

export default function InputBox({
  value,
  onChange,
  name = "",
  placeholder = "",
  labelName = "",
  className = "",
  type = "text",
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative w-full">
      <label className="absolute left-3 -top-3 px-1 text-base bg-white text-blue z-10">
        {labelName}
      </label>
      <input
        type={inputType}
        value={value}
        name={name}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 pt-4 pb-2 text-lg border-[1px] rounded-[6px] border-primary outline-none ${className}`}
      />
      {isPassword && (
        <div
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </div>
      )}
    </div>
  );
}

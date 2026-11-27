import { useState } from "react";
import ArrowRightIcon from "../../../assets/svg/arrow-right.svg?react";
import { callAPI } from "@/services/callAPI";
import { setAuthCookies } from "@/services/cookies";
import useNavigateTo from "@/hooks/useNavigateTo";
import { mapFieldErrors } from "@/utils/error";
import FieldError from "@/components/FieldError";
import OtpTimer from "./OtpTimer";
import { ROUTES } from "../../../routes/helper";
import Spinner from "../../../components/Spinner";
import InputBox from "../../../components/InputBox";
import { useDispatch } from "react-redux";
import { fetchUserSettings } from "../../../slices/userSlice";
import Button from "../../../components/Buttons/Button";

export default function LoginForm() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
    errors: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const redirectTo = useNavigateTo();
  const [step, setStep] = useState("LOGIN"); // "LOGIN" or "OTP"
  const [otpData, setOtpData] = useState({});

  const afterLoginEffects = (data) => {
    setAuthCookies(data);
    const redirectUrl =
      data?.role === "O" ? "/admin/onboard" : ROUTES.DASHBOARD;
    dispatch(fetchUserSettings()).then(() => redirectTo(redirectUrl));
  };

  const handleInputChange = (field) => (value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      errors: {
        ...prev.errors,
        [field]: null,
        general: null,
      },
    }));
  };

  const handleOTPDataChange = (value) => {
    setOtpData((prev) => ({
      ...prev,
      otp: value,
    }));

    setFormData((prev) => ({
      ...prev,
      errors: {
        ...prev.errors,
        otp: null,
      },
    }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      rememberMe: e.target.checked,
    }));
  };

  const handleLogin = async () => {
    setIsLoading(true);

    const response = await callAPI("/auth/login", {
      method: "POST",
      data: {
        email: formData.email,
        password: formData.password,
      },
      suppressError: true,
    });

    setIsLoading(false);

    if (!response.error) {
      if (response.data.step === "OTP") {
        setStep("OTP");
        setOtpData((prev) => ({
          ...prev,
          id: response.data.id || "",
        }));
        return;
      }

      afterLoginEffects({
        token: response.data.token,
        role: response.data?.role || "",
      });
    } else {
      const errors = mapFieldErrors(response);
      setFormData((prev) => ({
        ...prev,
        errors,
      }));
    }
  };

  const handleOtpSubmit = async () => {
    const response = await callAPI("/auth/verify-otp", {
      method: "POST",
      data: otpData, // {id,otp}
      suppressError: true,
    });

    setIsLoading(false);

    if (!response.error) {
      afterLoginEffects({ token: response.data.token });
    } else {
      setFormData((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          otp: "Invalid OTP. Please try again.",
        },
      }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (step === "LOGIN") {
      handleLogin();
    } else {
      handleOtpSubmit();
    }
  };

  return (
    <div className="mt-16 flex flex-col max-w-[80%] relative z-5">
      <h1 className="text-4xl text-blue mb-2">Welcome back!</h1>
      <p className="text-blue">
        {step === "LOGIN"
          ? "Login to your account to continue"
          : "Enter the OTP sent to your email"}
      </p>
      <form className="py-16 space-y-8" onSubmit={handleFormSubmit}>
        {step === "LOGIN" ? (
          <>
            <div>
              <InputBox
                name="email"
                labelName="User Id*"
                className="h-[56px]"
                onChange={handleInputChange("email")}
              />
              <FieldError message={formData.errors?.email} />
              <FieldError message={formData.errors?.general} />
            </div>
            <div>
              <InputBox
                name="password"
                type="password"
                labelName="Enter Password*"
                className="h-[56px]"
                onChange={handleInputChange("password")}
              />
              <FieldError message={formData.errors?.password} />
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="remember"
                type="checkbox"
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blue accent-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="remember" className="text-base text-gray-700">
                Remember me
              </label>
            </div>
            <div className="flex items-center">
              <Button type="submit" className="min-h-[56px] min-w-[120px] mr-4">
                Login
                <ArrowRightIcon />
              </Button>
              {isLoading ? <Spinner /> : null}
            </div>
          </>
        ) : (
          <>
            <div>
              <InputBox
                name="otp"
                labelName="Enter OTP*"
                className="h-[56px] appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                type="number"
                onChange={handleOTPDataChange}
                key="otp-input"
              />

              <FieldError message={formData.errors?.otp} />
            </div>

            <OtpTimer />

            <div className="flex items-center">
              <Button type="submit" className="min-h-[56px] min-w-[120px] mr-4">
                Verify OTP
                <ArrowRightIcon />
              </Button>
              {isLoading ? <Spinner /> : null}
            </div>
          </>
        )}
      </form>
    </div>
  );
}

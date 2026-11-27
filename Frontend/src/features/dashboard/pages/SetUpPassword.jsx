import CommonInput from "../../../components/CommonInput";
import { useForm } from "react-hook-form";
import PasswordInput from "../../../components/PasswordInput";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { removeDataFromCookies } from "../../../services/cookies";
import { useDispatch, useSelector } from "react-redux";
import {
  setUpPassword,
  verifyToken,
} from "../../../slices/hospitalOnboardingSlice";
import { apiResponseType } from "../../../utils/types";
import Spinner from "../../../components/Spinner";
import { setUpPasswordSchema } from "../../../features/dashboard/components/hospital-onboarding/validations/setUpPassword";
import { ROUTES } from "../../../routes/helper";
import Button from "../../../components/Buttons/Button";

const SetUpPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // console.log({ token });
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(setUpPasswordSchema),
  });
  const { register, handleSubmit, formState, setValue } = form;
  const { errors } = formState;
  const { setUpPasswordApi, verifyTokenApi } = useSelector(
    (state) => state.hospitalOnboarding
  );
  const { status, data, error, isLoading } = setUpPasswordApi;
  const {
    status: verifyTokenStatus,
    data: verifyTokenData,
    error: verifyTokenError,
  } = verifyTokenApi;

  const onSubmit = async (data) => {
    // console.log("form submitted", data);
    dispatch(setUpPassword({ ...data, token }));
  };

  useEffect(() => {
    if (token) {
      dispatch(verifyToken(token));
    }
  }, [token]);

  useEffect(() => {
    let toastId;
    if (verifyTokenStatus === apiResponseType.pending) {
      toastId = toast.loading("Verifying token...");
    } else if (verifyTokenStatus === apiResponseType.success) {
      toast.dismiss(toastId);
      // toast.success(verifyTokenData.message);
      setValue("email", verifyTokenData.data.email);
    } else if (verifyTokenStatus === apiResponseType.failed) {
      toast.dismiss(toastId);
      verifyTokenError.map((error) => {
        toast.error(error.message);
      });
      navigate(ROUTES.LOGIN);
      window.history();
    }
  }, [verifyTokenStatus]);

  useEffect(() => {
    if (status === apiResponseType.success) {
      toast.success(data.message);
      removeDataFromCookies(["token", "hospitalToken"]);
      navigate(ROUTES.LOGIN);
    } else if (status === apiResponseType.failed) {
      error.map((error) => {
        toast.error(error.message);
      });
      navigate(ROUTES.LOGIN);
    }
  }, [status]);

  return (
    <section className="min-h-screen flex flex-col gap-5 p-10 w-[90%] lg:w-[75%] mx-auto justify-center bg-white">
      <h2 className="text-2xl font-medium text-blue">Setup Password</h2>
      <div className="flex flex-col">
        <p className="text-xl">
          Your primary emailId is{" "}
          <span className="text-blue-500">{verifyTokenData?.data?.email}</span>,
          Now you should setup your email and password.
        </p>
        <p className="text-gray-600 text-base">
          Although, if you don't want to change email that also fine.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-3"
      >
        <CommonInput
          labelName="Primary Email Id"
          id="email"
          name="email"
          register={register}
          errors={errors}
          disabled={true}
        />
        <PasswordInput
          labelName="Password"
          id="password"
          name="password"
          register={register}
          errors={errors}
          type="password"
        />
        <PasswordInput
          labelName="Confirm Password"
          id="confirmPassword"
          name="confirmPassword"
          register={register}
          errors={errors}
          type="password"
        />
        <div className={`flex items-center justify-end gap-5 w-full`}>
          <Button type="submit">
            <span>Submit</span>
            {isLoading && <Spinner />}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default SetUpPassword;

import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "./Modal";
import PasswordInput from "./PasswordInput";
import { resetPasswordSchema } from "../features/administration/validations/resetPassword";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, resetResetPasswordStatus } from "../slices/userSlice";
import useApiResponseHandler from "../hooks/useApiResponseHandler";
import CancelButton from "./Buttons/CancelButton";
import SaveButton from "./Buttons/SaveButton";

const defaultValues = {
  password: "",
  confirmPassword: "",
  superAdminPassword: "",
};

const ResetPasswordModal = ({ open = "", onClose }) => {
  const form = useForm({
    defaultValues,
    resolver: zodResolver(resetPasswordSchema),
  });
  const { register, handleSubmit, formState, reset, setError } = form;
  const { errors } = formState;
  const dispatch = useDispatch();
  const { resetPasswordApi } = useSelector((state) => state.user);
  const { status, data, error, isLoading } = resetPasswordApi;

  const onSubmit = async (data) => {
    // console.log("form submitted", data);
    if (open) {
      dispatch(resetPassword({ ...data, staffId: open }));
    }
  };

  const handleClose = () => {
    dispatch(resetResetPasswordStatus());
    reset(defaultValues);
    onClose();
  };

  useApiResponseHandler({
    status,
    data,
    error,
    resetForm: () => reset(defaultValues),
    resetReduxStatus: () => dispatch(resetResetPasswordStatus()),
    setFormError: setError,
    sideAction: handleClose,
  });

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title={<span className="text-blue text-xl">Reset Password</span>}
      contentClassName="min-w-[650px] max-h-[85vh] overflow-y-auto"
      className="bg-white rounded-md py-4"
      showClose
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-5"
      >
        <PasswordInput
          labelName="New Password"
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
        <PasswordInput
          labelName="Super Admin Password"
          id="superAdminPassword"
          name="superAdminPassword"
          register={register}
          errors={errors}
          type="password"
        />
        <div className="flex gap-5 items-center justify-end w-full">
          <CancelButton onClick={handleClose} />
          <SaveButton isLoading={isLoading} type="submit" />
        </div>
      </form>
    </Modal>
  );
};

export default ResetPasswordModal;

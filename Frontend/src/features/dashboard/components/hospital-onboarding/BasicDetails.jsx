import { useForm } from "react-hook-form";
import CommonInput from "../../../../components/CommonInput";
import CommonTextarea from "../../../../components/CommonTextarea";
import FormStepperButtons from "../FormStepperButtons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBasicDetails,
  markStepCompleted,
  resetSignupHospitalStatus,
  signUpHospital,
} from "../../../../slices/hospitalOnboardingSlice";
import { removeEmptyValues } from "../../../../utils/common";
import { useEffect } from "react";
import { getDataFromCookies } from "../../../../services/cookies";
import { basicDetailsSchema } from "./validations/basicDetails";
import { apiResponseType } from "../../../../utils/types";
import { toastMessage } from "../../../../utils/toastMessage";
import useApiResponseHandler from "../../../../hooks/useApiResponseHandler";

const BasicDetails = ({ previousStepHandler, nextStepHandler }) => {
  const dispatch = useDispatch();
  const token = getDataFromCookies("hospitalToken");
  const curStep = useSelector((state) => state.hospitalOnboarding.currentStep);
  const { fetchBasicDetailApi, signUpHospitalApi } = useSelector(
    (state) => state.hospitalOnboarding
  );
  const { status, isLoading, error, data } = signUpHospitalApi;
  const { data: basicData, status: basicDataStatus } = fetchBasicDetailApi;
  const form = useForm({
    resolver: zodResolver(basicDetailsSchema),
  });
  const { register, handleSubmit, formState, setError, setValue } = form;
  const { errors } = formState;

  const onSubmit = async (data) => {
    // console.log("form submitted", data);
    const newData = removeEmptyValues(data, [""]);
    dispatch(signUpHospital(newData));
  };

  // 🚀 Step 1: dispatch only once when token is present
  useEffect(() => {
    if (token) {
      dispatch(fetchBasicDetails());
      // setValue("name",data?.)
    }
  }, [token]);

  useEffect(() => {
    if (basicDataStatus === apiResponseType.success) {
      setValue("name", basicData?.name);
      setValue("pincode", basicData?.pincode);
      setValue("digiPin", basicData?.digiPin);
      setValue("address", basicData?.address);
      setValue("email", basicData?.email);
      setValue("optionalEmail", basicData?.optionalEmail);
      setValue("optionalPhoneNo", basicData?.optionalPhoneNo);
      setValue("phoneNo", basicData?.phoneNo);
    } else {
      toastMessage(fetchBasicDetailApi, null);
    }
  });

  // 🚀 Step 2: when redux state updates → reset RHF
  useApiResponseHandler({
    status: status,
    data: data,
    error: error,
    resetReduxStatus: () => dispatch(resetSignupHospitalStatus()),
    sideAction: () => dispatch(markStepCompleted(curStep)),
    setFormError: setError,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 className="text-xl lg:text-2xl font-medium text-blue">
        Basic Details
      </h2>
      <div className="grid grid-cols-4 gap-3 items-center justify-center my-4">
        <div className="col-span-2">
          <CommonInput
            labelName="Hospital Name"
            id="name"
            name="name"
            register={register}
            errors={errors}
          />
        </div>
        <div>
          <CommonInput
            labelName="Pincode"
            id="pincode"
            name="pincode"
            register={register}
            errors={errors}
          />
        </div>
        <div>
          <CommonInput
            labelName="Digipin"
            id="digiPin"
            name="digiPin"
            register={register}
            errors={errors}
          />
        </div>
        <div className="col-span-4">
          <CommonTextarea
            id="address"
            name="address"
            labelName="Address"
            className="col-span-2"
            register={register}
            errors={errors}
          />
        </div>
        <div className="col-span-2">
          <CommonInput
            labelName="Primary Email Id"
            id="email"
            name="email"
            register={register}
            errors={errors}
          />
        </div>
        <div className="col-span-2">
          <CommonInput
            labelName="Optional Email Id"
            id="optionalEmail"
            name="optionalEmail"
            register={register}
            errors={errors}
          />
        </div>
        <div className="col-span-2">
          <CommonInput
            labelName="Primary Mobile No"
            id="phoneNo"
            name="phoneNo"
            register={register}
            errors={errors}
          />
        </div>
        <div className="col-span-2">
          <CommonInput
            labelName="Optional Mobile No"
            id="optionalPhoneNo"
            name="optionalPhoneNo"
            register={register}
            errors={errors}
          />
        </div>
      </div>
      <FormStepperButtons
        curStep={curStep}
        previousStepHandler={previousStepHandler}
        nextStepHandler={nextStepHandler}
        isLoading={isLoading}
      />
    </form>
  );
};

export default BasicDetails;

import BasicDetails from "./hospital-onboarding/BasicDetails";
import DepartmentSetup from "./hospital-onboarding/DepartmentSetup";
import DoctorsDetails from "./hospital-onboarding/DoctorsDetails";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import ReviewSubmit from "./hospital-onboarding/ReviewSubmit";
import { useDispatch, useSelector } from "react-redux";
import {
  goToNextStep,
  goToPreviousStep,
} from "../../../slices/hospitalOnboardingSlice";

const Form = ({ totalSteps }) => {
  const dispatch = useDispatch();
  const curStep = useSelector((state) => state.hospitalOnboarding.currentStep);
  const form = useForm({});
  const { control } = form;

  const previousStepHandler = () => {
    dispatch(goToPreviousStep());
  };

  const nextStepHandler = () => {
    if (curStep < totalSteps) {
      dispatch(goToNextStep());
    }
  };

  return (
    <div className="flex flex-col gap-5 min-h-[40dvh]">
      <div className="text-blue">
        <h1 className="text-xl lg:text-2xl font-medium">Hospital Onboarding</h1>
        <p className="font-medium text-sm lg:text-base">
          (Operated by company staff only)
        </p>
      </div>

      {curStep === 1 && (
        <BasicDetails
          previousStepHandler={previousStepHandler}
          nextStepHandler={nextStepHandler}
        />
      )}
      {curStep === 2 && (
        <DepartmentSetup
          previousStepHandler={previousStepHandler}
          nextStepHandler={nextStepHandler}
        />
      )}
      {curStep === 3 && (
        <DoctorsDetails
          previousStepHandler={previousStepHandler}
          nextStepHandler={nextStepHandler}
        />
      )}
      {curStep === 4 && (
        <ReviewSubmit previousStepHandler={previousStepHandler} />
      )}

      <DevTool control={control} />
      {/* set up the dev tool */}
    </div>
  );
};

export default Form;

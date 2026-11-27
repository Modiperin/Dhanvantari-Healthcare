import { useSelector } from "react-redux";
import Steps from "./Steps";
import Form from "./Form";

const FormStepper = () => {
  const currentStep = useSelector(
    (state) => state.hospitalOnboarding.currentStep
  );

  const steps = useSelector((state) => state.hospitalOnboarding.steps);

  return (
    <div className="bg-white rounded-lg w-full min-h-[100dvh] p-6 lg:p-10 flex flex-col gap-5">
      <Steps steps={steps} curStep={currentStep} />
      <Form totalSteps={steps.length} />
    </div>
  );
};

export default FormStepper;

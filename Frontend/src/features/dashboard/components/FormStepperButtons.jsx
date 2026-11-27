import BlueArrowIcon from "../../../assets/svg/blue-arrow-down.svg?react";
import ArrowIcon from "../../../assets/svg/arrow-right.svg?react";
import { useSelector } from "react-redux";
import Spinner from "../../../components/Spinner";
import Button from "../../../components/Buttons/Button";

const FormStepperButtons = ({
  curStep,
  previousStepHandler,
  currentStepHandler = () => {},
  nextStepHandler,
  isLoading = false,
}) => {
  const completedSteps = useSelector(
    (state) => state.hospitalOnboarding.completedSteps
  );

  // console.log({completedSteps})

  return (
    <div
      className={`flex items-center ${
        curStep > 1 ? "justify-between" : "justify-end"
      } gap-5 w-full mt-5`}
    >
      {curStep > 1 && (
        <Button variant="light" onClick={previousStepHandler}>
          <BlueArrowIcon className="rotate-180" />
          <span>Back</span>
        </Button>
      )}

      <div className="flex items-center gap-5">
        {(curStep === 1 || curStep === 4) && (
          <Button
            type="submit"
            // variant="light"
            disabled={completedSteps.includes(curStep) ? true : false}
            onClick={() => currentStepHandler()}
          >
            <span>Submit</span>
            {isLoading && <Spinner />}
          </Button>
        )}

        {curStep < 4 && (
          <Button
            onClick={nextStepHandler}
            disabled={completedSteps.includes(curStep) ? false : true}
          >
            <span>Next Step</span>

            <ArrowIcon />
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormStepperButtons;

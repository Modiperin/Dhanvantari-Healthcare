import { goToSpecificStep } from "../../../slices/hospitalOnboardingSlice";
import { useDispatch } from "react-redux";

const Steps = ({ steps, curStep }) => {
  const dispatch = useDispatch();

  const moveToStep = (step) => {
    dispatch(goToSpecificStep(step));
  };

  return (
    <div className="max-w-4xl relative steps flex justify-between lg:justify-center w-full gap-0 mx-auto h-full">
      {steps.map((step) => {
        return (
          <div
            key={step.id}
            className="z-10 relative flex items-center justify-center"
          >
            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={() => moveToStep(step.id)}
            >
              <div
                className={`flex items-center justify-center font-medium p-5 h-10 w-10 rounded-full border-8 ring-offset-0 duration-300 mb-6 ${
                  curStep >= step.id
                    ? `bg-blue border-blue text-white`
                    : `bg-white border-light-blue text-blue/60`
                }`}
              >
                {curStep > step.id ? "✔" : step.id}
              </div>
              <p
                className={`absolute bottom-0 text-nowrap text-sm text-center ${
                  curStep >= step.id ? "text-blue" : "text-blue/60"
                }`}
              >
                {step.title}
              </p>
            </div>
            {step.id !== steps.length && (
              <div className={`flex-grow h-2 w-20 lg:w-64 bg-transparent`} />
            )}
          </div>
        );
      })}
      <div className="absolute top-1/3 w-full mx-auto h-2 bg-light-blue rounded overflow-hidden">
        <div
          className="h-2 bg-blue transition-all duration-500 ease-in-out"
          style={{ width: `${((curStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default Steps;

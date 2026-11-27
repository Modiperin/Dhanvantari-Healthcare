import React from "react";
import { vitalFields } from "../helper";
import InputWithSelect from "../../../components/InputWithSelect";
import HorizontalLines from "../../../components/lines/HorizontalLine";

const VitalFields = ({
  errors,
  handleVitalChange,
  vitals,
  handleUnitChange,
  calculatedVitals = {},
  gridClasses = "grid grid-cols-2",
}) => {
  const getBMICategory = () => {
    if (!calculatedVitals.bmi)
      return {
        category: "N/A",
        color: "text-gray-500",
        bgColor: "bg-gray-100",
      };

    const bmiValue = parseFloat(calculatedVitals.bmi);
    if (bmiValue < 18.5) {
      return {
        category: "Underweight",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      };
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      return {
        category: "Normal Weight",
        color: "text-green-600",
        bgColor: "bg-green-50",
      };
    } else if (bmiValue >= 25 && bmiValue < 30) {
      return {
        category: "Overweight",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
      };
    } else if (bmiValue >= 30 && bmiValue < 35) {
      return {
        category: "Obese Class I",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      };
    } else if (bmiValue >= 35 && bmiValue < 40) {
      return {
        category: "Obese Class II",
        color: "text-red-600",
        bgColor: "bg-red-50",
      };
    } else {
      return {
        category: "Obese Class III",
        color: "text-red-700",
        bgColor: "bg-red-100",
      };
    }
  };
  return (
    <>
      <div className="grid col-span-6 row-span-3">
        <h3 className="text-[18px] mb-5">Vitals</h3>
        <div className={`${gridClasses} gap-4 mb-4`}>
          {vitalFields.map((field) => {
            return (
              <InputWithSelect
                key={field.key}
                name={field.key}
                inputValue={vitals[field.key]}
                inputLable={field.label}
                inputType={field.type}
                onInputChange={(val) => handleVitalChange(field.key, val)}
                selectedValue={vitals[field.unitKey]}
                onSelectChange={(val) =>
                  handleUnitChange(field.unitKey, val, field.key)
                }
                options={field.unitOptions}
                placeholder={field.placeholder}
                selectBoxClass="min-w-[100px]"
                errors={errors}
                isBpInput={field.key === "bp"}
              />
            );
          })}
        </div>
        <HorizontalLines />
        <div className="mb-4 p-3">
          {/* <div> */}
          <div className="flex items-center justify-start gap-2 mb-2">
            <span className="text-sm font-medium">Body Mass Index (BMI)</span>
            <span className="font-semibold text-lg">
              {calculatedVitals.bmi || "N/A"}
            </span>
          </div>
          <div
            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              getBMICategory().color
            } ${getBMICategory().bgColor}`}
          >
            {getBMICategory().category}
          </div>
        </div>
      </div>
    </>
  );
};

export default VitalFields;

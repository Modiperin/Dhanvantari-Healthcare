import React, { useMemo } from "react";
import CheckboxWithLabel from "../../../components/CheckboxWithLabel";
import AntMultiSelector from "../../../components/AntDesign/AntMultiSelector";

const habitsOptions = ["alcohol", "diabetes", "smoking", "tobacco"];
const foodAllergyOptions = [
  "Latex Allergy",
  "Phenazocine allergy",
  "Pentazocine allergy",
  "Aspirin allergy",
  "Salicylate allergy",
  "Acetaminophen allergy",
  "Food intolerance",
  "House dust mite allergy",
  "House dust allergy",
  "Egg protein allergy",
  "Primary lactose intolerance",
  "Allergy to walnut",
  "Allergy to sulfonamides",
  "Allergy to strawberries",
  "Allergy to seafood",
  "Allergy to penicillin",
  "Allergy to peanuts",
];

const procedureOptions = [
  "Procedure 1",
  "Procedure 2",
  "Procedure 3",
  "Procedure 4",
  "Procedure 5",
  "Procedure 6",
];

const currentlyTakingMedicinesOptions = [
  "Medicine 1",
  "Medicine 2",
  "Medicine 3",
];

export const MedicalHistoryFields = ({ habits, setHabits, control }) => {
  const getfoodAllergyOptions = useMemo(
    () => foodAllergyOptions.map((ele) => ({ value: ele, label: ele })),
    []
  );
  const getProcedureOptions = useMemo(
    () => procedureOptions.map((ele) => ({ value: ele, label: ele })),
    []
  );
  const getCurrentlyTakingMedicinesOptions = useMemo(
    () =>
      currentlyTakingMedicinesOptions.map((ele) => ({
        value: ele,
        label: ele,
      })),
    []
  );

  const handleHabitChange = (habit) => {
    setHabits((prev) => ({
      ...prev,
      [habit]: !prev[habit],
    }));
  };
  return (
    <>
      <div className="flex justify-between">
        {habitsOptions.map((habit) => (
          <CheckboxWithLabel
            key={habit}
            label={habit}
            checked={habits[habit]}
            onChange={() => handleHabitChange(habit)}
          />
        ))}
      </div>
      <div className="flex flex-col justify-between gap-4 mt-4">
        <AntMultiSelector
          id="foodAllergy"
          name="foodAllergy"
          control={control}
          options={getfoodAllergyOptions}
          labelName="Food Allergy"
          required
        />
        <AntMultiSelector
          id="drugAllergy"
          name="drugAllergy"
          control={control}
          labelName="Drug Allergy"
          options={getProcedureOptions}
        />
        <AntMultiSelector
          id="pastSurgical"
          name="pastSurgical"
          control={control}
          labelName="Past Surgical"
          options={getProcedureOptions}
        />
        <AntMultiSelector
          id="procedure"
          name="procedure"
          control={control}
          labelName="Procedure"
          options={getProcedureOptions}
        />
        <AntMultiSelector
          id="currentlyTakingMedicines"
          name="currentlyTakingMedicines"
          control={control}
          labelName="Currently Taking Medicines"
          options={getCurrentlyTakingMedicinesOptions}
        />
      </div>
    </>
  );
};

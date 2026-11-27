import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Spinner from "../../../components/Spinner";
import Button from "../../../components/Buttons/Button";
import { MedicalHistoryFields } from "./MedicalHistoryFields";
import SaveButton from "../../../components/Buttons/SaveButton";

export const MedicalHistoryForm = ({
  onSubmit,
  history = {},
  isLoading = false,
}) => {
  const form = useForm({});

  const { reset } = form;

  const [habits, setHabits] = useState({
    alcohol: history?.alcohol ?? false,
    diabetes: history?.diabetes ?? false,
    smoking: history?.smoking ?? false,
    tobacco: history?.tobacco ?? false,
  });

  useEffect(() => {
    reset({
      foodAllergy: history?.foodAllergy ?? [],
      drugAllergy: history?.drugAllergy ?? [],
      pastSurgical: history?.pastSurgical ?? [],
      procedure: history?.procedure ?? [],
      currentlyTakingMedicines: history?.currentlyTakingMedicines ?? [],
    });
    setHabits({
      alcohol: history?.alcohol ?? false,
      diabetes: history?.diabetes ?? false,
      smoking: history?.smoking ?? false,
      tobacco: history?.tobacco ?? false,
    });
  }, [history, reset]);

  const { handleSubmit, control } = form;

  const handleSave = (data) => {
    onSubmit({
      foodAllergy: data.foodAllergy || [],
      drugAllergy: data.drugAllergy || [],
      pastSurgical: data.pastSurgical || [],
      procedure: Array.isArray(data.procedure) ? data.procedure : [],
      currentlyTakingMedicines: Array.isArray(data.currentlyTakingMedicines)
        ? data.currentlyTakingMedicines
        : [],
      ...habits,
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit(handleSave)} noValidate>
        <MedicalHistoryFields
          history={history}
          control={control}
          habits={habits}
          setHabits={setHabits}
        />
        <div className="flex justify-end items-center gap-3 mt-6 mb-2">
          <SaveButton type="submit" isLoading={isLoading} />
        </div>
      </form>
    </>
  );
};

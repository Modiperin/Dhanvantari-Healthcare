import React, { useEffect, useMemo, useState } from "react";
import Modal from "../../../components/Modal";
import VitalFields from "../../OPD/components/VitalFields";
import {
  calculateBMI,
  convertHeight,
  convertTemperature,
  convertWeight,
  initialVitalsState,
} from "../../OPD/helper";
import {
  convertToHookFormErrors,
  removeEmptyValues,
} from "../../../utils/common";
import { useDispatch, useSelector } from "react-redux";
import { createPatientVital, resetApiState } from "../../../slices/nurseOPD";
import { toastMessage } from "../../../utils/toastMessage";
import toast from "react-hot-toast";
import SaveButton from "../../../components/Buttons/SaveButton";

const VitalCollectionModal = ({
  open = false,
  onClose = {},
  patientId = "",
}) => {
  const [vitals, setVitals] = useState(initialVitalsState);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { createVitalApi } = useSelector((state) => state.nurseOPD);

  const CalculatedVitals = useMemo(
    () => ({
      bmi: +calculateBMI(vitals),
    }),
    [vitals]
  );

  const handleUnitChange = (key, newUnit, fieldName) => {
    let oldUnit = vitals[key];
    setVitals((prev) => ({ ...prev, [key]: newUnit }));
    switch (fieldName) {
      case "height":
        setVitals((prev) => ({
          ...prev,
          [fieldName]: convertHeight(vitals[fieldName], oldUnit, newUnit),
        }));
        break;
      case "weight":
        setVitals((prev) => ({
          ...prev,
          [fieldName]: convertWeight(vitals[fieldName], oldUnit, newUnit),
        }));
        break;
      case "temperature":
        setVitals((prev) => ({
          ...prev,
          [fieldName]: convertTemperature(vitals[fieldName], oldUnit, newUnit),
        }));
        break;
    }
  };

  const handleVitalChange = (key, value) => {
    setVitals((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: null })); // Clear error for the changed field
  };

  useEffect(() => {
    if (createVitalApi.status === "success") {
      toastMessage(createVitalApi);
      dispatch(resetApiState("createVitalApi"));
      onClose();
    } else if (createVitalApi.status === "failed") {
      setErrors(convertToHookFormErrors(createVitalApi.error));
    }
  }, [createVitalApi]);

  const submitVitals = () => {
    // console.log(convertTemperature(vitals.temperature, vitals.temperatureUnit, "°F"));
    const updateData = {
      height: vitals.height
        ? +convertHeight(vitals.height, vitals.heightUnit, "cm")
        : undefined,
      weight: vitals.weight
        ? +convertWeight(vitals.weight, vitals.weightUnit, "kg")
        : undefined,
      bmi: vitals.height && vitals.weight ? +CalculatedVitals.bmi : undefined,
      temperature: vitals.temperature
        ? +convertTemperature(vitals.temperature, vitals.temperatureUnit, "°F")
        : undefined,
      pulse: vitals.pulse || undefined,
      bp: vitals.bp || undefined,
      spo2: vitals.spo2 || undefined,
      bsf: vitals.bsf || undefined,
      rbs: vitals.rbs || undefined,
      bspp: vitals.bspp || undefined,
      respirationRate: vitals.respirationRate || undefined,
    };

    const pureUpdateData = removeEmptyValues(updateData);

    if (Object.keys(pureUpdateData).length > 0) {
      const data = {
        ...pureUpdateData,
        from: "patientdashboard",
        patientId,
      };
      dispatch(createPatientVital({ data }));
    } else {
      toast.error("Empty Form");
    }
  };
  return (
    <>
      <Modal
        open={open}
        onOpenChange={onClose}
        title={"Vital Collection"}
        contentClassName="min-w-[68vh] w-full max-w-3xl"
      >
        <div className="grid grid-cols-2 gap-3">
          {/* all vitals inputs */}
          <VitalFields
            vitals={vitals}
            handleVitalChange={handleVitalChange}
            errors={errors}
            handleUnitChange={handleUnitChange}
            calculatedVitals={CalculatedVitals}
          />
        </div>
        <div className="flex justify-end mt-3 mb-4">
          <SaveButton
            name={"Collect Vital"}
            isLoading={createVitalApi?.isLoading}
            onClick={submitVitals}
          />
        </div>
      </Modal>
    </>
  );
};

export default VitalCollectionModal;

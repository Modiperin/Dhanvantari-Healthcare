import DiagnosisCard from "../components/DiagnosisCard";
import MedicationsCard from "../components/MedicationsCard";
import Labs from "../components/Labs";
import ClinicalFindings from "../components/ClinicalFindings";
import ReferToDoctor from "../components/ReferToDoctor";
import { FormProvider, useForm } from "react-hook-form";
import AntDatePicker from "../../../components/AntDatePicker";
import CommonInput from "../../../components/CommonInput";
import CommonTextarea from "../../../components/CommonTextarea";
import ComplaintsSection from "../components/ComplaintsSection";
import {
  calculateBMI,
  convertHeight,
  convertTemperature,
  convertWeight,
  initialComplaintsState,
  initialVitalsState,
} from "../helper";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import {
  createConsultation,
  resetApiState,
  updateConsultation,
} from "../../../slices/consultationSlice";
import {
  areArraysEqual,
  convertToHookFormErrors,
  removeEmptyValues,
  sortObjectKeys,
} from "../../../utils/common";
import {
  addPatientMedicalHistory,
  createPatientVital,
  getPatientVisitDetails,
  resetApiState as resetApiStateNurseOpd,
  updatePatientVitalDetails,
} from "../../../slices/nurseOPD";
import { apiResponseType } from "../../../utils/types";
import ConsultationSkeleton from "../loader/ConsultationSkeleton";
import useCooldown from "../../../hooks/useCooldown";
import Button from "../../../components/Buttons/Button";
import { toastMessage } from "../../../utils/toastMessage";
import Spinner from "../../../components/Spinner";
import toast from "react-hot-toast";
import PrescriptionIcon from "../../../assets/svg/prescription.svg?react";
import BookIcon from "../../../assets/svg/book.svg?react";
import MedicalHistoryModal from "../components/MedicalHistoryModal";
import PatientHistoryModal from "../components/PatientHistoryModal";
import { getPatientPrescriptions } from "../../../slices/patientSlice";
import MedicalDocumentModal from "../components/MedicalDocumentModal";
import useNavigateTo from "../../../hooks/useNavigateTo";
import GeneratePrescription from "../components/GeneratePrescription";
import DoctorTopBar from "../components/DoctorTopbar";
import ResetButton from "../../../components/Buttons/ResetButton";
import SaveButton from "../../../components/Buttons/SaveButton";
import VitalFields from "../components/VitalFields";

const Consultation = () => {
  const { id } = useParams();
  const [vitals, setVitals] = useState(initialVitalsState);
  const [complaints, setComplaints] = useState(initialComplaintsState);
  const [saveCooldown, triggerSaveCooldown] = useCooldown(2000); // 2 seconds
  const [saveCooldownVital, triggerSaveCooldownVital] = useCooldown(2000); // 2 seconds
  const [vitalErrors, setVitalErrors] = useState({});
  const [buttonClick, setButtonClick] = useState("");
  const [showMedicalHistoryModal, setShowMedicalHistoryModal] = useState(false);
  const [showPatientHistoryModal, setShowPatientHistoryModal] = useState(false);
  const [showMedicalDocumentModal, setShowMedicalDocumentModal] =
    useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "";
  // console.log({ mode });
  const dispatch = useDispatch();
  const goTo = useNavigateTo();

  const user = useSelector((state) => state.user?.userInfo?.response);

  const padConfig = user?.padConfig || [];

  // consultation related
  const { createConsultationApi, updateConsultationApi } = useSelector(
    (state) => state.consultation
  );

  //opd related (patient visit)
  const {
    viewPatientVisitApi,
    createVitalApi,
    updateVitalDetailsApi,
    addMedicalHistoryApi,
  } = useSelector((state) => state.nurseOPD);
  const { isLoading, data } = viewPatientVisitApi;
  const patientData = data?.response?.patientData;
  const patientId = data?.response?.patientData?._id;
  const vitalData = data?.response?.vitalData;
  const consultationData = data?.response?.consultationData;
  const medicalHistory = patientData?.medicalHistory;
  const [contStatus, setContStatus] = useState("Pending");
  const [consultationId, setConsultationId] = useState(null);

  const methods = useForm({
    defaultValues: {
      diagnosis: [],
      medications: [],
      labs: [],
      clinicalFindings: [],
      referToDoctor: [],
      followUp: {},
      advice: "",
      notes: {
        private: "",
        public: "",
      },
    },
  });
  const {
    register,
    control,
    handleSubmit,
    formState,
    setError,
    getValues,
    reset,
    watch,
  } = methods;
  const { errors } = formState;
  // console.log({ errors });

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
    setVitalErrors((prev) => ({ ...prev, [key]: null })); // Clear error for the changed field
  };

  const handleComplaintChange = (idx, key, value) => {
    setComplaints((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [key]: value } : item))
    );
  };

  const addComplaint = (data) => {
    const newData = data || {
      chief: null,
      severity: null,
      region: null,
      days: null,
    };
    setComplaints((prev) => [...prev, newData]);
  };

  const removeComplaint = (idx) => {
    setComplaints((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleClosePopup = () => {
    setShowMedicalHistoryModal(false);
  };

  const handleMedicalHistorySubmit = (medicalData) => {
    dispatch(addPatientMedicalHistory({ id: patientId, data: medicalData }));
  };

  const saveVitalData = () => {
    triggerSaveCooldownVital();
    const pureVitalData = {
      patientId,
      visitId: id,
      height: vitals.height,
      weight: vitals.weight,
      bmi: vitals.bmi,
      temperature: vitals.temperature,
      pulse: vitals.pulse,
      bp: vitals.bp,
      spo2: vitals.spo2,
      bsf: vitals.bsf,
      rbs: vitals.rbs,
      bspp: vitals.bspp,
      respirationRate: vitals.respirationRate,
    };

    if (complaints.length) {
      pureVitalData.complaints = complaints;
    }

    if (vitalData && vitalData._id) {
      // console.log({ upatedDataOnly });
      // UPDATE VITAL
      dispatch(
        updatePatientVitalDetails({
          id: vitalData._id,
          data: {
            patientId,
            visitId: id,
            ...removeEmptyValues(pureVitalData),
          },
        })
      );
    } else {
      // CREATE VITAL
      dispatch(
        createPatientVital({
          data: removeEmptyValues(pureVitalData),
        })
      );
    }
  };

  const checkKeyDown = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const followUpDays = watch("followUp.days");
  const followUpDate = watch("followUp.date");

  // console.log({ consultationId });

  const onSubmit = (data) => {
    triggerSaveCooldown();

    if (id) {
      const diagnosis =
        data?.diagnosis?.map((ele) => {
          const id = ele._id;
          delete ele._id;
          return {
            ...removeEmptyValues(ele, [""]),
            id,
            ...(ele?.since && {
              since: {
                value: +ele.since.split(" ")[0],
                unit: ele.since.split(" ")[1],
              },
            }),
          };
        }) || [];

      const medications =
        data?.medications?.map((ele) => {
          const id = ele._id;
          delete ele._id;
          return {
            ...removeEmptyValues(ele, [""]),
            id,
          };
        }) || [];

      const labs =
        data?.labs?.map((ele) => {
          const id = ele._id;
          delete ele._id;
          return {
            ...removeEmptyValues(ele, [""]),
            id,
            ...(ele?.since && {
              since: {
                value: +ele.since.split(" ")[0],
                unit: ele.since.split(" ")[1],
              },
            }),
          };
        }) || [];

      const clinicalFindings =
        data?.clinicalFindings?.map((ele) => {
          const id = ele._id;
          delete ele._id;
          return {
            ...removeEmptyValues(ele, [""]),
            id,
          };
        }) || [];

      const referToDoctor = data?.referToDoctor?.map((ele) => {
        const id = ele._id;
        delete ele._id;
        return {
          ...removeEmptyValues(ele, [""]),
          id,
        };
      })[0];

      let followUp = {};
      if (
        data?.followUp?.days ||
        data?.followUp?.date ||
        data?.followUp?.instructions
      ) {
        followUp = {
          ...followUp,
          days: data.followUp.days || 0,
          date: data.followUp.date,
          instructions: data.followUp.instructions,
        };
      }

      const pureData = {
        diagnosis,
        medications,
        labs,
        clinicalFindings,
        referToDoctor,
        notes: data.notes,
        advice: data.advice,
        visitId: id,
        followUp,
      };
      if (consultationId) {
        const isDiagnosisUpdated = !areArraysEqual(
          diagnosis,
          consultationData?.diagnosis || []
        );
        const isMedicationsUpdated = !areArraysEqual(
          medications,
          consultationData?.medications || []
        );
        const isLabsUpdated = !areArraysEqual(
          labs,
          consultationData?.labs || []
        );

        const isClinicalFindingsUpdated = !areArraysEqual(
          clinicalFindings,
          consultationData?.clinicalFindings || []
        );

        const isReferToDoctorUpdated = !areArraysEqual(
          referToDoctor,
          consultationData?.referToDoctor || {}
        );

        const isFollowUpUpdated = !(
          JSON.stringify(sortObjectKeys(followUp)) ===
          JSON.stringify(sortObjectKeys(consultationData?.followUp || {}))
        );

        const pureDataUpdate = {
          ...(isDiagnosisUpdated && { diagnosis }),
          ...(isMedicationsUpdated && { medications }),
          ...(isLabsUpdated && { labs }),
          ...(isClinicalFindingsUpdated && { clinicalFindings }),
          ...(isReferToDoctorUpdated && { referToDoctor }),
          ...(isFollowUpUpdated && { followUp }),
        };

        dispatch(
          updateConsultation({
            id: consultationId,
            data: { ...pureDataUpdate, visitId: id, contStatus },
          })
        );
      } else {
        dispatch(createConsultation({ ...pureData, visitId: id, contStatus }));
      }
      saveVitalData();
    }
  };

  useEffect(() => {
    if (createConsultationApi.status === apiResponseType.success) {
      setConsultationId(createConsultationApi.data?.consultationId);
    }
  }, [createConsultationApi.status]);

  useEffect(() => {
    const case1 =
      createConsultationApi.status === "success" &&
      createVitalApi.status === "success";
    const case2 =
      createConsultationApi.status === "success" &&
      updateVitalDetailsApi.status === "success";
    const case3 =
      updateConsultationApi.status === "success" &&
      createVitalApi.status === "success";
    const case4 =
      updateConsultationApi.status === "success" &&
      updateVitalDetailsApi.status === "success";

    if (buttonClick === "final" && (case1 || case2 || case3 || case4)) {
      toast.success("Vitals and Consultation Submit Successfully");
    } else if (
      buttonClick === "prescription" &&
      (case1 || case2 || case3 || case4)
    ) {
      goTo("?mode=generate");
      toast.success("Prescription Generated Successfully");
    } else if (
      updateVitalDetailsApi.status === "success" &&
      buttonClick === "vital"
    ) {
      toastMessage(updateVitalDetailsApi);
    } else if (updateVitalDetailsApi.status === "failed") {
      setVitalErrors(convertToHookFormErrors(updateVitalDetailsApi.error));
    } else if (createVitalApi.status === "success" && buttonClick === "vital") {
      toastMessage(createVitalApi);
    } else if (createVitalApi.status === "failed") {
      setVitalErrors(convertToHookFormErrors(createVitalApi.error));
    } else if (
      createConsultationApi.status === apiResponseType.failed &&
      buttonClick === "final"
    ) {
      createConsultationApi.error?.forEach((err) => {
        if (err.field === "general") {
          toast.error(err.message);
        } else {
          setError?.(err.field, {
            type: "server",
            message: err.message,
          });
        }
      });
    } else if (
      updateConsultationApi.status === apiResponseType.failed &&
      buttonClick === "final"
    ) {
      updateConsultationApi.error?.forEach((err) => {
        if (err.field === "general") {
          toast.error(err.message);
        } else {
          setError?.(err.field, {
            type: "server",
            message: err.message,
          });
        }
      });
    }
  }, [
    createConsultationApi,
    updateConsultationApi,
    createVitalApi,
    updateVitalDetailsApi,
    buttonClick,
  ]);

  useEffect(() => {
    if (id) {
      dispatch(getPatientVisitDetails({ id }));
    }
  }, [id]);

  useEffect(() => {
    if (viewPatientVisitApi?.status === apiResponseType.success) {
      if (vitalData) {
        setVitals({
          height: vitalData.height || null,
          heightUnit: vitalData.heightUnit || "cm",
          respirationRate: vitalData.respirationRate || null,
          respirationRateUnit: vitalData.respirationRateUnit || "bpm",
          weight: vitalData.weight || null,
          weightUnit: vitalData.weightUnit || "kg",
          bmi: vitalData.bmi || null,
          bmiUnit: vitalData.bmiUnit || "kg/m²",
          temperature: vitalData.temperature || null,
          temperatureUnit: vitalData.temperatureUnit || "°F",
          pulse: vitalData.pulse || null,
          pulseUnit: vitalData.pulseUnit || "/min",
          bp: vitalData.bp || null,
          bpUnit: vitalData.bpUnit || "mmHg",
          spo2: vitalData.spo2 || null,
          spo2Unit: vitalData.spo2Unit || "%",
          bsf: vitalData.bsf || null,
          bsfUnit: vitalData.bsfUnit || "mg/dl",
          rbs: vitalData.rbs || null,
          rbsUnit: vitalData.rbsUnit || "mg/dl",
          bspp: vitalData.bspp || null,
          bsppUnit: vitalData.bsppUnit || "mg/dl",
        });
      }
      if (vitalData?.complaints) {
        setComplaints(vitalData.complaints || initialComplaintsState);
      }
      if (medicalHistory) {
        reset({
          foodAllergy: medicalHistory?.foodAllergy ?? [],
          drugAllergy: medicalHistory?.drugAllergy ?? [],
          pastSurgical: medicalHistory?.pastSurgical ?? [],
          procedure: medicalHistory?.procedure ?? [],
          currentlyTakingMedicines:
            medicalHistory?.currentlyTakingMedicines ?? [],
        });
      }
      if (consultationData?._id) {
        setConsultationId(consultationData?._id);
        const updatedData = {
          diagnosis:
            consultationData?.diagnosis?.map((d) => ({
              ...d,
              ...(d.since && { since: `${d.since.value} ${d.since.unit}` }),
              _id: d.id,
            })) || [],
          medications:
            consultationData?.medications?.map((m) => ({ ...m, _id: m.id })) ||
            [],
          labs:
            consultationData?.labs?.map((l) => ({
              ...l,
              ...(l.since && { since: `${l.since.value} ${l.since.unit}` }),
              _id: l.id,
            })) || [],
          clinicalFindings:
            consultationData?.clinicalFindings?.map((c) => ({
              ...c,
              _id: c.id,
            })) || [],
          referToDoctor: consultationData?.referToDoctor
            ? [
                {
                  ...consultationData?.referToDoctor,
                  _id: consultationData?.referToDoctor?.id,
                },
              ]
            : [],
          followUp: consultationData?.followUp || {},
        };

        // console.log({ updatedData });
        reset({
          ...getValues(),
          ...updatedData,
        });
      }
    }
  }, [viewPatientVisitApi.status]);

  useEffect(() => {
    if (addMedicalHistoryApi.status === "success") {
      toastMessage(addMedicalHistoryApi);
      handleClosePopup();
      dispatch(getPatientVisitDetails({ id }));
    }
  }, [addMedicalHistoryApi, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetApiState("updateConsultationApi"));
      dispatch(resetApiState("createConsultationApi"));
      dispatch(resetApiStateNurseOpd("createVitalApi"));
      dispatch(resetApiStateNurseOpd("updateVitalDetailsApi"));
      dispatch(resetApiStateNurseOpd("viewPatientVisitApi"));
      dispatch(resetApiStateNurseOpd("addMedicalHistoryApi"));
      // setButtonClick("");
    };
  }, []);

  const isPadKeyPresent = (field) => {
    if (!padConfig.length) return true;
    return padConfig.find((item) => item.id === field && item.active);
  };

  const fieldComponents = {
    vitals: (
      <div
        key="vitals"
        className="col-span-full w-auto h-full border border-light-blue rounded-lg p-4"
      >
        <VitalFields
          errors={vitalErrors}
          handleVitalChange={handleVitalChange}
          vitals={vitals}
          handleUnitChange={handleUnitChange}
          calculatedVitals={CalculatedVitals}
          gridClasses="grid grid-cols-2 lg:grid-cols-4"
        />
        {isPadKeyPresent("complaints") && (
          <ComplaintsSection
            complaints={complaints}
            handleComplaintChange={handleComplaintChange}
            addComplaint={addComplaint}
            removeComplaint={removeComplaint}
          />
        )}
        <div className="flex justify-end items-center my-3">
          <SaveButton
            onClick={() => {
              saveVitalData();
              setButtonClick("vital");
            }}
            name={
              vitalData?._id
                ? "Update Vitals and Complaints"
                : "Save Vitals and Complaints"
            }
            disabled={
              saveCooldownVital ||
              createVitalApi.isLoading ||
              updateVitalDetailsApi.isLoading
            }
            isLoading={
              createVitalApi.isLoading || updateVitalDetailsApi.isLoading
            }
          />
        </div>
      </div>
    ),
    complaints: null, // Already included in vitals
    diagnosis: (
      <div key="diagnosis" className="col-span-full w-auto rounded-lg">
        <DiagnosisCard />
      </div>
    ),
    medications: (
      <div key="medications" className="col-span-full w-auto h-full rounded-lg">
        <MedicationsCard />
      </div>
    ),
    lab: (
      <div key="lab" className="col-span-full w-auto h-full rounded-lg">
        <Labs />
      </div>
    ),
    clinicalFindings: (
      <div
        key="clinicalFindings"
        className="col-span-full w-auto h-full rounded-lg"
      >
        <ClinicalFindings />
      </div>
    ),
    referToDoctor: (
      <div key="referToDoctor" className="col-span-full w-auto rounded-lg">
        <ReferToDoctor />
      </div>
    ),
  };

  const renderConfiguredFields = () => {
    if (!padConfig.length) {
      // If no config, show all fields in default order
      return Object.entries(fieldComponents)
        .filter(([key]) => key !== "complaints")
        .map(([key, component]) => component);
    }

    // Sort fields based on pad configuration order
    const sortedFields = padConfig
      .filter((field) => field.active && fieldComponents[field.id])
      .map((field) => fieldComponents[field.id])
      .filter(Boolean);

    return sortedFields;
  };

  if (isLoading) {
    return <ConsultationSkeleton />;
  }

  return (
    <>
      <DoctorTopBar patientVisitData={data?.response || {}} />
      <div className="page mt-1">
        <FormProvider {...methods}>
          <div className="relative bg-white rounded-lg w-full p-2 lg:p-4 flex flex-1 flex-col gap-3 lg:my-3">
            {mode === "generate" ? (
              <GeneratePrescription
                selectedVisit={id}
                setSearchParams={setSearchParams}
              />
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                onKeyDown={(e) => checkKeyDown(e)}
                noValidate
                className="grid grid-cols-2 gap-4 rounded-lg"
              >
                {renderConfiguredFields()}

                <div className="col-span-full lg:col-span-1 w-auto h-full border border-light-blue rounded-lg p-4">
                  <h2 className="title !text-[16px] mt-0 mb-5">
                    Follow Up Details
                  </h2>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <CommonInput
                        id={`followUp.days`}
                        name={`followUp.days`}
                        labelName="Days"
                        type="number"
                        register={register}
                        errors={errors}
                        disabled={followUpDate}
                      />
                      <span className="text-blue">OR</span>
                      <AntDatePicker
                        id="followUp.date"
                        name="followUp.date"
                        label="Any Particular Date"
                        control={control}
                        errors={errors}
                        disabled={followUpDays || false}
                      />
                    </div>
                    <CommonInput
                      id={`followUp.instructions`}
                      name={`followUp.instructions`}
                      labelName="Instructions"
                      type="text"
                      register={register}
                      errors={errors}
                    />
                  </div>
                </div>
                {/* <div className="col-span-1 w-auto h-full border border-light-blue rounded-lg p-4 overflow-scroll"> */}
                <CommonTextarea
                  id={`advice`}
                  name={`advice`}
                  labelName="Advice"
                  type="text"
                  register={register}
                  className="col-span-full lg:col-span-1 h-full"
                  errors={errors}
                />
                {/* </div> */}

                <div className="col-span-full w-auto h-full border border-light-blue rounded-lg p-4 flex flex-col">
                  <h2 className="title !text-[16px] mb-5 mt-0">
                    Notes Section (Private and Public)
                  </h2>
                  <div className="w-full flex items-center gap-4 h-full">
                    <CommonTextarea
                      id={`notes.private`}
                      name={`notes.private`}
                      labelName="Private"
                      type="text"
                      register={register}
                      className="h-full"
                      errors={errors}
                    />
                    <CommonTextarea
                      id={`notes.public`}
                      name={`notes.public`}
                      labelName="Public"
                      type="text"
                      register={register}
                      className="h-full"
                      errors={errors}
                    />
                  </div>
                </div>

                <div className="sticky bottom-0 xl:bottom-5 z-[39] flex flex-1 gap-2 items-end justify-between col-span-full bg-[#5D8AA8]/30 border border-light-blue inset-0 backdrop-blur-sm p-4 rounded-lg text-xs xl:text-sm">
                  {/* <Button variant="light" className="bg-white gap-1">
                  English
                  <TranslateIcon />
                  ગુજરાતી
                </Button> */}
                  <div className="hidden lg:flex"></div>
                  <div className="flex flex-wrap gap-4">
                    <ResetButton
                      className="bg-white gap-1"
                      onClick={() => {
                        if (id) {
                          dispatch(getPatientVisitDetails({ id }));
                        } else {
                          reset();
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        setButtonClick("final");
                        handleSubmit(onSubmit)();
                        setContStatus("Pending");
                      }}
                      variant="light"
                      className="bg-white gap-1"
                      disabled={
                        saveCooldown ||
                        createConsultationApi.isLoading ||
                        updateConsultationApi.isLoading
                      }
                    >
                      Save Prescription
                      {(createConsultationApi.isLoading ||
                        updateConsultationApi.isLoading) && <Spinner />}
                    </Button>
                    <Button
                      className="gap-1 lg:order-last"
                      type="submit"
                      onClick={() => {
                        setContStatus("Completed");
                        goTo("?mode=generate");
                      }}
                      disabled={
                        saveCooldown ||
                        createConsultationApi.isLoading ||
                        updateConsultationApi.isLoading
                      }
                    >
                      <PrescriptionIcon />
                      Generate Prescription
                    </Button>
                    <Button onClick={() => setShowMedicalDocumentModal(true)}>
                      Medical Document
                    </Button>
                    <Button
                      onClick={() => setShowMedicalHistoryModal(true)}
                      className="gap-1"
                    >
                      <BookIcon />
                      Medical History
                    </Button>
                    <Button
                      className="gap-1"
                      onClick={() => {
                        setShowPatientHistoryModal(true);

                        if (patientId) {
                          dispatch(getPatientPrescriptions({ patientId }));
                        }
                      }}
                    >
                      <BookIcon />
                      Patient History
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </FormProvider>
        {showMedicalHistoryModal && (
          <MedicalHistoryModal
            history={medicalHistory || {}}
            open={showMedicalHistoryModal}
            onClose={() => setShowMedicalHistoryModal(false)}
            onSubmit={handleMedicalHistorySubmit}
            isLoading={addMedicalHistoryApi.isLoading}
            isHistoryApiLoading={isLoading}
          />
        )}
        {showPatientHistoryModal && (
          <PatientHistoryModal
            open={showPatientHistoryModal}
            onClose={() => setShowPatientHistoryModal(false)}
          />
        )}
        {showMedicalDocumentModal && (
          <MedicalDocumentModal
            open={showMedicalDocumentModal}
            onClose={() => setShowMedicalDocumentModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default Consultation;

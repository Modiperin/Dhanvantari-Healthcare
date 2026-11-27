import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ClockIcon from "../../../assets/svg/clock.svg?react";
import DocUserIcon from "../../../assets/svg/user.svg?react";
import PhoneIcon from "../../../assets/svg/phone.svg?react";
import SMSIcon from "../../../assets/svg/sms.svg?react";
import CalenderIcon from "../../../assets/svg/calendar.svg?react";
import ComplaintsSection from "../components/ComplaintsSection";
import Button from "../../../components/Buttons/Button";
import DoctorDetailsCard from "../components/DoctorDetailsCard";
import {
  addPatientMedicalHistory,
  createPatientVital,
  getPatientVisitDetails,
  resetApiState,
  updatePatientVitalDetails,
  updateVisitDetails,
} from "../../../slices/nurseOPD";
import { formatDate } from "../../../utils/dateAndTime";
import {
  getGenderSymbolIcon,
  getPatientStatusIcon,
  getPriorityIcon,
} from "../../../utils/icon";
import { prioriry } from "../../../utils/types";
import LongDesc from "../../../components/LongDesc";
import { successToastMessage, toastMessage } from "../../../utils/toastMessage";
import {
  convertToHookFormErrors,
  removeEmptyValues,
} from "../../../utils/common";
import useCooldown from "../../../hooks/useCooldown";
import MedicalHistoryModal from "../components/MedicalHistoryModal";
import VitalSkeletonLoader from "../loader/VitalSkeletonLoader";
import { getPatientMedicalHistory } from "../../../slices/patientSlice";
import {
  calculateBMI,
  convertHeight,
  convertTemperature,
  convertWeight,
  initialComplaintsState,
  initialVitalsState,
} from "../helper";
import VitalFields from "../components/VitalFields";
import SaveButton from "../../../components/Buttons/SaveButton";
import ResetButton from "../../../components/Buttons/ResetButton";

const VitalCollection = () => {
  const dispatch = useDispatch();

  const { id } = useParams();
  const [skipApiSync, setSkipApiSync] = useState(false);
  const [showMedicalHistoryModal, setShowMedicalHistoryModal] = useState(false);
  const [vitals, setVitals] = useState(initialVitalsState);
  const [resetCooldown, triggerResetCooldown] = useCooldown(3000);
  const [saveCooldown, triggerSaveCooldown] = useCooldown(2000); // 2 seconds
  const [complaints, setComplaints] = useState(initialComplaintsState);
  const [doctorName, setDoctorName] = useState(null);
  const [departmentName, setDepartmentName] = useState(null);
  const [errors, setErrors] = useState({});
  const statusUpdated = useRef(false);

  const CalculatedVitals = useMemo(
    () => ({
      bmi: +calculateBMI(vitals),
    }),
    [vitals]
  );

  const handleDoctorSave = (newDoctor, newDept) => {
    setDoctorName(newDoctor);
    setDepartmentName(newDept);
  };

  const handleClosePopup = () => {
    setShowMedicalHistoryModal(false);
  };

  useEffect(() => {
    dispatch(getPatientVisitDetails({ id }));
  }, [id]);

  const {
    viewPatientVisitApi,
    createVitalApi,
    updateVitalDetailsApi,
    addMedicalHistoryApi,
  } = useSelector((state) => state.nurseOPD);

  const { getPatientMedicalHistoryApi } = useSelector(
    (state) => state.patientManagement
  );
  const { data: patientMedicalHistory, isLoading: isHistoryApiLoading } =
    getPatientMedicalHistoryApi;

  const [medicalHistory, setMedicalHistory] = useState({});

  useEffect(() => {
    setMedicalHistory(patientMedicalHistory?.response?.medicalHistory);
  }, [getPatientMedicalHistoryApi]);

  const data = viewPatientVisitApi?.data?.response || {};
  const { isLoading } = viewPatientVisitApi;

  const followUpDetails = {
    date: data?.prevVisitAsFollowUp?.date, // or null/undefined if not present
    doctor: data?.prevVisitAsFollowUp?.doctorName || "",
  };

  useEffect(() => {
    if (viewPatientVisitApi?.status === "success" && !skipApiSync) {
      const data = viewPatientVisitApi.data.response;

      if (data.vitalData) {
        setVitals({
          height: data.vitalData.height || null,
          heightUnit: data.vitalData.heightUnit || "cm",
          respirationRate: data.vitalData.respirationRate || null,
          respirationRateUnit: data.vitalData.respirationRateUnit || "bpm",
          weight: data.vitalData.weight || null,
          weightUnit: data.vitalData.weightUnit || "kg",
          bmi: data.vitalData.bmi || null,
          bmiUnit: data.vitalData.bmiUnit || "kg/m²",
          temperature: data.vitalData.temperature || null,
          temperatureUnit: data.vitalData.temperatureUnit || "°F",
          pulse: data.vitalData.pulse || null,
          pulseUnit: data.vitalData.pulseUnit || "/min",
          bp: data.vitalData.bp || null,
          bpUnit: data.vitalData.bpUnit || "mmHg",
          spo2: data.vitalData.spo2 || null,
          spo2Unit: data.vitalData.spo2Unit || "%",
          bsf: data.vitalData.bsf || null,
          bsfUnit: data.vitalData.bsfUnit || "mg/dl",
          rbs: data.vitalData.rbs || null,
          rbsUnit: data.vitalData.rbsUnit || "mg/dl",
          bspp: data.vitalData.bspp || null,
          bsppUnit: data.vitalData.bsppUnit || "mg/dl",
        });
      }
      if (data.doctorData) {
        setDoctorName({
          value: data.doctorData.userId,
          name: data.doctorData.name,
        });
        setDepartmentName({
          value: data.doctorData.departmentId,
          name: data.doctorData.departmentName || "General",
        });
      }

      if (data?.vitalData?.complaints) {
        setComplaints(data?.vitalData?.complaints || initialComplaintsState);
      }
    }
  }, [viewPatientVisitApi, skipApiSync]);

  const markVitalAsOngoing = () => {
    if (
      !statusUpdated.current &&
      (!data?.vitalData || !data?.vitalData?._id) &&
      !isLoading &&
      data.vitalStatus === "Pending"
    ) {
      dispatch(
        updateVisitDetails({
          id: data.visitId,
          data: { vitalStatus: "Ongoing" },
        })
      );

      statusUpdated.current = true;
    }
  };

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
    markVitalAsOngoing();

    setVitals((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: null })); // Clear error for the changed field
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

  const handleSubmit = async () => {
    triggerSaveCooldown();
    const updateData = {
      patientId: data?.patientData?._id,
      visitId: id,
      height: +convertHeight(vitals.height, vitals.heightUnit, "cm"),
      weight: +convertWeight(vitals.weight, vitals.weightUnit, "kg"),
      bmi: CalculatedVitals.bmi,
      temperature: +convertTemperature(
        vitals.temperature,
        vitals.temperatureUnit,
        "°F"
      ),
      pulse: vitals.pulse,
      bp: vitals.bp,
      spo2: vitals.spo2,
      bsf: vitals.bsf,
      rbs: vitals.rbs,
      bspp: vitals.bspp,
      respirationRate: vitals.respirationRate,
    };

    if (doctorName.value && departmentName.value) {
      updateData.doctorId = doctorName.value;
      updateData.departmentId = departmentName.value;
    }

    if (complaints.length) {
      updateData.complaints = complaints;
    }

    const pureUpdateData = removeEmptyValues(updateData);
    if (data && data.vitalData && data.vitalData._id) {
      // UPDATE VITAL
      dispatch(
        updatePatientVitalDetails({
          id: data.vitalData._id,
          data: pureUpdateData,
        })
      );
    } else {
      // CREATE VITAL
      dispatch(
        createPatientVital({
          data: pureUpdateData,
        })
      );
    }
  };

  const handleMedicalHistorySubmit = (medicalData) => {
    dispatch(
      addPatientMedicalHistory({ id: data.patientId, data: medicalData })
    );
  };

  useEffect(() => {
    if (updateVitalDetailsApi.status === "success") {
      toastMessage(updateVitalDetailsApi);
    } else if (updateVitalDetailsApi.status === "failed") {
      setErrors(convertToHookFormErrors(updateVitalDetailsApi.error));
    }
  }, [updateVitalDetailsApi]);

  useEffect(() => {
    if (createVitalApi.status === "success") {
      toastMessage(createVitalApi);
    } else if (createVitalApi.status === "failed") {
      setErrors(convertToHookFormErrors(createVitalApi.error));
    }
  }, [createVitalApi]);

  useEffect(() => {
    if (addMedicalHistoryApi.status === "success") {
      toastMessage(addMedicalHistoryApi);
      handleClosePopup();
    }
  }, [addMedicalHistoryApi, dispatch]);

  const handleReset = () => {
    setSkipApiSync(true);
    setVitals({ ...initialVitalsState });
    successToastMessage("Vitals Reset Successfully");
    triggerResetCooldown();
  };

  useEffect(() => {
    return () => {
      dispatch(resetApiState("viewPatientVisitApi"));
      dispatch(resetApiState("createVitalApi"));
      dispatch(resetApiState("updateVitalDetailsApi"));
      dispatch(resetApiState("addMedicalHistoryApi"));
    };
  }, []);

  const isDoctorDetailsReady =
    !!doctorName?.value && !!departmentName?.value && !isLoading;

  return isLoading ? (
    <VitalSkeletonLoader />
  ) : (
    <div className="bg-white rounded-lg w-full min-h-[100dvh] p-5 flex flex-1 flex-col gap-3">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-2xl font-medium text-blue">
          Enter Patient Vital Signs
        </h2>
      </div>

      <div className="grid grid-cols-12 grid-rows-3 gap-2 text-blue">
        <div className="col-span-3 row-span-3 border rounded-md border-light-blue p-4">
          <div className="flex text-[#0F3E69CC] items-center mb-3 gap-2">
            <ClockIcon />
            <span className="text-sm">
              {formatDate(data?.createdAt, "dd-MM-yyyy / hh:mm a")}
            </span>
          </div>

          <DoctorDetailsCard
            doctorName={doctorName}
            departmentName={departmentName}
            onSave={handleDoctorSave}
            isReady={isDoctorDetailsReady}
          />

          <div className="border-b border-light-blue my-3" />
          <p className="text-sm text-blue/70">
            Record vital signs, patient condition, and initial nurse
            observations during admission or consultation. This information
            helps doctors gain quick clinical insights before examination.
          </p>
        </div>

        <VitalFields
          errors={errors}
          handleVitalChange={handleVitalChange}
          vitals={vitals}
          handleUnitChange={handleUnitChange}
          calculatedVitals={CalculatedVitals}
        />

        {/* Patient details */}
        <div className="col-span-3 row-span-2 border rounded-md border-light-blue p-4">
          <div className="flex text-sm items-center gap-1 mb-2">
            <div className="flex items-center gap-1">
              {getPriorityIcon(data?.priority)}
              {prioriry[data?.priority] || "Normal"}
            </div>
            <div className="w-px h-6 bg-blue-100 mx-2" />
            <div className="flex items-center gap-1">
              {getPatientStatusIcon(data?.status)}
              {data?.status}
            </div>
          </div>

          <p className="text-[18px] font-semibold mb-2">
            {data?.patientData?.name}
          </p>

          <div className="flex mb-2 text-sm items-center gap-1 text-light-blue-text">
            <div className="flex items-center gap-1 mr-2">
              <PhoneIcon className="w-4 h-4" />{" "}
              {data?.patientData?.phoneNo || "N/A"}
            </div>

            <div className="flex items-center gap-1">
              <SMSIcon />
              {
                <LongDesc
                  str={data?.patientData?.email || "N/A"}
                  length={20}
                  spitStringWise={false}
                />
              }
            </div>
          </div>

          <div className="flex text-sm items-center gap-1 text-light-blue-text">
            <div className="flex items-center gap-1">Age: 47</div>
            <div className="w-px h-6 bg-blue-100 mx-2" />
            <div className="flex text-blue-500 items-center gap-1 p-2 bg-extra-light-blue rounded-md">
              {getGenderSymbolIcon(data?.patientData?.gender)}
              <span className="capitalize">{data.patientData?.gender}</span>
            </div>
          </div>

          <div className="border-b border-light-blue my-3" />

          <div className="flex text-sm items-center justify-between">
            Blood Group
            <span className="flex items-center gap-1 p-2 bg-pink-100 rounded-md">
              {data?.patientData?.bloodGroup || "N/A"}
            </span>
          </div>

          <div className="border-b border-light-blue my-3" />

          <div className="flex text-sm items-center justify-between">
            Allergies
            <span className="flex items-center gap-1 p-2 bg-pink-100 rounded-md">
              {data?.patientData?.allergies || "N/A"}
            </span>
          </div>
        </div>

        {/* Follow-up details */}
        <div className="col-span-3 row-span-1 border rounded-md border-light-blue p-4">
          {followUpDetails?.date && followUpDetails?.doctor ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[18px]">Follow-up details</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="flex items-center gap-1">
                  <DocUserIcon />
                  <span className="font-semibold">
                    {followUpDetails.doctor}
                  </span>
                </span>
                <span className="flex items-center justify-center text-sm gap-1">
                  <CalenderIcon className="w-4 h-4" />
                  {followUpDetails.date}
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-blue/60">
              <CalenderIcon className="w-10 h-10 mb-3 opacity-40" />
              <span className="text-lg font-semibold mb-1">
                No Follow-up Scheduled
              </span>
              <span className="text-sm text-center max-w-[200px]">
                Once a follow-up is scheduled, details will appear here.
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2 text-blue">
        <div className="col-span-9 row-span-3 border border-light-blue rounded-md p-4">
          <ComplaintsSection
            complaints={complaints}
            handleComplaintChange={handleComplaintChange}
            addComplaint={addComplaint}
            removeComplaint={removeComplaint}
          />
        </div>
        <div className="col-span-3 row-span-3 justify-end mb-2 p-4">
          <div className="mb-6 text-sm">
            <Button
              className="w-full gap-2 py-3 !bg-[#158BE2] hover:shadow-xl"
              onClick={() => {
                setShowMedicalHistoryModal(true),
                  dispatch(getPatientMedicalHistory(data?.patientData?._id));
              }}
            >
              + <span>Add Medical History</span>
            </Button>
          </div>
          <div className="flex items-center w-full justify-between gap-2">
            <ResetButton
              onClick={handleReset}
              disabled={resetCooldown}
              className="w-full"
            />

            {/* SAVE BUTTON */}
            {/* <Button
              className="w-full"
              // className=" px-4 py-3 w-1/2 text-sm"
              onClick={handleSubmit}
              disabled={
                saveCooldown ||
                createVitalApi.isLoading ||
                updateVitalDetailsApi.isLoading
              }
            >
              {createVitalApi.isLoading || updateVitalDetailsApi.isLoading ? (
                <Spinner
                  size="w-5 h-5"
                  color="text-white"
                  border="border-white"
                />
              ) : (
                "Save"
              )}
            </Button> */}
            <SaveButton
              onClick={handleSubmit}
              className="w-full"
              isLoading={
                createVitalApi.isLoading || updateVitalDetailsApi.isLoading
              }
              disabled={
                saveCooldown ||
                createVitalApi.isLoading ||
                updateVitalDetailsApi.isLoading
              }
            />
          </div>
        </div>
      </div>

      {showMedicalHistoryModal && (
        <MedicalHistoryModal
          history={medicalHistory}
          open={showMedicalHistoryModal}
          onClose={() => setShowMedicalHistoryModal(false)}
          onSubmit={handleMedicalHistorySubmit}
          isLoading={addMedicalHistoryApi.isLoading}
          isHistoryApiLoading={isHistoryApiLoading}
        />
      )}
    </div>
  );
};

export default VitalCollection;

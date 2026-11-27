import TabSwitcher from "../../../components/TabSwitcher";
import { tabs } from "../helper";
import SearchBoxForPatient from "../components/SearchBoxForPatient";
import { FormProvider, useForm } from "react-hook-form";
import { apiResponseType } from "../../../utils/types";
import {
  defaultPatientFormValues,
  patientSchema,
} from "../validations/patientSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { dobToAge } from "../../../utils/common";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  createPatient,
  resetCreatePatientStatus,
  resetViewPatientByIdStatus,
  viewPatientById,
} from "../../../slices/patientSlice";
import useApiResponseHandler from "../../../hooks/useApiResponseHandler";
import toast from "react-hot-toast";
import {
  createPatientVisit,
  resetApiState,
} from "../../../slices/patientVisitSlice";
import { useSearchParams } from "react-router-dom";
import useNavigateTo from "../../../hooks/useNavigateTo";
import {
  getAppointmentById,
  resetGetAppointmentByIdStatus,
} from "../../../slices/appointmentSlice";
import { multipleErrorToastMessage } from "../../../utils/toastMessage";
import SaveButton from "../../../components/Buttons/SaveButton";
import ResetButton from "../../../components/Buttons/ResetButton";
import { ROUTES } from "../../../routes/helper";
import PatientDetails from "../components/form/PatientDetails";
import EmergencyContactDetails from "../components/form/EmergencyContactDetails";
import AddressDetails from "../components/form/AddressDetails";
import DepartmentDoctorDetails from "../components/form/DepartmentDoctorDetails";
import Appointments from "../components/form/Appointments";
import FollowUpDetails from "../components/form/FollowUpDetails";
import DisabledWrapper from "../../../components/DisabledWrapper";
import PatientRegisterSkeleton from "../components/PatientRegisterSkeleton";
import ReferredByDetails from "../components/form/ReferredByDetails";

const PatientRegister = () => {
  const goTo = useNavigateTo();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("userid");
  const [appointmentData, setAppointmentData] = useState([]);
  const [appointmentId, setAppointmentId] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const appId = searchParams.get("appid");

  const resolver =
    !(selectedPatient || (searchTerm && appId)) && zodResolver(patientSchema);
  const form = useForm({
    defaultValues: defaultPatientFormValues,
    resolver,
  });
  const { handleSubmit, setError, setValue, reset, clearErrors } = form;

  const dispatch = useDispatch();

  const { createPatientApi, viewPatientByIdApi } = useSelector(
    (state) => state.patientManagement
  );
  const { data, status, isLoading, error } = createPatientApi;
  const [followUp, setFollowUp] = useState([]);
  const [followUpId, setFollowUpId] = useState("");
  const { createPatientVisitApi } = useSelector((state) => state.patientVisit);
  const {
    data: viewPatientData,
    status: viewPatientStatus,
    error: viewPatientError,
  } = viewPatientByIdApi;

  const { getAppointmentByIdApi } = useSelector(
    (state) => state.appointmentManagement
  );
  const { data: appData, status: appStatus } = getAppointmentByIdApi;

  const onSubmit = (data) => {
    const { doctorId } = data;
    if (selectedPatient || searchTerm) {
      const visitType =
        viewPatientStatus === apiResponseType.success &&
        appStatus === apiResponseType.success
          ? "Appointment"
          : "Walkin";
      const patientid = viewPatientData?.response?._id;
      dispatch(
        createPatientVisit({
          doctorId,
          patientId: patientid,
          type: visitType,
          appointmentId: appointmentId || appData?._id,
          prevVisitAsFollowUp: followUp?.find((ele) => ele.id === followUpId),
          priority: +data.priority,
          referredBy: data.referredBy,
        })
      );
    } else {
      dispatch(
        createPatient({
          ...data,
          priority: +data.priority,
          visitType: "Walkin",
          prevVisitAsFollowUp: followUp?.find((ele) => ele.id === followUpId),
        })
      );
    }
    goTo(ROUTES.REGISTRATION_CREATE);
  };

  useApiResponseHandler({
    status,
    data,
    error,
    resetForm: () => reset(defaultPatientFormValues),
    resetReduxStatus: () => dispatch(resetCreatePatientStatus()),
    setFormError: setError,
  });

  useApiResponseHandler({
    status: createPatientVisitApi.status,
    data: createPatientVisitApi.data,
    error: createPatientVisitApi.error,
    resetForm: () => reset(defaultPatientFormValues),
    sideAction: () => setSelectedPatient(""),
    resetReduxStatus: () => dispatch(resetApiState("createPatientVisitApi")),
    setFormError: setError,
  });

  useEffect(() => {
    if (selectedPatient) {
      setValue("typeOfPatient", "oldPatient");
      dispatch(viewPatientById({ id: selectedPatient, from: "app" }));
    } else if (searchTerm) {
      setValue("typeOfPatient", "oldPatient");
      dispatch(viewPatientById({ id: searchTerm }));
      if (appId) {
        dispatch(getAppointmentById(appId));
      }
    }
  }, [selectedPatient, searchTerm]);

  useEffect(() => {
    if (appStatus === apiResponseType.success) {
      setAppointmentData([appData]);
      setValue("doctorId", appData.doctorId);
    }
  }, [appData]);

  useEffect(() => {
    if (
      viewPatientStatus === apiResponseType.success &&
      (selectedPatient || searchTerm)
    ) {
      toast.success(viewPatientData.message);
      const {
        _id,
        name,
        gender,
        bloodGroup,
        dateOfBirth,
        phoneNo,
        email,
        emergencyContact,
        address,
        followUpData,
      } = viewPatientData.response;
      if (viewPatientData?.response?.by === "appointment") {
        setAppointmentData(
          viewPatientData?.response?.appointmentData?.map((ele) => ({
            ...ele,
            id: ele._id,
            continue: false,
          }))
        );
      }
      setValue("name", name);
      setValue("gender", gender);
      setValue("bloodGroup", bloodGroup);
      setValue("dateOfBirth", dateOfBirth);
      setValue("age", dobToAge(dateOfBirth));
      setValue("phoneNo", phoneNo);
      setValue("email", email);
      setValue("emergencyContact", emergencyContact);
      setValue("address", address ? address : {});
      setValue("patientId", _id);
      setFollowUp(
        followUpData?.map((item) => ({
          doctorName: item.doctorName,
          date: item.followUp?.date,
          id: item.visitId,
          continue: false,
        })) || []
      );
      clearErrors();
    } else if (viewPatientStatus === apiResponseType.failed) {
      setSearchParams({});
      viewPatientError?.forEach((err) => {
        toast.error(err.message);
      });
    }
    // else if (!viewPatientStatus) {
    //   reset();
    // }
  }, [viewPatientByIdApi]);

  useEffect(() => {
    if (appStatus === apiResponseType.failed)
      multipleErrorToastMessage(getAppointmentByIdApi);
  }, [getAppointmentByIdApi.status]);

  useEffect(() => {
    if (createPatientVisitApi.status === apiResponseType.success) {
      dispatch(resetViewPatientByIdStatus());
      dispatch(resetGetAppointmentByIdStatus());
      setAppointmentId("");
      setAppointmentData([]);
      setFollowUpId("");
      setFollowUp([]);
    }
  }, [createPatientVisitApi.status]);

  useEffect(() => {
    return () => {
      dispatch(resetApiState("createPatientVisitApi"));
      dispatch(resetViewPatientByIdStatus());
      dispatch(resetGetAppointmentByIdStatus());
    };
  }, []);

  return (
    <div className="page">
      <TabSwitcher tabs={tabs} selected={1} />
      <SearchBoxForPatient
        setSelectedPatient={setSelectedPatient}
        showDataOnDropDown
      />
      {viewPatientByIdApi.isLoading === true ? (
        <PatientRegisterSkeleton />
      ) : (
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-2 gap-2 h-auto w-full">
              <div className="flex flex-col gap-2 row-span-2">
                <DisabledWrapper
                  where={selectedPatient || searchTerm}
                  className="row-span-2"
                  childrenClassName="card flex flex-col gap-5"
                >
                  <PatientDetails />
                  <EmergencyContactDetails />
                </DisabledWrapper>
                <ReferredByDetails />
              </div>

              <DisabledWrapper
                childrenClassName="card flex flex-col gap-3"
                where={selectedPatient || searchTerm}
              >
                <AddressDetails />
              </DisabledWrapper>
              {followUp.length > 0 && (
                <FollowUpDetails
                  followUpData={followUp}
                  setFollowUp={setFollowUp}
                  setFollowUpId={setFollowUpId}
                />
              )}
              <DepartmentDoctorDetails />
              {appointmentData.length > 0 && (
                <Appointments
                  appointmentData={appointmentData}
                  setAppointmentId={setAppointmentId}
                  setAppointmentData={setAppointmentData}
                />
              )}
            </div>
            <div className="flex items-center justify-between gap-5 my-5">
              <ResetButton
                onClick={() => {
                  reset(defaultPatientFormValues);
                  setSelectedPatient("");
                }}
              />
              <SaveButton
                type="submit"
                isLoading={isLoading || createPatientVisitApi.isLoading}
              />
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  );
};

export default PatientRegister;

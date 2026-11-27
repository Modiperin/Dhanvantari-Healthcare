import React, { useEffect, useState } from "react";
import SearchBoxForPatient from "../../patient-register/components/SearchBoxForPatient";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dobToAge } from "../../../utils/common";
import {
  resetViewPatientByIdStatus,
  viewPatientById,
} from "../../../slices/patientSlice";
import { useDispatch, useSelector } from "react-redux";
import { appointmentSchema } from "../validations/appointmentSchema";
import {
  createAppointmentNew,
  createAppointmentOld,
  resetCreateAppointmentStatus,
  resetCreateNewAppointmentStatus,
} from "../../../slices/appointmentSlice";
import useApiResponseHandler from "../../../hooks/useApiResponseHandler";
import { apiResponseType } from "../../../utils/types";
import toast from "react-hot-toast";
import { toastMessage } from "../../../utils/toastMessage";
import useNavigateTo from "../../../hooks/useNavigateTo";
import SaveButton from "../../../components/Buttons/SaveButton";
import ResetButton from "../../../components/Buttons/ResetButton";
import { ROUTES } from "../../../routes/helper";
import AppointmentDetails from "../components/form/AppointmentDetails";
import PatientDetails from "../../patient-register/components/form/PatientDetails";
import EmergencyContactDetails from "../../patient-register/components/form/EmergencyContactDetails";
import DisabledWrapper from "../../../components/DisabledWrapper";
import DepartmentDoctorDetails from "../../patient-register/components/form/DepartmentDoctorDetails";
import { defaultPatientFormValues } from "../../patient-register/validations/patientSchema";

const CreateAppointment = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);

  const dispatch = useDispatch();
  const goTo = useNavigateTo();

  const { createNewAppointmentApi, createAppointmentApi } = useSelector(
    (state) => state.appointmentManagement
  );

  const { data, status, error, isLoading } = createNewAppointmentApi;
  const {
    data: oldData,
    status: oldStatus,
    error: oldError,
    isLoading: oldLoading,
  } = createAppointmentApi;

  const { viewPatientByIdApi } = useSelector(
    (state) => state.patientManagement
  );
  const {
    data: viewPatientData,
    status: viewPatientStatus,
    error: viewPatientError,
  } = viewPatientByIdApi;

  const form = useForm({
    // defaultValues: defaultPatientFormValues,
    resolver: zodResolver(appointmentSchema),
  });
  const { handleSubmit, setError, setValue, reset, clearErrors } = form;

  const onSubmit = (data) => {
    const patientid = viewPatientData?.response?._id;
    if (!selectedPatient) {
      dispatch(
        createAppointmentNew({
          ...data,
          dateOfBirth: data?.dateOfBirth,
          date: data?.date,
          visitType: "Appointment",
        })
      );
    } else {
      dispatch(
        createAppointmentOld({
          ...data,
          dateOfBirth: data?.dateOfBirth,
          date: data?.date,
          visitType: "Appointment",
          patientId: patientid,
        })
      );
    }
  };

  useApiResponseHandler({
    status,
    data,
    error,
    resetForm: reset,
    resetReduxStatus: () => dispatch(resetCreateNewAppointmentStatus()),
    setFormError: setError,
  });

  useApiResponseHandler({
    oldStatus,
    oldData,
    oldError,
    resetForm: reset,
    resetReduxStatus: () => dispatch(resetCreateAppointmentStatus()),
    setFormError: setError,
  });

  useEffect(() => {
    return () => {
      dispatch(resetViewPatientByIdStatus());
    };
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      setValue("typeOfPatient", "oldPatient");
      dispatch(viewPatientById({ id: selectedPatient }));
    }
  }, [selectedPatient]);

  useEffect(() => {
    if (viewPatientStatus === apiResponseType.success) {
      toast.success(viewPatientData.message);
      const {
        name,
        gender,
        bloodGroup,
        dateOfBirth,
        phoneNo,
        email,
        emergencyContact,
      } = viewPatientData.response;
      setValue("name", name);
      setValue("gender", gender);
      setValue("bloodGroup", bloodGroup);
      setValue("dateOfBirth", dateOfBirth);
      setValue("age", dobToAge(dateOfBirth));
      setValue("phoneNo", phoneNo);
      setValue("email", email);
      setValue("emergencyContact", emergencyContact);
      clearErrors();
    } else if (viewPatientStatus === apiResponseType.failed) {
      viewPatientError?.forEach((err) => {
        toast.error(err.message);
      });
    }
  }, [viewPatientByIdApi]);

  useEffect(() => {
    const handleApiResponse = (apiResponse) => {
      toastMessage(apiResponse, setError);

      if (apiResponse.status === apiResponseType.success) {
        reset();
        dispatch(resetCreateAppointmentStatus());
        dispatch(resetCreateNewAppointmentStatus());
        goTo(ROUTES.APPOINTMENTS);
      }
    };

    if (
      createNewAppointmentApi.status === apiResponseType.success ||
      createNewAppointmentApi.status === apiResponseType.failed
    ) {
      handleApiResponse(createNewAppointmentApi);
    } else if (
      createAppointmentApi.status === apiResponseType.success ||
      createAppointmentApi.status === apiResponseType.failed
    ) {
      handleApiResponse(createAppointmentApi);
    }
  }, [createNewAppointmentApi, createAppointmentApi]);

  return (
    <>
      <div className="page">
        <SearchBoxForPatient
          setSelectedPatient={setSelectedPatient}
          showDataOnDropDown
        />
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-2 gap-2 h-auto w-full">
              <DisabledWrapper
                where={selectedPatient}
                className="row-span-full"
                childrenClassName="card flex flex-col gap-5"
              >
                <PatientDetails />
                <EmergencyContactDetails />
              </DisabledWrapper>

              <DepartmentDoctorDetails />
              <AppointmentDetails />
            </div>
            <div className="flex items-center gap-5 justify-start my-5">
              <ResetButton
                onClick={() => {
                  reset(defaultPatientFormValues);
                  setSelectedPatient("");
                }}
              />
              <SaveButton type="submit" isLoading={isLoading || oldLoading} />
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default CreateAppointment;

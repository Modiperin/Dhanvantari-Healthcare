import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import CommonInput from "../../../components/CommonInput";
import OptionGroup from "../../../components/OptionGroup";
import {
  bloodGroupOptions,
  countryOptions,
  genderOptions,
  relationOptions,
  stateOptions,
} from "../../patient-register/helper";
import { dobToAge, handleDOBChange } from "../../../utils/common";
import AntDatePicker from "../../../components/AntDatePicker";
import AntSearchableSelector from "../../../components/AntDesign/AntSearchableSelector";
import { useDispatch, useSelector } from "react-redux";
import { MedicalHistoryFields } from "../../OPD/components/MedicalHistoryFields";
import {
  resetUpdatePatientStatus,
  updatePatient,
} from "../../../slices/patientSlice";
import { apiResponseType } from "../../../utils/types";
import { toastMessage } from "../../../utils/toastMessage";
import toast from "react-hot-toast";
import EditPatientDetailsSkeleton from "../loader/EditPatientDetailsSkeleton";
import CancelButton from "../../../components/Buttons/CancelButton";
import SaveButton from "../../../components/Buttons/SaveButton";

const EditPatientDetails = ({ setMode, updateData }) => {
  const form = useForm({});
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState,
    control,
    setValue,
    reset,
    setError,
  } = form;
  const { errors, isDirty } = formState;

  const { getPatientMedicalHistoryApi } = useSelector(
    (state) => state.patientManagement
  );
  const { data: patientMedicalHistory } = getPatientMedicalHistoryApi;
  const { updatePatientApi, viewPatientByIdApi } = useSelector(
    (state) => state.patientManagement
  );
  const { data: viewPatientData, isLoading } = viewPatientByIdApi;

  const { status: updatePatientStatus, isLoading: updateLoader } =
    updatePatientApi;

  const [medicalHistory, setMedicalHistory] = useState({});

  useEffect(() => {
    setMedicalHistory(patientMedicalHistory?.response?.medicalHistory);
  }, [getPatientMedicalHistoryApi]);

  const [habits, setHabits] = useState({
    alcohol: medicalHistory?.alcohol ?? false,
    diabetes: medicalHistory?.diabetes ?? false,
    smoking: medicalHistory?.smoking ?? false,
    tobacco: medicalHistory?.tobacco ?? false,
  });

  const initialHabitsRef = useRef({
    alcohol: medicalHistory?.alcohol ?? false,
    diabetes: medicalHistory?.diabetes ?? false,
    smoking: medicalHistory?.smoking ?? false,
    tobacco: medicalHistory?.tobacco ?? false,
  });

  useEffect(() => {
    reset({
      foodAllergy: medicalHistory?.foodAllergy ?? [],
      drugAllergy: medicalHistory?.drugAllergy ?? [],
      pastSurgical: medicalHistory?.pastSurgical ?? [],
      procedure: medicalHistory?.procedure ?? [],
      currentlyTakingMedicines: medicalHistory?.currentlyTakingMedicines ?? [],
      name: viewPatientData?.response?.name ?? "",
      gender: viewPatientData?.response?.gender ?? "",
      bloodGroup: viewPatientData?.response?.bloodGroup ?? "",
      dateOfBirth: viewPatientData?.response?.dateOfBirth ?? "",
      phoneNo: viewPatientData?.response?.phoneNo ?? "",
      email: viewPatientData?.response?.email ?? "",
      emergencyContact: {
        name: viewPatientData?.emergencyContact?.response?.name ?? "",
        phoneNo: viewPatientData?.emergencyContact?.response?.phoneNo ?? "",
        relationship:
          viewPatientData?.emergencyContact?.response?.relationship ?? "",
      },
      address: {
        houseName: viewPatientData?.response?.address?.houseName ?? "",
        locality: viewPatientData?.response?.address?.locality ?? "",
        area: viewPatientData?.response?.address?.area ?? "",
        city: viewPatientData?.response?.address?.city ?? "",
        pincode: viewPatientData?.response?.address?.pincode ?? "",
        digipin: viewPatientData?.response?.address?.digipin ?? "",
        state: viewPatientData?.response?.address?.state ?? "",
        country: viewPatientData?.response?.address?.country ?? "India",
      },
    });
    setHabits({
      alcohol: medicalHistory?.alcohol ?? false,
      diabetes: medicalHistory?.diabetes ?? false,
      smoking: medicalHistory?.smoking ?? false,
      tobacco: medicalHistory?.tobacco ?? false,
    });
    initialHabitsRef.current = {
      alcohol: medicalHistory?.alcohol ?? false,
      diabetes: medicalHistory?.diabetes ?? false,
      smoking: medicalHistory?.smoking ?? false,
      tobacco: medicalHistory?.tobacco ?? false,
    };
    // }, [history, reset]);
  }, [medicalHistory, reset, viewPatientData]);

  const isHabitsDirty = Object.keys(habits).some(
    (key) => habits[key] !== initialHabitsRef.current[key]
  );

  useEffect(() => {
    if (viewPatientData?.response?.dateOfBirth !== undefined)
      setValue("age", dobToAge(viewPatientData?.response?.dateOfBirth));
  }, [viewPatientData?.response?.dateOfBirth]);

  const onSubmit = (data) => {
    Object.assign(data, habits);
    dispatch(updatePatient({ id: viewPatientData?.response?._id, data }));
  };

  useEffect(() => {
    if (updatePatientStatus === apiResponseType.failed) {
      toastMessage(updatePatientApi, setError);
    } else if (updatePatientStatus === apiResponseType.success) {
      toast.success("Patient details updated successfully");
      setMode(false);
      dispatch(resetUpdatePatientStatus());
      updateData(); // Call the updateData function to refresh the patient data
    }
  }, [updatePatientStatus]);
  return (
    <>
      {isLoading && !viewPatientData?.response ? (
        <EditPatientDetailsSkeleton />
      ) : (
        <div>
          <div className="flex mb-2 items-end w-full justify-end">
            <CancelButton onClick={() => setMode(false)} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Left side */}
              <div className="card h-full">
                <h2 className="title mt-0">Basic Informations</h2>
                <div className="grid py-2 grid-cols-4 gap-5">
                  <div className="col-span-4">
                    <CommonInput
                      labelName="Name(As per Adharcard)"
                      id="name"
                      name="name"
                      register={register}
                      errors={errors}
                      required={true}
                    />
                  </div>
                  <div className="flex col-span-2 w-full items-center">
                    <OptionGroup
                      name="gender"
                      // labelName="Gender"
                      options={genderOptions}
                      register={register}
                      setValue={setValue}
                      required={true}
                      errors={errors}
                    />
                  </div>
                  <div className="flex col-span-2 w-full items-center">
                    <AntSearchableSelector
                      id="bloodGroup"
                      name="bloodGroup"
                      labelName="Blood Group"
                      control={control}
                      errors={errors}
                      options={bloodGroupOptions}
                    />
                  </div>
                  <div className="col-span-2">
                    <AntDatePicker
                      id="dateOfBirth"
                      name="dateOfBirth"
                      label="Date of Birth"
                      control={control}
                      errors={errors}
                      required={true}
                      onChange={(date, dateString) =>
                        handleDOBChange(date, dateString, setValue)
                      }
                    />
                  </div>
                  {/* Age */}
                  <div className="col-span-2">
                    <CommonInput
                      labelName="Age"
                      id="age"
                      name="age"
                      register={register}
                      errors={errors}
                      disabled={true}
                      type="number"
                    />
                  </div>
                  {/* Phone Number */}
                  <div className="col-span-2">
                    <CommonInput
                      labelName="Phone"
                      id="phoneNo"
                      name="phoneNo"
                      register={register}
                      errors={errors}
                      required={true}
                    />
                  </div>

                  {/* Email ID */}
                  <div className="col-span-2">
                    <CommonInput
                      labelName="Email"
                      id="email"
                      name="email"
                      register={register}
                      errors={errors}
                      required
                    />
                  </div>
                </div>

                {/* Emergency Contact Details */}
                <div className="my-4">
                  <h2 className="title mb-4">Emergency Contact Details</h2>
                  <div className="grid grid-cols-4 gap-6">
                    <div className="col-span-2">
                      <CommonInput
                        labelName="Name"
                        id="emergencyContact.name"
                        name="emergencyContact.name"
                        register={register}
                        errors={errors}
                        required
                      />
                    </div>
                    {/* Relationship  */}
                    <div className="col-span-2">
                      <AntSearchableSelector
                        id="emergencyContact.relationship"
                        name="emergencyContact.relationship"
                        labelName="Relationship"
                        options={relationOptions}
                        control={control}
                        errors={errors}
                        required
                      />
                    </div>
                    {/* Contact Number */}
                    <div className="col-span-4">
                      <CommonInput
                        labelName="Contact"
                        id="emergencyContact.phoneNo"
                        name="emergencyContact.phoneNo"
                        register={register}
                        errors={errors}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="card">
                  <h2 className="title mt-0">Address Details</h2>
                  <div className="grid py-2 grid-cols-4 gap-5">
                    {/* House Name */}
                    <div className="col-span-2">
                      <CommonInput
                        labelName="House Name"
                        id="address.houseName"
                        name="address.houseName"
                        register={register}
                        errors={errors}
                        required
                      />
                    </div>
                    {/* Locality */}
                    <div className="col-span-2">
                      <CommonInput
                        labelName="Locality"
                        id="address.locality"
                        name="address.locality"
                        register={register}
                        errors={errors}
                        required
                      />
                    </div>
                    {/* Area */}
                    <div className="col-span-2">
                      <CommonInput
                        labelName="Area"
                        id="address.area"
                        name="address.area"
                        register={register}
                        errors={errors}
                        required
                      />
                    </div>
                    {/* City */}
                    <div className="col-span-2">
                      <CommonInput
                        labelName="City"
                        id="address.city"
                        name="address.city"
                        register={register}
                        errors={errors}
                        required
                      />
                    </div>
                    {/* Pincode */}
                    <div className="col-span-2">
                      <CommonInput
                        labelName="Pincode"
                        id="address.pincode"
                        name="address.pincode"
                        register={register}
                        errors={errors}
                        type="number"
                        required
                      />
                    </div>
                    {/* Digipin */}
                    <div className="col-span-2">
                      <CommonInput
                        labelName="Digipin"
                        id="address.digipin"
                        name="address.digipin"
                        register={register}
                        errors={errors}
                      />
                    </div>
                    {/* state */}
                    <div className="col-span-2">
                      <AntSearchableSelector
                        id="address.state"
                        name="address.state"
                        labelName="State"
                        options={stateOptions}
                        control={control}
                        errors={errors}
                        required
                      />
                    </div>
                    {/* country */}
                    <div className="col-span-2">
                      <AntSearchableSelector
                        id="address.country"
                        name="address.country"
                        labelName="Country"
                        options={countryOptions}
                        control={control}
                        errors={errors}
                        required
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="card">
                  <h2 className="title">Medical History</h2>

                  <MedicalHistoryFields
                    habits={habits}
                    setHabits={setHabits}
                    control={control}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              {/* <Button
                disabled={
                  (!isDirty && !isHabitsDirty) || isLoading || updateLoader
                }
                type="submit"
              >
                {isLoading || updateLoader ? (
                  <Spinner
                    size="w-5 h-5"
                    color="text-white"
                    border="border-white"
                  />
                ) : (
                  "Update details"
                )}
              </Button> */}
              <SaveButton
                isLoading={isLoading || updateLoader}
                disabled={
                  (!isDirty && !isHabitsDirty) || isLoading || updateLoader
                }
                type="submit"
                name={"Update patient"}
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default EditPatientDetails;

import CommonInput from "../../../../components/CommonInput";
import { useForm } from "react-hook-form";
import FormStepperButtons from "../FormStepperButtons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import {
  createDoctor,
  deleteDoctor,
  fetchDepartments,
  fetchDoctors,
  markStepCompleted,
  resetCreateDoctorStatus,
  resetDeleteDoctorStatus,
} from "../../../../slices/hospitalOnboardingSlice";
import toast from "react-hot-toast";
import { Roles } from "../../../../utils/roles";
import { handleDOBChange, removeEmptyValues } from "../../../../utils/common";
import { doctordetailSchema } from "./validations/doctorDetails";
import { useEffect, useMemo } from "react";
import { getDataFromCookies } from "../../../../services/cookies";
import { apiResponseType, HeaderType } from "../../../../utils/types";
import TableGrid from "../../../../components/table/TableGrid";
import AntDatePicker from "../../../../components/AntDatePicker";
import TrashIcon from "../../../../assets/svg/trash.svg?react";
import {
  activeTypeStatus,
  doctorTypeOptions,
  qualifications,
} from "../../../administration/helper";
import { genderOptions } from "../../../patient-register/helper";
import AntSearchableSelector from "../../../../components/AntDesign/AntSearchableSelector";
import OptionGroup from "../../../../components/OptionGroup";
import AntMultiSelector from "../../../../components/AntDesign/AntMultiSelector";
import SaveButton from "../../../../components/Buttons/SaveButton";

const DoctorsDetails = ({ previousStepHandler, nextStepHandler }) => {
  const dispatch = useDispatch();
  const doctors = useSelector(
    (state) => state.hospitalOnboarding.formData.doctors
  );
  const DoctListIsLoading = useSelector(
    (state) => state.hospitalOnboarding.doctorsIsLoading
  );
  const departments = useSelector(
    (state) => state.hospitalOnboarding.formData.departments
  );
  const curStep = useSelector((state) => state.hospitalOnboarding.currentStep);
  const completedSteps = useSelector(
    (state) => state.hospitalOnboarding.completedSteps
  );

  const departmentOptions = departments.map((dept) => ({
    label: dept.name,
    value: dept.id,
  }));
  const { createDoctorApi, deleteDoctorApi } = useSelector(
    (state) => state.hospitalOnboarding
  );
  const { status, isLoading, error, data } = createDoctorApi;
  const { status: deleteDoctorStatus, data: deleteDoctorData } =
    deleteDoctorApi;
  const form = useForm({
    defaultValues: {
      name: "",
      departmentId: "",
      active: true,
      gender: "",
      age: "",
      email: "",
      phoneNo: "",
      dateOfBirth: "",
      qualifications: [],
      type: "full-time",
    },
    resolver: zodResolver(doctordetailSchema),
  });
  const {
    register,
    control,
    handleSubmit,
    formState,
    reset,
    setValue,
    setError,
  } = form;
  const { errors } = formState;

  const onSubmit = async (data) => {
    // console.log("form submitted", data);
    const newData = removeEmptyValues(data, [""]);
    dispatch(
      createDoctor({
        ...newData,
        role: Roles.doctor,
        age: +newData.age,
        from: "onboarding",
      })
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this doctor?")) {
      dispatch(deleteDoctor(id));
    }
  };

  const handleNextStep = () => {
    if (doctors.length === 0) {
      toast.error("Please add at least one doctor to proceed.");
      return;
    }
    dispatch(markStepCompleted(curStep));
    nextStepHandler();
  };

  const headerData = [
    {
      name: "Doctor Name",
      value: "name",
      _class: "col-span-2",
    },
    {
      name: "Department Name",
      value: "departmentName",
      _class: "col-span-2",
    },
    {
      name: "Status",
      value: "active",
      type: HeaderType.statusBudge,
    },

    {
      name: "Gender",
      value: "gender",
    },
    {
      name: "Qualifications",
      value: "qualifications",
      _class: "col-span-2",
      type: HeaderType.tooltip,
    },
    {
      name: "Age",
      value: "age",
    },
    {
      name: "Actions",
      value: "actions",
      _class: "col-span-3",
      type: HeaderType.dynamicAction,
      actions: [
        {
          label: "Delete",
          icon: <TrashIcon />,
          onClick: (row) => handleDelete(row.id),
        },
      ],
    },
  ];

  const getQualificationOptions = useMemo(
    () => qualifications.map((ele) => ({ value: ele, label: ele })),
    [qualifications]
  );

  useEffect(() => {
    const token = getDataFromCookies("hospitalToken");
    if (token) {
      dispatch(fetchDepartments());
      dispatch(fetchDoctors());
    }
  }, []);

  useEffect(() => {
    if (status === apiResponseType.success) {
      toast.success(data.message);
      reset();
      dispatch(fetchDoctors());
      dispatch(resetCreateDoctorStatus());
      if (!completedSteps.includes(curStep)) {
        dispatch(markStepCompleted(curStep));
      }
    } else if (status === apiResponseType.failed) {
      // console.log({ error });
      error.map((error) => {
        setError(error.field, {
          type: "server",
          message: error.message,
        });
      });
    }
  }, [status]);

  useEffect(() => {
    if (deleteDoctorStatus === apiResponseType.success) {
      toast.success(deleteDoctorData.message);
      dispatch(fetchDoctors());
      dispatch(resetDeleteDoctorStatus());
    } else if (deleteDoctorStatus === apiResponseType.failed) {
      // console.log({ error });
      error.map((error) => {
        toast.error(error.message);
      });
    }
  }, [deleteDoctorStatus]);

  return (
    <div>
      <h2 className="text-xl lg:text-2xl font-medium text-blue mb-5">
        Doctors Details
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-12 gap-4 bg-white rounded-xl">
          {/* Name */}
          <div className="col-span-6 lg:col-span-3">
            <CommonInput
              labelName="Name"
              id="name"
              name="name"
              register={register}
              errors={errors}
            />
          </div>

          {/* Email ID */}
          <div className="col-span-6 lg:col-span-5">
            <CommonInput
              labelName="Email Id"
              id="email"
              name="email"
              register={register}
              errors={errors}
            />
          </div>

          {/* Phone Number */}
          <div className="col-span-6 lg:col-span-4">
            <CommonInput
              labelName="Phone No (Optional)"
              id="phoneNo"
              name="phoneNo"
              register={register}
              errors={errors}
            />
          </div>

          {/* Active Status */}
          <div className="col-span-6 lg:col-span-3">
            <AntSearchableSelector
              id="active"
              name="active"
              labelName="Active Status"
              options={activeTypeStatus}
              control={control}
              errors={errors}
              required
            />
          </div>

          {/* DOB */}
          <div className="col-span-6 lg:col-span-3">
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

          {/* Gender */}
          <div className="col-span-6 lg:col-span-3">
            <OptionGroup
              name="gender"
              // labelName="Gender"
              options={genderOptions}
              register={register}
              required={true}
              errors={errors}
            />
          </div>

          {/* Age */}
          <div className="col-span-6 lg:col-span-3">
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

          {/* Qualification */}
          <div className="col-span-6 lg:col-span-4">
            <AntMultiSelector
              id="qualifications"
              name="qualifications"
              labelName="Qualifications"
              options={getQualificationOptions}
              control={control}
              errors={errors}
              required
            />
          </div>
          <div className="col-span-6 lg:col-span-4">
            <AntSearchableSelector
              id="type"
              name="type"
              labelName="Type Of Doctor"
              options={doctorTypeOptions}
              control={control}
              errors={errors}
              required
            />
          </div>

          <div className="col-span-6 lg:col-span-4">
            <AntSearchableSelector
              id="departmentId"
              name="departmentId"
              labelName="Department Name"
              options={departmentOptions}
              control={control}
              errors={errors}
              required
            />
          </div>
        </div>
        {/* Save Button */}
        <div className="flex justify-end items-end w-full my-2">
          <SaveButton type="submit" isLoading={isLoading} />
        </div>
      </form>

      <TableGrid
        data={doctors}
        columns={headerData}
        isLoading={DoctListIsLoading}
      />
      <FormStepperButtons
        curStep={curStep}
        previousStepHandler={previousStepHandler}
        nextStepHandler={handleNextStep}
      />
    </div>
  );
};

export default DoctorsDetails;

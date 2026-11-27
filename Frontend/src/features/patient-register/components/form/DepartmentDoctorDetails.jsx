import React, { useEffect, useState } from "react";
import AntSearchableSelector from "../../../../components/AntDesign/AntSearchableSelector";
import { patientTypeOptions, priorityOptions } from "../../helper";
import CommonTextarea from "../../../../components/CommonTextarea";
import { useFormContext } from "react-hook-form";
import { getDepartmentList } from "../../../../slices/departmentSlice";
import { doctorAvailability } from "../../../../slices/roasterSlice";
import { formatDate } from "../../../../utils/dateAndTime";
import { useDispatch, useSelector } from "react-redux";
import { apiResponseType } from "../../../../utils/types";

const DepartmentDoctorDetails = () => {
  const { register, control, formState, watch } = useFormContext();
  const { errors } = formState;
  const dispatch = useDispatch();
  const { doctorAvailabilityApi } = useSelector((state) => state.roaster);
  const { data: doctorData, status: doctorStatus } = doctorAvailabilityApi;
  const { getDepartmentListApi } = useSelector(
    (state) => state.departmentManagement
  );
  const [doctorOptions, setDoctorOptions] = useState([]);

  const departmentOptions =
    getDepartmentListApi.data?.response?.list?.map((dept) => ({
      label: dept.name,
      value: dept._id,
    })) || [];

  useEffect(() => {
    if (doctorStatus === apiResponseType.success) {
      setDoctorOptions(
        doctorData?.response?.list?.map((doct) => ({
          label: `${doct.name}`,
          value: doct.userId,
        }))
      );
    }
  }, [doctorData]);
  const departmentId = watch("departmentId");

  useEffect(() => {
    setDoctorOptions(
      doctorData
        ?.filter((doct) => doct.departmentId === departmentId)
        ?.map((doct) => ({
          label: doct.name,
          value: doct.userId,
        }))
    );
  }, [departmentId]);

  useEffect(() => {
    dispatch(getDepartmentList());
    dispatch(doctorAvailability({ date: formatDate(new Date()) }));
  }, []);

  return (
    <div className="card flex flex-col gap-3">
      <h2 className="title">Department & Doctor Details</h2>
      <div className="grid grid-cols-4 gap-3">
        <div className="col-span-2">
          <AntSearchableSelector
            id="departmentId"
            name="departmentId"
            labelName="Department"
            options={departmentOptions}
            control={control}
            errors={errors}
            required
          />
        </div>
        <div className="col-span-2">
          <AntSearchableSelector
            id="doctorId"
            name="doctorId"
            labelName="Doctor"
            options={doctorOptions}
            control={control}
            errors={errors}
            required
            message={
              <div
                role="alert"
                className="text-center text-base font-semibold text-red-600 bg-red-50 p-2 rounded-md"
              >
                No doctors from this department are available as per today’s
                roster.
              </div>
            }
          />
        </div>
        {/* type of patient */}
        <div className="col-span-2">
          <AntSearchableSelector
            id="typeOfPatient"
            name="typeOfPatient"
            labelName="Type of Patient"
            options={patientTypeOptions}
            control={control}
            errors={errors}
            disabled
          />
        </div>
        {/* priority options */}
        <div className="col-span-2">
          <AntSearchableSelector
            id="priority"
            name="priority"
            labelName="Priority"
            options={priorityOptions}
            control={control}
            errors={errors}
          />
        </div>
        {/* Visit Notes */}
        <div className="col-span-4">
          <CommonTextarea
            labelName="Visit Note"
            id="visitNote"
            name="visitNote"
            register={register}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
};

export default DepartmentDoctorDetails;

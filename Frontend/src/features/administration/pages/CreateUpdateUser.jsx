import { accessTypeOptions, activeTypeStatus, tabs } from "../helper";
import TabSwitcher from "../../../components/TabSwitcher";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultValueForUser, userSchema } from "../validations/staffSchema";
import CommonInput from "../../../components/CommonInput";
import { dobToAge, handleDOBChange } from "../../../utils/common";
import PasswordInput from "../../../components/PasswordInput";
import { useEffect } from "react";
import UsersGrid from "../components/UsersGrid";
import { useDispatch, useSelector } from "react-redux";
import { getProfileList } from "../../../slices/profileSlice";
import { getDepartmentList } from "../../../slices/departmentSlice";
import {
  createStaff,
  getStaffById,
  getStaffList,
  resetCreateStaffStatus,
  resetUpdateStaffStatus,
  updateStaff,
} from "../../../slices/staffSlice";
import { Roles } from "../../../utils/roles";
import { apiResponseType } from "../../../utils/types";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import useNavigateTo from "../../../hooks/useNavigateTo";
import AntDatePicker from "../../../components/AntDatePicker";
import { formatDate } from "../../../utils/dateAndTime";
import { genderOptions } from "../../patient-register/helper";
import AntSearchableSelector from "../../../components/AntDesign/AntSearchableSelector";
import OptionGroup from "../../../components/OptionGroup";
import { ROUTES } from "../../../routes/helper";
import CancelButton from "../../../components/Buttons/CancelButton";
import SaveButton from "../../../components/Buttons/SaveButton";

const CreateUpdateUser = () => {
  const { id } = useParams();
  const goTo = useNavigateTo();
  const form = useForm({
    defaultValues: defaultValueForUser,
    resolver: zodResolver(userSchema),
  });
  const {
    register,
    formState,
    control,
    setValue,
    handleSubmit,
    watch,
    resetField,
    setError,
    reset,
    clearErrors,
  } = form;
  const { errors } = formState;

  const dispatch = useDispatch();
  const { getProfileListApi } = useSelector((state) => state.profileManagement);
  const { getDepartmentListApi } = useSelector(
    (state) => state.departmentManagement
  );
  const { createStaffApi, getStaffByIdApi, updateStaffApi, getStaffListApi } =
    useSelector((state) => state.staffManagement);
  const { data: profileData } = getProfileListApi;
  const { data: getDepartmentData } = getDepartmentListApi;
  const { isLoading, data, error, status } = createStaffApi;
  const { data: getStaffData, status: getStaffStauts } = getStaffByIdApi;
  const {
    isLoading: updateStaffLoading,
    data: updateStaffData,
    error: updateStaffError,
    status: updateStaffStatus,
  } = updateStaffApi;

  const profileOptions =
    profileData?.response?.list?.map((profile) => ({
      label: profile.name,
      value: profile._id,
    })) || [];

  const accessType = watch("accessType");

  const departmentOptions =
    getDepartmentData?.response?.list?.map((dept) => ({
      label: dept.name,
      value: dept._id,
    })) || [];

  const onSubmit = async (data) => {
    console.log({ data });
    // const newData = {
    //   ...data,
    //   accessEndTime,
    //   // data?.accessEndTime && format(data?.accessEndTime, "dd-M-yyyy"),
    // };
    if (id) {
      dispatch(updateStaff({ id, data: { ...data, role: Roles.team } }));
    } else {
      dispatch(createStaff({ ...data, role: Roles.team }));
    }
  };

  useEffect(() => {
    if (accessType === "P") {
      resetField("accessEndTime");
    }
  }, [accessType, resetField]);

  useEffect(() => {
    dispatch(getProfileList());
    dispatch(getDepartmentList());
    dispatch(getStaffList());
  }, [dispatch]);

  useEffect(() => {
    if (status === apiResponseType.success) {
      toast.success(data.message);
      reset(defaultValueForUser);
      dispatch(resetCreateStaffStatus());
      dispatch(getStaffList());
    }
    if (status === apiResponseType.failed) {
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
    reset(defaultValueForUser);
    if (id) {
      clearErrors();
      dispatch(getStaffById(id));
    }
  }, [id]);

  useEffect(() => {
    if (getStaffStauts === apiResponseType.success && id) {
      setValue("name", getStaffData?.name);
      setValue("departmentId", getStaffData?.departmentId);
      setValue("active", getStaffData?.active);
      setValue("dateOfBirth", getStaffData?.dateOfBirth);
      setValue("gender", getStaffData?.gender);
      setValue("userName", getStaffData?.userName);
      setValue("profileId", getStaffData?.profileId);
      setValue("accessType", getStaffData?.accessType);
      setValue("age", dobToAge(getStaffData?.dateOfBirth));
      setValue(
        "accessEndTime",
        getStaffData?.accessEndTime
          ? formatDate(getStaffData?.accessEndTime)
          : ""
      );
    }
  }, [getStaffData, id]);

  useEffect(() => {
    if (updateStaffStatus === apiResponseType.success) {
      toast.success(updateStaffData);
      dispatch(resetUpdateStaffStatus());
      reset(defaultValueForUser);
      goTo(ROUTES.STAFF_MANAGEMENT);
    }
    if (updateStaffStatus === apiResponseType.failed) {
      updateStaffError.map((error) => {
        setError(error.field, {
          type: "server",
          message: error.message,
        });
      });
      dispatch(resetUpdateStaffStatus());
    }
  }, [updateStaffStatus]);

  useEffect(() => {
    return () => {
      clearErrors();
      reset(defaultValueForUser);
      dispatch(resetCreateStaffStatus());
      dispatch(resetUpdateStaffStatus());
    };
  }, []);

  return (
    <div className="page">
      <TabSwitcher tabs={tabs} selected={3} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="text-blue my-3 flex flex-col items-start gap-3 w-full"
      >
        <div className="flex w-full justify-between">
          <h2 className="text-xl lg:text-2xl font-medium text-blue">
            Staff {id ? "Updation" : "Creation"}{" "}
          </h2>
          <CancelButton />
        </div>
        <div className="grid grid-cols-4 gap-3 w-full">
          {/* Full Name */}
          <div className="col-span-2">
            <CommonInput
              labelName="Name"
              id="name"
              name="name"
              register={register}
              errors={errors}
            />
          </div>

          {/* Department Name  */}
          <div className="col-span-2">
            <AntSearchableSelector
              id="departmentId"
              name="departmentId"
              labelName="Department Name"
              options={departmentOptions}
              control={control}
              errors={errors}
            />
          </div>

          {/* active Status */}
          <div className="col-span-2 lg:col-span-1">
            <AntSearchableSelector
              id="active"
              name="active"
              labelName="Active Status*"
              options={activeTypeStatus}
              control={control}
              errors={errors}
            />
          </div>

          {/* DOB */}
          <div className="col-span-2 lg:col-span-1">
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
          <div className="col-span-2 lg:col-span-1">
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
          <div className="col-span-2 lg:col-span-1">
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

          {/* user name */}
          <div className="col-span-2">
            <CommonInput
              labelName="User Name"
              id="userName"
              name="userName"
              register={register}
              errors={errors}
            />
          </div>

          {/* password */}
          {!id && (
            <div className="col-span-2">
              <PasswordInput
                labelName="Password"
                id="password"
                name="password"
                register={register}
                errors={errors}
                type="password"
              />
            </div>
          )}

          {/* Profile  */}
          <div className="col-span-2">
            <AntSearchableSelector
              id="profileId"
              name="profileId"
              labelName="Profile Name"
              options={profileOptions}
              control={control}
              errors={errors}
            />
          </div>

          {/* Access Type  */}
          <div className="col-span-2">
            <AntSearchableSelector
              id="accessType"
              name="accessType"
              labelName="Access Type"
              options={accessTypeOptions}
              control={control}
              errors={errors}
            />
          </div>

          {/* Access End Time */}
          {accessType === "T" && (
            <div className="col-span-1">
              <AntDatePicker
                id="accessEndTime"
                name="accessEndTime"
                label="Access End Time"
                control={control}
                errors={errors}
                required={true}
                disabled={accessType === "T" ? false : true}
              />
            </div>
          )}
        </div>

        <div className="flex w-full items-center justify-end gap-3 mt-5">
          <SaveButton
            isLoading={isLoading || updateStaffLoading}
            type="submit"
            name={id ? "Update" : "Create"}
          />
        </div>
      </form>

      {(!getStaffListApi.isLoading && getStaffListApi?.data == 0) || id ? (
        ""
      ) : (
        <UsersGrid />
      )}
    </div>
  );
};

export default CreateUpdateUser;

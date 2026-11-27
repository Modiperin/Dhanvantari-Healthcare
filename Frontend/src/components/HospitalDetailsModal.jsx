import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import User from "../assets/svg/user.svg?react";
import EditIcon from "../assets/svg/edit.svg?react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import CommonInput from "./CommonInput";
import SaveButton from "./Buttons/SaveButton";
import Skeleton from "./Skeleton";
import AntDatePicker from "../components/AntDatePicker";
import CancelButton from "./Buttons/CancelButton";
import OptionGroup from "./OptionGroup";
import { genderOptions } from "../features/patient-register/helper";
import {
  resetUpdateStaffBasicDetailsStatus,
  updateStaffBasicDetails,
} from "../slices/staffSlice";
import { handleDOBChange } from "../utils/common";
import { apiResponseType } from "../utils/types";
import toast from "react-hot-toast";
import { toastMessage } from "../utils/toastMessage";
import {
  fetchUserSettings,
  resetUpdateHospitalDetailsStatus,
  updateHospitalDetails,
} from "../slices/userSlice";
import Button from "./Buttons/Button";
import { uploadToS3 } from "../utils/aws";

const ProfileCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-blue-border border-opacity-20 p-6">
      <div className="text-center mb-6">
        {/* Avatar Skeleton */}
        <div className="w-20 h-20 mx-auto mb-4">
          <Skeleton circle className="w-full h-full" />
        </div>

        {/* Name Skeleton */}
        <Skeleton className="h-6 w-48 mx-auto mb-3" />

        {/* Role Badge Skeleton */}
        <Skeleton className="h-6 w-32 mx-auto" />
      </div>

      {/* Quick Info Skeleton */}
      <div className="space-y-3">
        <div className="flex items-center">
          <Skeleton circle className="w-4 h-4 mr-3" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex items-center">
          <Skeleton circle className="w-4 h-4 mr-3" />
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="flex items-center">
          <Skeleton circle className="w-4 h-4 mr-3" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center">
          <Skeleton circle className="w-4 h-4 mr-3" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </div>
  );
};

const defaultValues = {
  name: "",
  email: "",
  phoneNo: "",
  address: "",
};

const HospitalDetailsModal = ({ open = "", onClose }) => {
  const fileInputRef = useRef();
  const [logoChanged, setLogoChanged] = useState(false);
  const [isHospitalEdit, setIsHospitalEdit] = useState(false);
  const [isBasicDetailsEdit, setIsBasicDetailsEdit] = useState(false);
  const { userInfo, isLoading, updateHospitalDetailsApi } = useSelector(
    (state) => state.user
  );
  const { updateStaffBasicDetailsApi } = useSelector(
    (state) => state.staffManagement
  );

  const hospitalDetails = useMemo(
    () => userInfo?.response?.hospitalData || {},
    [userInfo]
  );
  const userDetails = useMemo(() => userInfo?.response || {}, [userInfo]);
  const [avatarPreview, setAvatarPreview] = useState(
    hospitalDetails?.logo || ""
  );
  const [imageContentType, setImageContentType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const dispatch = useDispatch();
  const basicDetailsForm = useForm({
    defaultValues,
  });
  const {
    register,
    handleSubmit,
    formState,
    reset,
    control,
    setError,
    setValue,
  } = basicDetailsForm;
  const { errors, isDirty } = formState;

  const HospitalDetailsForm = useForm({
    defaultValues,
  });
  const {
    register: hospRegister,
    handleSubmit: hospHandleSubmit,
    formState: hospFormState,
    reset: hospReset,
    setError: hospSetError,
  } = HospitalDetailsForm;
  const { errors: hospErrors, isDirty: hospIsDirty } = hospFormState;

  const getRoleLabel = (role) => {
    const roles = {
      S: "Super Admin",
      A: "Admin",
      D: "Doctor",
      N: "Nurse",
      R: "Receptionist",
      T: "Staff Member",
    };
    return roles[role] || role;
  };

  const onSubmit = (data) => {
    dispatch(updateStaffBasicDetails({ id: userDetails.userId, data }));
  };

  const hospOnsubmit = (data) => {
    dispatch(updateHospitalDetails(data));
  };

  useEffect(() => {
    if (updateStaffBasicDetailsApi?.status === apiResponseType.success) {
      toast.success("Profile updated successfully");
      setIsBasicDetailsEdit(false);
      dispatch(fetchUserSettings());
    } else if (updateStaffBasicDetailsApi?.status === apiResponseType.failed) {
      toastMessage(updateStaffBasicDetailsApi, setError);
    }
  }, [updateStaffBasicDetailsApi]);

  useEffect(() => {
    if (updateHospitalDetailsApi?.status === apiResponseType.success) {
      toast.success("Hospital details updated successfully");
      setIsHospitalEdit(false);
      dispatch(fetchUserSettings());
    } else if (updateHospitalDetailsApi?.status === apiResponseType.failed) {
      toastMessage(updateHospitalDetailsApi, hospSetError);
    }
  }, [updateHospitalDetailsApi]);

  useEffect(() => {
    return () => {
      reset({
        name: userDetails.name,
        userName: userDetails.userName,
        gender: userDetails.gender,
        dateOfBirth: userDetails.dateOfBirth,
      });
      hospReset({
        name: hospitalDetails.name,
        phoneNo: hospitalDetails.phoneNo,
        email: hospitalDetails.email,
        address: hospitalDetails.address,
      });
      dispatch(resetUpdateStaffBasicDetailsStatus());
      dispatch(resetUpdateHospitalDetailsStatus());
    };
  }, [userDetails, hospitalDetails]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
      setImageContentType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (
          reader.result !== avatarPreview &&
          reader.result !== userDetails?.avatarUrl
        ) {
          setAvatarPreview(reader.result);
          setLogoChanged(true);
        } else {
          setLogoChanged(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSaveLogo = async () => {
    try {
      const s3Url = await uploadToS3(selectedFile, imageContentType);
      if (s3Url) {
        hospOnsubmit({ logo: s3Url });
      }
      setLogoChanged(false);
      toast.success("Logo updated successfully!");
    } catch (err) {
      console.log({ err });
      toast.error("Failed to update logo.");
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title={<span className="text-blue text-xl">Hospital Details</span>}
      contentClassName="min-h-[700px] overflow-y-auto min-w-[90%] lg:min-w-[900px]"
      className="relative rounded-md py-4"
      showClose
    >
      {isLoading ? (
        <ProfileCardSkeleton />
      ) : (
        <div className="bg-white rounded-xl p-4">
          <div className="text-center mb-6">
            <div className="relative w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-light-blue">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="w-20 h-20 object-cover rounded-full"
                />
              ) : (
                <User className="text-blue w-10 h-10" />
              )}
              {userDetails?.role === "S" ? (
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow hover:bg-blue-100"
                  onClick={triggerFileInput}
                >
                  <EditIcon className="h-5 w-5 text-blue" />
                </button>
              ) : null}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <div>
              {logoChanged && (
                <Button className="mb-2" onClick={handleSaveLogo}>
                  Save Logo
                </Button>
              )}
            </div>
            <h2 className="text-xl font-semibold mb-1 text-blue">
              {userDetails?.role === "D"
                ? userDetails?.titleName + " " + userDetails?.name
                : userDetails?.name}
            </h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-light-blue text-light-blue-text">
              {getRoleLabel(userInfo?.response?.role) || "N/A"}
            </span>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 text-blue gap-4 w-full">
            <div className="rounded-lg border border-light-blue p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold flex items-center">
                  Hospital Information
                </h4>
                <span className="text-xs text-gray-500  ">
                  {userDetails?.role !== "S" ? (
                    <span className="bg-gray-200 px-2 py-1 rounded">
                      Read-only
                    </span>
                  ) : (
                    <div
                      className="relative cursor-pointer bg-gray-50"
                      onClick={() => setIsHospitalEdit(true)}
                    >
                      {" "}
                      {!isHospitalEdit && (
                        <EditIcon className="h-5 w-5 cursor-pointer" />
                      )}
                    </div>
                  )}
                </span>
              </div>

              <form onSubmit={hospHandleSubmit(hospOnsubmit)}>
                <div className="space-y-3">
                  {isHospitalEdit ? (
                    <CommonInput
                      id={`name`}
                      name={`name`}
                      labelName="Hospital Name"
                      type="text"
                      register={hospRegister}
                      errors={hospErrors}
                    />
                  ) : (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Hospital Name
                      </label>
                      <p className="text-sm text-gray-800 font-medium">
                        {hospitalDetails.name}
                      </p>
                    </div>
                  )}

                  {isHospitalEdit ? (
                    <CommonInput
                      id={`email`}
                      name={`email`}
                      labelName="Hospital Email"
                      type="email"
                      register={hospRegister}
                      errors={hospErrors}
                    />
                  ) : (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Hospital Email
                      </label>
                      <div className="flex items-center ">
                        <p className="text-sm text-gray-800">
                          {hospitalDetails.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {isHospitalEdit ? (
                    <CommonInput
                      id={`phoneNo`}
                      name={`phoneNo`}
                      labelName="Phone No."
                      type="text"
                      register={hospRegister}
                      errors={hospErrors}
                    />
                  ) : (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Phone
                      </label>
                      <div className="flex items-center">
                        <p className="text-sm text-gray-800">
                          {hospitalDetails.phoneNo || "N/A"}
                        </p>
                      </div>
                    </div>
                  )}

                  {isHospitalEdit ? (
                    <CommonInput
                      id={`address`}
                      name={`address`}
                      labelName="Address"
                      type="text"
                      register={hospRegister}
                      errors={hospErrors}
                    />
                  ) : (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Address
                      </label>
                      <div className="flex items-center ">
                        <p className="text-sm text-gray-800">
                          {hospitalDetails.address}
                        </p>
                      </div>
                    </div>
                  )}
                  {isHospitalEdit && (
                    <div className="flex justify-end mt-4 gap-2">
                      <CancelButton onClick={() => setIsHospitalEdit(false)} />
                      <SaveButton
                        type="submit"
                        isLoading={updateHospitalDetailsApi?.isLoading}
                        disabled={!hospIsDirty}
                      />
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* {userDetails?.role !== "S" && userDetails?.role !== "A" && ( */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="rounded-lg p-4 border border-light-blue relative">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold flex items-center">
                    <User className="mr-2 h-4 w-4 text-gray-600" />
                    Personal Information
                  </h4>
                  {console.log({ isBasicDetailsEdit })}
                  <div
                    className="absolute right-5 cursor-pointer"
                    onClick={() => setIsBasicDetailsEdit(true)}
                  >
                    {" "}
                    {!isBasicDetailsEdit && (
                      <EditIcon className="h-5 w-5 cursor-pointer" />
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {isBasicDetailsEdit ? (
                    <CommonInput
                      id={`name`}
                      name={`name`}
                      labelName="Full Name"
                      type="text"
                      register={register}
                      errors={errors}
                    />
                  ) : (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Full Name
                      </label>
                      <p className="text-sm text-gray-800 font-medium ">
                        {userDetails.name}
                      </p>
                    </div>
                  )}

                  {isBasicDetailsEdit ? (
                    <CommonInput
                      labelName="userName"
                      name={`userName`}
                      id={`userName`}
                      type="text"
                      register={register}
                      errors={errors}
                    />
                  ) : (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        User Name
                      </label>
                      <div className="flex items-center ">
                        <p className="text-sm text-gray-800">
                          {userDetails.userName}
                        </p>
                      </div>
                    </div>
                  )}

                  {isBasicDetailsEdit ? (
                    <AntDatePicker
                      id="dateOfBirth"
                      name="dateOfBirth"
                      label="Date of Birth"
                      control={control}
                      errors={errors}
                      onChange={(date, dateString) =>
                        handleDOBChange(date, dateString, setValue)
                      }
                    />
                  ) : (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Date of Birth
                      </label>
                      <div className="flex items-center ">
                        <p className="text-sm text-gray-800">
                          {new Date(userDetails.dob).toLocaleDateString(
                            "en-GB"
                          ) || "N/A"}
                        </p>
                      </div>
                    </div>
                  )}

                  {isBasicDetailsEdit ? (
                    <OptionGroup
                      name={`gender`}
                      options={genderOptions}
                      register={register}
                      errors={errors}
                    />
                  ) : (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Gender
                      </label>
                      <div className="flex items-center ">
                        <p className="text-sm text-gray-800 capitalize">
                          {userDetails.gender || "N/A"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {isBasicDetailsEdit && (
                  <div className="flex justify-end mt-4 gap-2">
                    <CancelButton
                      onClick={() => setIsBasicDetailsEdit(false)}
                    />
                    <SaveButton
                      type="submit"
                      isLoading={updateStaffBasicDetailsApi?.isLoading}
                      disabled={!isDirty}
                    />
                  </div>
                )}
              </div>
            </form>
            {/* )} */}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default HospitalDetailsModal;

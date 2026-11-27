import {
  accessTypeOptions,
  activeTypeStatus,
  doctorTypeOptions,
  filterByAnyNonEmptyField,
  platformOptions,
  qualifications,
  specialities,
  tabs,
  titleNameOptions,
} from "../helper";
import TabSwitcher from "../../../components/TabSwitcher";
import { useParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { defaultValues, doctorSchema } from "../validations/doctorSchema";
import CommonInput from "../../../components/CommonInput";
import AntDatePicker from "../../../components/AntDatePicker";
import OptionGroup from "../../../components/OptionGroup";
import { genderOptions } from "../../patient-register/helper";
import PasswordInput from "../../../components/PasswordInput";
import PlusIcon from "../../../assets/svg/add-circle.svg?react";
import TrashIcon from "../../../assets/svg/trash.svg?react";
import CommonTextarea from "../../../components/CommonTextarea";
import { useEffect, useMemo } from "react";
import { getDepartmentList } from "../../../slices/departmentSlice";
import { getProfileList } from "../../../slices/profileSlice";
import IconButton from "../../../components/IconButton";
import useNavigateTo from "../../../hooks/useNavigateTo";
import ArrowIcon from "../../../assets/svg/arrow-left.svg?react";
import {
  createDoctor,
  getDoctorById,
  getDoctorList,
  resetCreateDoctorStatus,
  resetUpdateDoctorStatus,
  updateDoctor,
} from "../../../slices/doctorSlice";
import useApiResponseHandler from "../../../hooks/useApiResponseHandler";
import { apiResponseType } from "../../../utils/types";
import { formatDate } from "../../../utils/dateAndTime";
import AntSearchableSelector from "../../../components/AntDesign/AntSearchableSelector";
import AntMultiSelector from "../../../components/AntDesign/AntMultiSelector";
import CancelButton from "../../../components/Buttons/CancelButton";
import SaveButton from "../../../components/Buttons/SaveButton";
import { ROUTES } from "../../../routes/helper";
import ResetButton from "../../../components/Buttons/ResetButton";
import Button from "../../../components/Buttons/Button";

const CreateUpdateDoctor = () => {
  const { id } = useParams();
  const goTo = useNavigateTo();
  const form = useForm({
    defaultValues,
    resolver: zodResolver(doctorSchema),
  });
  const {
    register,
    formState,
    control,
    handleSubmit,
    watch,
    resetField,
    setError,
    reset,
    trigger,
    setValue,
  } = form;
  const { errors } = formState;
  const {
    fields: socialFields,
    append: addSocial,
    remove: removeSocial,
  } = useFieldArray({
    control,
    name: "socialLinks",
  });

  const {
    fields: awardFields,
    append: addAward,
    remove: removeAward,
  } = useFieldArray({
    control,
    name: "awards",
  });

  const {
    fields: publicationFields,
    append: addPublication,
    remove: removePublication,
  } = useFieldArray({
    control,
    name: "publications",
  });

  const dispatch = useDispatch();
  const { getDepartmentListApi } = useSelector(
    (state) => state.departmentManagement
  );
  const { getProfileListApi } = useSelector((state) => state.profileManagement);
  const { createDoctorApi, getDoctorByIdApi, updateDoctorApi } = useSelector(
    (state) => state.doctorManagement
  );
  const { data: getDepartmentData } = getDepartmentListApi;
  const { data: profileData } = getProfileListApi;
  const { data: getDoctorDataPayload, status: getDoctorStatus } =
    getDoctorByIdApi;
  const getDoctorData = getDoctorDataPayload?.response;
  const accessType = watch("accessType");
  const departmentOptions =
    getDepartmentData?.response?.list?.map((dept) => ({
      label: dept.name,
      value: dept._id,
    })) || [];

  const profileOptions =
    profileData?.response?.list?.map((profile) => ({
      label: profile.name,
      value: profile._id,
    })) || [];

  const addSocialField = async (index) => {
    const isValid = await trigger(`socialLinks.${index}`);
    if (isValid) {
      addSocial({ name: "", url: "" });
    }
  };
  const addAwardField = async (index) => {
    const isValid = await trigger(`awards.${index}`);
    if (isValid) {
      addAward({ awardName: "", date: "", awardedBy: "" });
    }
  };
  const addPublicationField = async (index) => {
    const isValid = await trigger(`publications.${index}`);
    if (isValid) {
      addPublication({
        title: "",
        publicationDate: "",
        journal: "",
        url: "",
      });
    }
  };

  const onSubmit = async (data) => {
    Object.assign(
      data,
      {
        socialLinks: filterByAnyNonEmptyField(data?.socialLinks, [
          "name",
          "url",
        ]),
      },
      {
        awards: filterByAnyNonEmptyField(data?.awards, [
          "awardName",
          "awardedBy",
          "date",
        ]),
      },
      {
        publications: filterByAnyNonEmptyField(data?.publications, [
          "title",
          "publicationDate",
          "journal",
          "url",
        ]),
      }
    );
    if (id) {
      dispatch(updateDoctor({ id, data }));
    } else {
      dispatch(createDoctor(data));
    }
  };

  const getQualificationOptions = useMemo(
    () => qualifications.map((ele) => ({ value: ele, label: ele })),
    [qualifications]
  );

  const getSpecialistOptions = useMemo(
    () => specialities.map((ele) => ({ value: ele, label: ele })),
    [specialities]
  );

  useEffect(() => {
    dispatch(getDepartmentList());
    dispatch(getProfileList());
  }, [dispatch]);

  useEffect(() => {
    if (accessType === "P") {
      resetField("accessEndTime");
    }
  }, [accessType, resetField]);

  useEffect(() => {
    return () => {
      dispatch(resetCreateDoctorStatus);
      dispatch(resetUpdateDoctorStatus);
    };
  }, []);

  useApiResponseHandler({
    status: createDoctorApi.status,
    data: createDoctorApi.data,
    error: createDoctorApi.error,
    resetForm: () => reset(defaultValues),
    resetReduxStatus: () => dispatch(resetCreateDoctorStatus()),
    updateReduxList: () => dispatch(getDoctorList()),
    setFormError: setError,
  });

  useEffect(() => {
    if (id) {
      dispatch(getDoctorById(id));
    }
  }, [id]);

  useEffect(() => {
    if (getDoctorStatus === apiResponseType.success && id) {
      setValue("titleName", getDoctorData?.titleName);
      setValue("name", getDoctorData?.name);
      setValue("gender", getDoctorData?.gender);
      setValue("registrationNo", getDoctorData?.registrationNo);
      setValue("type", getDoctorData?.type);
      setValue("experience", getDoctorData?.experience);
      setValue("departmentId", getDoctorData?.departmentId);
      setValue("dateOfBirth", getDoctorData?.dateOfBirth);
      setValue("specialities", getDoctorData?.specialities);
      setValue("qualifications", getDoctorData?.qualifications);
      setValue("userName", getDoctorData?.userName);
      setValue("profileId", getDoctorData?.profileId);
      setValue("accessType", getDoctorData?.accessType);
      setValue("active", getDoctorData?.active);
      setValue("bio", getDoctorData?.bio);
      setValue(
        "accessEndTime",
        getDoctorData?.accessEndTime
          ? formatDate(getDoctorData?.accessEndTime)
          : ""
      );
      setValue("awards", getDoctorData?.awards);
      setValue("publications", getDoctorData?.publications);
      setValue("socialLinks", getDoctorData?.socialLinks);
    }
  }, [getDoctorData, id]);

  useApiResponseHandler({
    status: updateDoctorApi.status,
    data: updateDoctorApi.data,
    error: updateDoctorApi.error,
    resetReduxStatus: () => dispatch(resetUpdateDoctorStatus()),
    updateReduxList: () => dispatch(getDoctorList()),
    setFormError: setError,
  });

  return (
    <div className="bg-white rounded-lg w-full min-h-[100dvh] p-5 flex flex-1 flex-col gap-5 my-3">
      <TabSwitcher tabs={tabs} selected={5} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="text-blue my-3 flex flex-col items-start gap-5 w-full"
      >
        <div className="flex w-full justify-between">
          <h2 className="text-2xl font-medium text-blue">
            {id ? "Update" : "Create "} Doctor
          </h2>
          <CancelButton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center w-full gap-5 min-h-screen">
          <div className="border rounded-lg border-light-blue h-full p-4 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h2 className="title">Doctor's Basic Details</h2>
              <div className="grid grid-cols-6 gap-5">
                {/* titleName */}
                <div className="col-span-2">
                  <AntSearchableSelector
                    id="titleName"
                    name="titleName"
                    labelName="Title Name"
                    control={control}
                    errors={errors}
                    options={titleNameOptions}
                    required
                  />
                </div>
                {/* full name */}
                <div className="col-span-4">
                  <CommonInput
                    labelName="Full Name"
                    id="name"
                    name="name"
                    register={register}
                    errors={errors}
                  />
                </div>
                <div className="flex col-span-6 items-center gap-5">
                  {/* gender */}
                  <OptionGroup
                    name="gender"
                    // labelName="Gender"
                    options={genderOptions}
                    register={register}
                    required={true}
                    errors={errors}
                  />

                  {/* registration number */}
                  <CommonInput
                    labelName="Registration No"
                    id="registrationNo"
                    name="registrationNo"
                    register={register}
                    errors={errors}
                  />
                </div>

                {/* DOB */}
                <div className="col-span-3">
                  <AntDatePicker
                    id="dateOfBirth"
                    name="dateOfBirth"
                    label="Date of Birth"
                    control={control}
                    errors={errors}
                    required={true}
                  />
                </div>
                {/* doctor type */}
                <div className="col-span-3">
                  <AntSearchableSelector
                    id="type"
                    name="type"
                    labelName="Type Of Doctor"
                    control={control}
                    errors={errors}
                    options={doctorTypeOptions}
                  />
                </div>
                {/* experience */}
                <div className="col-span-2">
                  <CommonInput
                    labelName="Exp(Year)"
                    id="experience"
                    name="experience"
                    register={register}
                    errors={errors}
                  />
                </div>
                {/* departmentId */}
                <div className="col-span-4">
                  <AntSearchableSelector
                    id="departmentId"
                    name="departmentId"
                    labelName="Department Name"
                    control={control}
                    errors={errors}
                    options={departmentOptions}
                  />
                </div>

                {/* Specialist */}
                <div className="col-span-6">
                  <AntMultiSelector
                    id="specialities"
                    name="specialities"
                    labelName="Specialities"
                    options={getSpecialistOptions}
                    control={control}
                    errors={errors}
                    required
                  />
                </div>

                {/* Qualification */}
                <div className="col-span-6">
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
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="title">Login Credentials</h2>

              <div className="grid grid-cols-3 gap-5">
                {/* userName */}
                <div className="col-span-3">
                  <CommonInput
                    labelName="User Name"
                    id="userName"
                    name="userName"
                    register={register}
                    errors={errors}
                    required
                  />
                </div>
                {!id && (
                  <div className="col-span-3">
                    {/* password */}
                    <PasswordInput
                      labelName="Password"
                      id="password"
                      name="password"
                      register={register}
                      errors={errors}
                      type="password"
                      required
                    />
                  </div>
                )}

                {/* Profile  */}
                <div className="col-span-1">
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

                {/* active Status */}
                <div className="col-span-1">
                  <AntSearchableSelector
                    id="active"
                    name="active"
                    labelName="Active Status"
                    options={activeTypeStatus}
                    control={control}
                    errors={errors}
                  />
                </div>

                {/* Access End Time */}
                {accessType === "T" && (
                  <div className="col-span-2">
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
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="title">Social Media Links</h2>
              {socialFields.length > 0 ? (
                <div className="flex flex-col gap-5">
                  {socialFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-10 gap-2">
                      <div className="col-span-4">
                        <AntSearchableSelector
                          id={`socialLinks.${index}.name`}
                          name={`socialLinks.${index}.name`}
                          labelName="Platform Name"
                          options={platformOptions}
                          control={control}
                          errors={errors}
                        />
                      </div>

                      <div className="col-span-4">
                        <CommonInput
                          id={`socialLinks.${index}.url`}
                          name={`socialLinks.${index}.url`}
                          labelName="Publication URL"
                          register={register}
                          errors={errors}
                          required
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => addSocialField(index)}
                          title="Add"
                          className="cursor-pointer p-2 hover:bg-light-blue rounded-md"
                        >
                          <PlusIcon />
                        </button>

                        {socialFields.length > 0 && (
                          <button
                            type="button"
                            onClick={() => removeSocial(index)}
                            title="Remove"
                            className="cursor-pointer p-2 hover:bg-red-100 rounded-md"
                          >
                            <TrashIcon />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-sm">
                    No social media links available. Add new
                  </span>
                  <button
                    type="button"
                    onClick={() => addSocial({ name: "", url: "" })}
                    title="Add"
                    className="cursor-pointer"
                  >
                    <PlusIcon />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="border rounded-lg border-light-blue h-full p-5 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h2 className="title">Professional Summary</h2>
              <div>
                <CommonTextarea
                  id="bio"
                  name="bio"
                  labelName="Doctor Profile/Bio"
                  className="text-sm"
                  textareaClassName="min-h-[100px]"
                  register={register}
                  errors={errors}
                />
              </div>
            </div>

            <div className="flex flex-col ">
              <h2 className="title">Awards</h2>
              {awardFields.length > 0 ? (
                <div className="flex flex-col">
                  {awardFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-10 gap-x-2 gap-y-4"
                    >
                      <div className="col-span-10">
                        <CommonInput
                          id={`awards.${index}.awardName`}
                          name={`awards.${index}.awardName`}
                          labelName="Award Name"
                          register={register}
                          errors={errors}
                          required
                        />
                      </div>

                      {/* date */}
                      <div className="col-span-4">
                        <AntDatePicker
                          id={`awards.${index}.date`}
                          name={`awards.${index}.date`}
                          label="Received Date"
                          control={control}
                          errors={errors}
                        />
                      </div>
                      {/* Awarded By */}
                      <div className="col-span-4">
                        <CommonInput
                          id={`awards.${index}.awardedBy`}
                          name={`awards.${index}.awardedBy`}
                          labelName="Awarded By"
                          register={register}
                          errors={errors}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => addAwardField(index)}
                          title="Add"
                          className="cursor-pointer p-2 hover:bg-light-blue rounded-md"
                        >
                          <PlusIcon />
                        </button>

                        <div className="col-span-1">
                          {awardFields.length > 0 && (
                            <button
                              type="button"
                              onClick={() => removeAward(index)}
                              title="Remove"
                              className="cursor-pointer p-2 hover:bg-red-100 rounded-md"
                            >
                              <TrashIcon />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm">No awards available. Add new</span>
                  <button
                    type="button"
                    onClick={() =>
                      addAward({ awardName: "", date: "", awardedBy: "" })
                    }
                    title="Add"
                    className="cursor-pointer"
                  >
                    <PlusIcon />
                  </button>
                </div>
              )}
            </div>

            <div>
              <h2 className="title">Publications</h2>
              {publicationFields.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {publicationFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-10 gap-x-2 gap-y-4"
                    >
                      {/* publication name */}
                      <div className="col-span-6">
                        <CommonInput
                          id={`publications.${index}.title`}
                          name={`publications.${index}.title`}
                          labelName="Publication Name"
                          register={register}
                          errors={errors}
                          required
                        />
                      </div>

                      {/* date */}
                      <div className="col-span-4">
                        <AntDatePicker
                          id={`publications.${index}.publicationDate`}
                          name={`publications.${index}.publicationDate`}
                          label="Received Date"
                          control={control}
                          errors={errors}
                        />
                      </div>
                      {/* Journal */}
                      <div className="col-span-4">
                        <CommonInput
                          id={`publications.${index}.journal`}
                          name={`publications.${index}.journal`}
                          labelName="Journal"
                          register={register}
                          errors={errors}
                        />
                      </div>
                      {/* Publication Url */}
                      <div className="col-span-4">
                        <CommonInput
                          id={`publications.${index}.url`}
                          name={`publications.${index}.url`}
                          labelName="Publication Url"
                          register={register}
                          errors={errors}
                        />
                      </div>
                      <div className="flex items-center hap-2">
                        <button
                          type="button"
                          onClick={() => addPublicationField(index)}
                          title="Add"
                          className="cursor-pointer p-2 hover:bg-light-blue rounded-md"
                        >
                          <PlusIcon />
                        </button>

                        <div className="col-span-1">
                          {publicationFields.length > 0 && (
                            <button
                              type="button"
                              onClick={() => removePublication(index)}
                              title="Remove"
                              className="cursor-pointer p-2 hover:bg-red-100 rounded-md"
                            >
                              <TrashIcon />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    No journals available. Add new
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      addPublication({
                        title: "",
                        publicationDate: "",
                        journal: "",
                        url: "",
                      })
                    }
                    title="Add"
                    className="cursor-pointer"
                  >
                    <PlusIcon />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5 justify-between w-full">
          <Button onClick={() => goTo(ROUTES.DOCTORS)} variant="light">
            <ArrowIcon />
            <span className="ml-1">Back</span>
          </Button>
          <div className="flex items-center gap-5">
            <ResetButton onClick={() => reset()} />
            <SaveButton
              type="submit"
              isLoading={createDoctorApi.isLoading || updateDoctorApi.isLoading}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateUpdateDoctor;

import { zodResolver } from "@hookform/resolvers/zod";
import TabSwitcher from "../../../components/TabSwitcher";
import { tabs } from "../helper";
import { useForm } from "react-hook-form";
import { profileCreation } from "../validations/profileSchema";
import CommonInput from "../../../components/CommonInput";
import TrashIcon from "../../../assets/svg/trash.svg?react";
import PlusIcon from "../../../components/svgs/PlusIcon";
import EyeIcon from "../../../components/svgs/EyeIcon";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProfile,
  getProfileById,
  resetCreateProfileStatus,
  resetUpdateProfileStatus,
  updateProfile,
} from "../../../slices/profileSlice";
import { apiResponseType } from "../../../utils/types";
import { convertToHookFormErrors } from "../../../utils/common";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import useNavigateTo from "../../../hooks/useNavigateTo";
import { ROUTES } from "../../../routes/helper";
import Button from "../../../components/Buttons/Button";
import CancelButton from "../../../components/Buttons/CancelButton";
import SaveButton from "../../../components/Buttons/SaveButton";
import ModifyIcon from "../../../components/svgs/ModifyIcon";
import InfoIcon from "../../../assets/svg/info.svg?react";
import AdminRoleCard from "../components/AdminRoleCard";
import { alertType } from "../../payment/helper";
import Alert from "../../../components/Alert";

const moduleNameMaps = {
  admin: {
    name: "Hospital Administration",
    desc: "Handles high-level administrative tasks such as managing hospital departments, staff access control, permissions, and overall system configurations.",
  },
  patient: {
    name: "Patient Management",
    desc: "Manages patient information, appointments, and medical records.",
  },
  roaster: {
    name: "Roster Management",
    desc: "Handles staff rosters, shift allocations, and attendance tracking.",
  },
  nurse: {
    name: "Nursing OPD",
    desc: "Manages outpatient department activities for nursing staff.",
  },
  doctor: {
    name: "Doctor OPD",
    desc: "Handles outpatient department activities for doctors.",
  },
  pharmacy: {
    name: "Pharmacy Services",
    desc: "Manages medication dispensing, inventory, and patient counseling.",
  },
  appointment: {
    name: "Appointment Scheduling",
    desc: "Facilitates appointment booking, rescheduling, and cancellations.",
  },
};

const profiles = {
  admin: {
    view: true,
    modify: true,
  },
  patient: {
    view: true,
    modify: true,
  },
  appointment: {
    view: true,
    modify: true,
  },
  doctor: {
    view: true,
    modify: true,
  },
  nurse: {
    view: true,
    modify: true,
  },
  roaster: {
    view: true,
    modify: true,
  },
  pharmacy: {
    view: true,
    modify: true,
  },
};

const modules = Object.keys(profiles);

const whiteColor = "#FFFFFF";
const selectedColor = "#0F3E69";

const CreateUpdateProfile = () => {
  const { id } = useParams();
  const [assignedModules, setAssignedModules] = useState({});
  const [customErrors, setCustomErrors] = useState({});
  const notAssignedModules = modules?.filter(
    (module) => !Object?.keys(assignedModules || {}).includes(module)
  );
  const goTo = useNavigateTo();
  const [role, setRole] = useState("");
  const form = useForm({
    defaultValues: {
      name: "",
      desc: "",
      role: "",
    },
    resolver: zodResolver(profileCreation),
  });
  const { register, formState, handleSubmit, setValue } = form;
  const { errors } = formState;
  const dispatch = useDispatch();
  const { createProfileApi, getProfileByIdApi, updateProfileApi } = useSelector(
    (state) => state.profileManagement
  );
  const { isLoading, data, error, status } = createProfileApi;
  const { data: getProfileData, status: getProfileStatus } = getProfileByIdApi;
  const {
    isLoading: updateProfileLoading,
    data: updateProfileData,
    status: updateProfileStatus,
  } = updateProfileApi;

  const handleGrantAccess = (profile) => {
    setAssignedModules((prev) => ({
      ...prev,
      [profile]: {
        view: true,
        modify: true,
      },
    }));
  };

  const handleRemoveAccess = (profile) => {
    setAssignedModules((prev) => {
      const { [profile]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleRollBackAccess = () => {
    setAssignedModules({});
  };

  const handleAllocation = (profile, permission) => {
    const booleanValue = !assignedModules[profile][permission];
    const permissionObj = {
      [permission]: booleanValue,
    };

    if (permission === "modify" && booleanValue) {
      Object.assign(permissionObj, {
        view: true,
      });
    }

    setAssignedModules((prev) => ({
      ...prev,
      [profile]: {
        ...prev[profile],
        ...permissionObj,
      },
    }));
  };

  const onSubmit = async (data) => {
    if (role === "T") {
      data = { ...data, access: assignedModules };
    }
    if (id) {
      dispatch(updateProfile({ id, data: data }));
    } else {
      dispatch(createProfile(data));
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault(); // Needed for some browsers
      e.returnValue = ""; // Show default confirmation popup
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (status === apiResponseType.failed) {
      setCustomErrors(convertToHookFormErrors(error));
      dispatch(resetCreateProfileStatus());
    } else if (status === apiResponseType.success) {
      toast.success(data);
      dispatch(resetCreateProfileStatus());
      goTo(ROUTES.PROFILES);
    }
  }, [status]);

  useEffect(() => {
    setCustomErrors(errors);
  }, [errors]);

  useEffect(() => {
    if (id) {
      dispatch(getProfileById(id));
    }
  }, [id]);

  useEffect(() => {
    if (getProfileStatus === apiResponseType.success && id) {
      setValue("name", getProfileData?.name);
      setValue("desc", getProfileData?.desc);
      setAssignedModules(getProfileData?.access);
      setRole(getProfileData?.role || "T");
      setValue("role", getProfileData?.role || "T");
    }
  }, [getProfileData]);

  useEffect(() => {
    if (updateProfileStatus === apiResponseType.success) {
      toast.success(updateProfileData);
      dispatch(resetUpdateProfileStatus());
      goTo(ROUTES.PROFILES);
    }
    if (updateProfileStatus === apiResponseType.failed) {
      toast.error("failed to update profile, try again");
      dispatch(resetUpdateProfileStatus());
    }
  }, [updateProfileStatus]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="page">
      <TabSwitcher tabs={tabs} selected={1} />

      <div className="flex gap-5 my-2 items-start justify-between text-blue">
        <div className="w-1/2 flex flex-col gap-2">
          <h2 className="text-xl lg:text-2xl font-medium">
            {id ? "Update Role & Access" : "Create Profile"}
          </h2>
          {!id ? (
            <p className="text-xs lg:text-sm">
              Profiles are sets of permissions dealing with module access and
              operations, setup customizations, and access to various apps. You
              can provide different sets of permissions to various users.
            </p>
          ) : null}
        </div>
        <div className="flex items-start justify-end gap-2 w-1/2">
          <CancelButton />
          <SaveButton
            isLoading={isLoading || updateProfileLoading}
            type="submit"
          />
        </div>
      </div>

      {id ? (
        <Alert
          title={` When you update this profile, it will change for all users linked to it.`}
          type={alertType.info}
        />
      ) : null}

      <div className="flex flex-col lg:grid grid-cols-2 gap-3 mb-2">
        <CommonInput
          labelName="Name"
          id="name"
          name="name"
          register={register}
          errors={customErrors}
        />
        <CommonInput
          labelName="Description"
          id="desc"
          name="desc"
          register={register}
          errors={customErrors}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-blue mt-2">
          {/* Admin Card */}
          <label className="cursor-pointer">
            <input
              type="radio"
              name="role"
              value="A"
              className="peer hidden"
              {...register("role", { required: "Please select a role" })}
              onChange={(e) => {
                setRole("A");
                register("role").onChange(e);
              }}
            />
            <div className="border border-light-blue h-full rounded-lg p-4 flex flex-col gap-3 transition hover:border-blue/50 peer-checked:border-blue/50 peer-checked:shadow-lg peer-checked:bg-blue-50">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Admin</span>
              </div>
              <p className="text-sm">
                Making a user an <b>Admin</b> will give them full hospital
                access except profile management and billing.
              </p>
            </div>
          </label>

          {/* Staff Members Card */}
          <label className="cursor-pointer">
            <input
              type="radio"
              name="role"
              value="T"
              className="peer hidden"
              {...register("role", { required: "Please select a role" })}
              onChange={(e) => {
                setRole("T");
                register("role").onChange(e);
              }}
            />
            <div className="border border-light-blue h-full rounded-lg p-4 flex flex-col gap-3 transition hover:border-blue/50 peer-checked:border-blue/50 peer-checked:shadow-lg peer-checked:bg-blue-50">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Staff Members</span>
              </div>
              <p className="text-sm">
                Staff Members will have limited access based on assigned
                permissions.
              </p>
            </div>
          </label>
          {errors.role && (
            <p className="col-span-full text-red-600 text-sm mt-1">
              {errors.role.message}
            </p>
          )}
        </div>
      </div>

      {/* Admin View */}
      {role === "A" && (
        <AdminRoleCard modules={modules} moduleNameMaps={moduleNameMaps} />
      )}

      {role === "T" && (
        <div className="flex text-blue items-start justify-between gap-5 min-h-[300px]">
          <div className="w-2/5 border border-blue-border rounded-lg h-full overflow-y-scroll">
            <div className="font-medium bg-extra-light-blue p-4 rounded-t-lg">
              Not Assigned Modules
            </div>
            {notAssignedModules.length ? (
              notAssignedModules.map((profile) => {
                return (
                  <div
                    key={profile}
                    className="flex flex-col gap-2 text-base bg-white p-4 rounded-t-lg border-b border-blue-border"
                  >
                    <div className="flex-col gap-1 w-full">
                      <p className="font-medium">
                        {moduleNameMaps[profile]?.name}
                      </p>
                      <span className="text-xs">
                        {moduleNameMaps[profile]?.desc}
                      </span>
                    </div>
                    <div>
                      <Button
                        name="Grant Access"
                        onClick={() => handleGrantAccess(profile)}
                        variant="light"
                        className="!text-xs"
                      >
                        <PlusIcon />
                        <span className="ml-1">Grant Access</span>
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex-center py-2 min-h-full text-2xl h-[300px]">
                All Modules were assigned
              </div>
            )}
          </div>
          <div className="w-3/5 border border-blue-border rounded-lg h-full overflow-y-scroll">
            <div className="font-medium bg-extra-light-blue p-4 rounded-t-lg flex w-full justify-between ">
              Assigned Modules
              <Button
                type="button"
                onClick={() => handleRollBackAccess()}
                className="-m-2"
              >
                Rollback All
              </Button>
            </div>
            {Object.keys(assignedModules || {}).length ? (
              Object.keys(assignedModules || {}).map((profile) => {
                const selected = assignedModules[profile];
                const { view, modify } = { ...selected };
                return (
                  <div
                    key={profile}
                    className="flex flex-col text-base bg-white p-4 rounded-t-lg border-b border-blue-border items-center gap-2"
                  >
                    <div className="flex-col gap-1 w-full">
                      <p className="font-medium">
                        {moduleNameMaps[profile]?.name}
                      </p>
                      <span className="text-xs">
                        {moduleNameMaps[profile]?.desc}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full">
                      <Button
                        onClick={() => handleAllocation(profile, "view")}
                        variant={view ? "primary" : "light"}
                        className="!text-xs"
                      >
                        <EyeIcon color={view ? whiteColor : selectedColor} />
                        <span className="ml-1">Preview</span>
                      </Button>

                      <Button
                        onClick={() => handleAllocation(profile, "modify")}
                        variant={modify ? "primary" : "light"}
                        className="!text-xs"
                      >
                        <ModifyIcon
                          color={modify ? whiteColor : selectedColor}
                        />
                        <span className="ml-2">
                          Modify(Create, Update, Delete)
                        </span>
                      </Button>

                      <div
                        className="p-2 hover:bg-red-100 cursor-pointer rounded-lg"
                        onClick={() => handleRemoveAccess(profile)}
                      >
                        <TrashIcon />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex-center py-2 text-2xl h-[300px]">
                No Assigned Modules Found
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
};

export default CreateUpdateProfile;

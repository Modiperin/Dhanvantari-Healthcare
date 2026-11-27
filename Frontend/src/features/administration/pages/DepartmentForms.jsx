import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  defaultValueForDepartment,
  departmentSchema,
} from "../validations/departmentCreation";
import CommonInput from "../../../components/CommonInput";
import { DepartmentGrid } from "../components/DepartmentGrid";
import TabSwitcher from "../../../components/TabSwitcher";
import { activeTypeStatus, tabs } from "../helper";
import { useParams } from "react-router-dom";
import {
  createDepartment,
  getDepartmentById,
  getDepartmentList,
  resetApiState,
  updateDepartmentById,
} from "../../../slices/departmentSlice";
import { useDispatch, useSelector } from "react-redux";
import { apiResponseType } from "../../../utils/types";
import { Roles } from "../../../utils/roles";
import useNavigateTo from "../../../hooks/useNavigateTo";
import { toastMessage } from "../../../utils/toastMessage";
import AntSearchableSelector from "../../../components/AntDesign/AntSearchableSelector";
import { ROUTES } from "../../../routes/helper";
import CancelButton from "../../../components/Buttons/CancelButton";
import SaveButton from "../../../components/Buttons/SaveButton";

const DepartmentForms = () => {
  const { id } = useParams();

  const goTo = useNavigateTo();
  const dispatch = useDispatch();
  const form = useForm({
    defaultValues: defaultValueForDepartment,
    resolver: zodResolver(departmentSchema),
  });

  const {
    updateDepartmentByIdApi,
    getDepartmentByIdApi,
    createDepartmentApi,
    getDepartmentListApi,
  } = useSelector((state) => state.departmentManagement);

  const { isLoading: createDeptLoading, status: createStatus } =
    createDepartmentApi;
  const { data: deptDataResponse, status: deptStatus } = getDepartmentByIdApi;
  const deptData = deptDataResponse?.response;
  const { isLoading: updateDeptLoading, status: updateDeptStatus } =
    updateDepartmentByIdApi;
  const { data, isLoading, status } = getDepartmentListApi;

  const {
    register,
    formState,
    control,
    setValue,
    handleSubmit,
    setError,
    reset,
    clearErrors,
  } = form;
  const { errors } = formState;
  const onSubmit = async (data) => {
    if (id) {
      dispatch(
        updateDepartmentById({ id, data: { ...data, role: Roles.team } })
      );
    } else {
      dispatch(createDepartment({ ...data, role: Roles.superAdmin }));
    }
  };

  useEffect(() => {
    if (id) {
      reset(defaultValueForDepartment);
      clearErrors();
      dispatch(getDepartmentById(id));
    } else {
      dispatch(getDepartmentList());
    }
  }, [id]);

  useEffect(() => {
    if (deptStatus === apiResponseType.success && id) {
      setValue("name", deptData?.name);
      setValue("code", deptData?.code);
      setValue("active", deptData?.active);
    }
  }, [deptData]);

  useEffect(() => {
    if (id) {
      toastMessage(updateDepartmentByIdApi, setError);
      if (updateDeptStatus === apiResponseType.success) {
        reset(defaultValueForDepartment);
        setTimeout(() => {
          dispatch(resetApiState("updateDepartmentByIdApi"));
          goTo(ROUTES.DEPARTMENTS);
        }, 1500);
      }
    } else {
      toastMessage(createDepartmentApi, setError);
      if (createStatus === apiResponseType.success) {
        reset(defaultValueForDepartment);
        dispatch(resetApiState("createDepartmentApi"));
        dispatch(getDepartmentList());
      }
    }
  }, [createStatus, updateDeptStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetApiState("createDepartmentApi"));
      dispatch(resetApiState("updateDepartmentByIdApi"));
      dispatch(resetApiState("getDepartmentByIdApi"));
    };
  }, []);

  return (
    <div className="page">
      <TabSwitcher tabs={tabs} selected={2} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="text-blue my-3 flex flex-col items-start gap-3 w-full"
      >
        <div className="flex w-full justify-between">
          <h2 className="text-xl lg:text-2xl font-medium text-blue">
            {id ? "Update Department" : "Create New Department"}
          </h2>
          <CancelButton />
        </div>
        <div className="grid grid-cols-3 gap-3 w-full">
          <div>
            {/* Department Name  */}
            <CommonInput
              labelName="Department Name*"
              id="name"
              name="name"
              register={register}
              errors={errors}
            />
          </div>
          <div>
            {/* Department Code  */}
            <CommonInput
              id="code"
              name="code"
              labelName="Code*"
              register={register}
              control={control}
              errors={errors}
            />
          </div>
          {/* active Status */}
          <div>
            <AntSearchableSelector
              id="active"
              name="active"
              labelName="Active Status"
              options={activeTypeStatus}
              control={control}
              errors={errors}
            />
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-3 mt-5">
          <SaveButton
            type="submit"
            isLoading={createDeptLoading || updateDeptLoading}
            name={id ? "Update" : "Create"}
          />
        </div>
      </form>
      {!id && (
        <DepartmentGrid data={data} isLoading={isLoading} status={status} />
      )}
    </div>
  );
};

export default DepartmentForms;

import CommonInput from "../../../../components/CommonInput";
import BlueArrowIcon from "../../../../assets/svg/blue-arrow-down.svg?react";
import CommonSelect from "../../../../components/CommonSelect";
import { useForm } from "react-hook-form";
import FormStepperButtons from "../FormStepperButtons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import {
  createDepartment,
  deleteDepartment,
  fetchDepartments,
  markStepCompleted,
  resetCreateDeptStatus,
  resetDeleteDeptStatus,
} from "../../../../slices/hospitalOnboardingSlice";
import toast from "react-hot-toast";
import { departmentSchema } from "./validations/departmentDetails";
import { useEffect, useState } from "react";
import { getDataFromCookies } from "../../../../services/cookies";
import { apiResponseType, HeaderType } from "../../../../utils/types";
import Spinner from "../../../../components/Spinner";
import TableGrid from "../../../../components/table/TableGrid";
import { toastMessage } from "../../../../utils/toastMessage";
import { ConfirmationModal } from "../../../../components/ConfirmationModal";
import TrashIcon from "../../../../assets/svg/trash.svg?react";
import { activeTypeStatus } from "../../../administration/helper";
import AntSearchableSelector from "../../../../components/AntDesign/AntSearchableSelector";
import SaveButton from "../../../../components/Buttons/SaveButton";

const DepartmentSetup = ({ previousStepHandler, nextStepHandler }) => {
  const dispatch = useDispatch();
  const departments = useSelector(
    (state) => state.hospitalOnboarding.formData.departments
  );
  const DeptListIsLoading = useSelector(
    (state) => state.hospitalOnboarding.departmentsIsLoading
  );
  const curStep = useSelector((state) => state.hospitalOnboarding.currentStep);
  const completedSteps = useSelector(
    (state) => state.hospitalOnboarding.completedSteps
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    departmentId: null,
    departmentName: "",
  });

  const { createDeptApi, deleteDeptApi } = useSelector(
    (state) => state.hospitalOnboarding
  );
  const { status, isLoading, error } = createDeptApi;
  const { status: deleteDeptStatus, data: deleteDeptData } = deleteDeptApi;
  const form = useForm({
    defaultValues: {
      name: "",
      code: "",
      active: true,
    },
    resolver: zodResolver(departmentSchema),
  });
  const { register, handleSubmit, formState, reset, setError, control } = form;
  const { errors } = formState;

  const onSubmit = async (data) => {
    console.log("form submitted", data);
    dispatch(createDepartment(data));
  };

  const handleNextStep = () => {
    if (departments.length === 0) {
      toast.error("Please add at least one department to proceed.");
      return;
    }
    dispatch(markStepCompleted(curStep));
    nextStepHandler();
  };

  const commonProps = {
    className: "h-4 lg:h-6 w-4 lg:w-6 cursor-pointer",
  };

  const headerData = [
    {
      name: "Department Name",
      value: "name",
      _class: "col-span-3",
    },
    {
      name: "Code",
      value: "code",
      _class: "col-span-3",
    },
    {
      name: "Status",
      value: "active",
      _class: "col-span-3",
      type: HeaderType.statusBudge,
    },
    {
      name: "Actions",
      value: "actions",
      _class: "col-span-3",
      type: HeaderType.dynamicAction,
      actions: [
        {
          label: "Delete",
          icon: <TrashIcon {...commonProps} />,
          onClick: (row) => handleDeleteClick(row.id),
        },
      ],
    },
  ];

  useEffect(() => {
    const token = getDataFromCookies("hospitalToken");
    if (token) {
      dispatch(fetchDepartments());
    }
  }, [dispatch]);

  useEffect(() => {
    // if (status === apiResponseType.success) {
    //   toast.success(data.message);
    //   reset();
    //   dispatch(fetchDepartments());
    //   dispatch(resetCreateDeptStatus());
    //   if (!completedSteps.includes(curStep)) {
    //     dispatch(markStepCompleted(curStep));
    //   }
    // } else if (status === apiResponseType.failed) {
    //   // console.log({ error });
    //   error.map((error) => {
    //     setError(error.field, {
    //       type: "server",
    //       message: error.message,
    //     });
    //   });
    // }

    if (status === apiResponseType.success) {
      toastMessage(createDeptApi, null);
      reset();
      dispatch(fetchDepartments());
      dispatch(resetCreateDeptStatus());
      if (!completedSteps.includes(curStep)) {
        dispatch(markStepCompleted(curStep));
      }
    } else {
      toastMessage(createDeptApi, setError);
    }
  }, [status]);

  useEffect(() => {
    if (deleteDeptStatus === apiResponseType.success) {
      toast.success(deleteDeptData.message);
      dispatch(fetchDepartments());
      dispatch(resetDeleteDeptStatus());
    } else if (deleteDeptStatus === apiResponseType.failed) {
      // console.log({ error });
      error.map((error) => {
        toast.error(error.message);
      });
    }
  }, [deleteDeptStatus]);

  const handleDeleteClick = (id) => {
    // Find the department name for the confirmation dialog
    setModalOpen(true);
    const department = departments?.find((dept) => dept.id === id);
    const departmentName = department ? department.name : "this department";

    setConfirmationModal({
      isOpen: true,
      departmentId: id,
      departmentName: departmentName,
    });
  };

  const handleConfirmDelete = async () => {
    setModalOpen(false);
    if (confirmationModal.departmentId) {
      dispatch(deleteDepartment(confirmationModal.departmentId));
      setConfirmationModal({
        isOpen: false,
        departmentId: null,
        departmentName: "",
      });
    }
  };

  const handleCancelDelete = () => {
    setModalOpen(false);
    setConfirmationModal({
      isOpen: false,
      departmentId: null,
      departmentName: "",
    });
  };

  return (
    <div>
      <h2 className="text-xl lg:text-2xl font-medium text-blue">
        Department Setup
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-2 gap-5 items-center justify-center my-4">
          <CommonInput
            labelName="Department Name"
            id="name"
            name="name"
            register={register}
            errors={errors}
          />
          <CommonInput
            labelName="Department Code"
            id="code"
            name="code"
            register={register}
            errors={errors}
          />
          <AntSearchableSelector
            id="active"
            name="active"
            labelName="Active Status"
            options={activeTypeStatus}
            control={control}
            errors={errors}
          />
        </div>
        <SaveButton type="submit" isLoading={isLoading} className={"mb-4"} />
      </form>

      <TableGrid
        data={departments}
        columns={headerData}
        isLoading={DeptListIsLoading}
      />
      <FormStepperButtons
        curStep={curStep}
        previousStepHandler={previousStepHandler}
        nextStepHandler={handleNextStep}
      />

      {modalOpen && (
        <ConfirmationModal
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title={<span className="text-blue text-xl">Confirm Delete</span>}
          primaryButtonName={"Delete"}
          content={
            <span className="text-gray-600 mb-6">
              Are you sure you want to delete the department{" "}
              <em>{confirmationModal.departmentName}</em>.{" "}
              <strong>This action cannot be undone.</strong>
            </span>
          }
        />
      )}
    </div>
  );
};

export default DepartmentSetup;

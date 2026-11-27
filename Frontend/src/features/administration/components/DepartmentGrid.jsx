import { useEffect, useState } from "react";
import TableGrid from "../../../components/table/TableGrid";
import { apiResponseType, HeaderType } from "../../../utils/types";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDepartmentByID,
  getDepartmentList,
  resetApiState,
} from "../../../slices/departmentSlice";
import useNavigateTo from "../../../hooks/useNavigateTo";
import { ConfirmationModal } from "../../../components/ConfirmationModal";
import { toastMessage } from "../../../utils/toastMessage";
import EditIcon from "../../../assets/svg/edit.svg?react";
import TrashIcon from "../../../assets/svg/trash.svg?react";
import { ROUTES } from "../../../routes/helper";

export const DepartmentGrid = ({ data, isLoading, status }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const goTo = useNavigateTo();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    departmentId: null,
    departmentName: "",
  });
  const { deleteDepartmentApi } = useSelector(
    (state) => state.departmentManagement
  );

  const pageLimit = data?.response?.pageLimit;
  const totalRecords = data?.response?.totalRecords;
  const totalPages = data?.response?.totalPages;
  const departments =
    data?.response?.list?.map((ele) => ({
      name: ele.name,
      id: ele._id,
      code: ele.code,
      active: ele.active,
    })) || [];

  const handleEdit = (id) => {
    goTo(`${ROUTES.DEPARTMENT_UPDATE_BY_ID}/${id}`);
  };

  const handleDeleteClick = (id) => {
    // Find the department name for the confirmation dialog
    setModalOpen(true);
    const department = data?.response?.list?.find((dept) => dept._id === id);
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
      dispatch(deleteDepartmentByID(confirmationModal.departmentId));
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

  const commonProps = {
    className: "h-4 lg:h-6 w-4 lg:w-6 cursor-pointer",
  };

  const headerData = [
    {
      name: "Department Name",
      value: "name",
      _class: "col-span-4",
    },
    {
      name: "Department Code",
      value: "code",
      _class: "col-span-3",
    },
    {
      name: "Status",
      value: "active",
      type: HeaderType.statusBudge,
      _class: "col-span-2",
    },
    {
      name: "Actions",
      value: "actions",
      _class: "col-span-3 flex",
      type: HeaderType.dynamicAction,
      actions: [
        {
          label: "Edit",
          icon: <EditIcon {...commonProps} />,
          onClick: (row) => handleEdit(row.id),
        },
        {
          label: "Delete",
          icon: <TrashIcon {...commonProps} />,
          onClick: (row) => handleDeleteClick(row.id),
        },
      ],
    },
  ];

  useEffect(() => {
    toastMessage(deleteDepartmentApi);
    if (deleteDepartmentApi.status === apiResponseType.success) {
      dispatch(getDepartmentList({ query: null }));
      dispatch(resetApiState("deleteDepartmentApi"));
    }
  }, [deleteDepartmentApi.status]);

  useEffect(() => {
    dispatch(getDepartmentList({ page: currentPage }));
  }, [currentPage]);

  useEffect(() => {
    if (status === apiResponseType.success) {
      setCurrentPage(data?.response?.currentPage);
    }
  }, [status]);

  useEffect(() => {
    return () => {
      dispatch(resetApiState("deleteDepartmentApi"));
    };
  }, []);

  return (
    <>
      <TableGrid
        data={departments}
        columns={headerData}
        isLoading={isLoading}
        allowPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageLimit={pageLimit}
        totalRecords={totalRecords}
        onPageChange={(page) => setCurrentPage(page)}
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
              <em>{confirmationModal.departmentName}</em>?{" "}
              <strong>This action cannot be undone.</strong>
            </span>
          }
        />
      )}
    </>
  );
};

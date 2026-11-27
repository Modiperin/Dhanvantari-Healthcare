import { useDispatch, useSelector } from "react-redux";
import TableGrid from "../../../components/table/TableGrid";
import { apiResponseType, HeaderType } from "../../../utils/types";
import { useEffect, useState } from "react";
import {
  deleteStaff,
  getStaffList,
  resetDeleteStaffStatus,
} from "../../../slices/staffSlice";
import toast from "react-hot-toast";
import useNavigateTo from "../../../hooks/useNavigateTo";
import { ConfirmationModal } from "../../../components/ConfirmationModal";
import { dobToAge } from "../../../utils/common";
import EditIcon from "../../../assets/svg/edit.svg?react";
import TrashIcon from "../../../assets/svg/trash.svg?react";
import ResetPasswordIcon from "../../../assets/svg/reset-password.svg?react";
import ResetPasswordModal from "../../../components/ResetPasswordModal";

const UsersGrid = () => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState("");
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    departmentId: null,
    departmentName: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const { getStaffListApi, deleteStaffApi } = useSelector(
    (state) => state.staffManagement
  );
  const { data, isLoading } = getStaffListApi;
  const pageLimit = data?.response?.pageLimit;
  const totalRecords = data?.response?.totalRecords;
  const totalPages = data?.response?.totalPages;
  const staffs =
    data?.response?.list?.map((staff) => {
      const {
        userId,
        name,
        departmentData,
        userName,
        active,
        gender,
        profileData,
        dateOfBirth,
      } = staff;
      return {
        id: userId,
        name,
        departmentName: departmentData?.name || "N/A",
        userName,
        active,
        gender,
        profileName: profileData?.name || "N/A",
        age: dobToAge(dateOfBirth),
      };
    }) || [];
  const { status, data: deleteStaffData } = deleteStaffApi;
  const goTo = useNavigateTo();

  const handleEdit = (id) => {
    goTo(`/staff/update/${id}`);
  };

  const handleDeleteClick = (id) => {
    // Find the department name for the confirmation dialog
    setModalOpen(true);
    const user = data?.response?.list?.find((user) => user.id === id);
    const userName = user ? user.name : "this user";

    setConfirmationModal({
      isOpen: true,
      userId: id,
      userName: userName,
    });
  };
  const handleConfirmDelete = async () => {
    setModalOpen(false);
    if (confirmationModal.userId) {
      dispatch(deleteStaff(confirmationModal.userId));
      setConfirmationModal({
        isOpen: false,
        userId: null,
        userName: "",
      });
    }
  };

  const handleCancelDelete = () => {
    setModalOpen(false);
    setConfirmationModal({
      isOpen: false,
      userId: null,
      userName: "",
    });
  };

  const commonProps = {
    className: "h-4 lg:h-6 w-4 lg:w-6 cursor-pointer",
  };

  const headerData = [
    {
      name: "Name",
      value: "name",
      _class: "col-span-2",
    },
    {
      name: "Department Name",
      value: "departmentName",
      _class: "col-span-2",
    },
    {
      name: "User Name",
      value: "userName",
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
      name: "Profile",
      value: "profileName",
      type: HeaderType.roleBudge,
      _class:
        "max-w-full text-nowrap overflow-x-auto whitespace-nowrap scrollbar-hide",
    },
    {
      name: "Age",
      value: "age",
    },
    {
      name: "Actions",
      value: "actions",
      _class: "col-span-2",
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
        {
          label: "Reset Password",
          icon: <ResetPasswordIcon {...commonProps} />,
          onClick: (row) => setResetModalOpen(row.id),
        },
      ],
    },
  ];

  // Toast handling in parent component
  useEffect(() => {
    if (status === apiResponseType.success) {
      toast.success(deleteStaffData);
      dispatch(resetDeleteStaffStatus());
      dispatch(getStaffList());
      setCurrentPage(data?.response?.currentPage);
    }

    if (status === apiResponseType.failed) {
      // console.log({ error });
      toast.error("Failed to delete staff");
      dispatch(resetDeleteStaffStatus());
    }
  }, [status]);

  useEffect(() => {
    dispatch(getStaffList({ page: currentPage }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    return () => {
      dispatch(resetDeleteStaffStatus());
    };
  }, []);

  return (
    <>
      <TableGrid
        isLoading={isLoading}
        data={staffs}
        columns={headerData}
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
              Are you sure you want to delete the user{" "}
              <em>{confirmationModal.userName}</em>.{" "}
              <strong>This action cannot be undone.</strong>
            </span>
          }
        />
      )}

      {/* Reset Password Modal */}
      <ResetPasswordModal
        open={resetModalOpen}
        onClose={() => {
          setResetModalOpen("");
        }}
      />
    </>
  );
};

export default UsersGrid;

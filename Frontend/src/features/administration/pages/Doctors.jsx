import { useEffect, useState } from "react";
import { tabs } from "../helper";
import TabSwitcher from "../../../components/TabSwitcher";
import useDebounce from "../../../hooks/useDebounce";
import SearchBox from "../../../components/Searchbox";
import useNavigateTo from "../../../hooks/useNavigateTo";
import PlusIcon from "../../../components/svgs/PlusIcon";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDoctor,
  getDoctorList,
  resetDeleteDoctorStatus,
} from "../../../slices/doctorSlice";
import { multipleErrorToastMessage } from "../../../utils/toastMessage";
import { apiResponseType } from "../../../utils/types";
import AccordionItem from "../components/AccordionItem";
import AccordionGroupSkeleton from "../components/AccordionSkeleton";
import Pagination from "../../../components/Pagination";
import ResetPasswordModal from "../../../components/ResetPasswordModal";
import { ConfirmationModal } from "../../../components/ConfirmationModal";
import useApiResponseHandler from "../../../hooks/useApiResponseHandler";
import { ROUTES } from "../../../routes/helper";
import Button from "../../../components/Buttons/Button";
import { EmptyData } from "../../../components/EmptyData";

const Doctors = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [resetModalOpen, setResetModalOpen] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [openItem, setOpenItem] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState("");
  const [isDataThere, setIsDataThere] = useState(false);
  const goTo = useNavigateTo();
  const { getDoctorListApi, deleteDoctorApi } = useSelector(
    (state) => state.doctorManagement
  );
  const dispatch = useDispatch();
  const { data, status, isLoading } = getDoctorListApi;

  const pageLimit = data?.response?.pageLimit;
  const totalRecords = data?.response?.totalRecords;
  const totalPages = data?.response?.totalPages;
  const doctors = data?.response?.list || [];

  const handleClick = (id) => {
    setOpenItem((prev) => (prev === id ? null : id));
  };

  const handleDeleteClick = (id) => setConfirmationModal(id);

  const handleConfirmDelete = async () => {
    if (confirmationModal) {
      dispatch(deleteDoctor(confirmationModal));
      setConfirmationModal("");
    }
  };

  const handleCancelDelete = () => {
    // close popup
    setConfirmationModal("");
  };

  useApiResponseHandler({
    status: deleteDoctorApi.status,
    data: deleteDoctorApi.data,
    error: deleteDoctorApi.error,
    resetReduxStatus: () => dispatch(resetDeleteDoctorStatus()),
    updateReduxList: () => dispatch(getDoctorList()),
  });

  useEffect(() => {
    dispatch(
      getDoctorList({ page: currentPage, query: debouncedSearch.trim() })
    );
  }, [dispatch, currentPage, debouncedSearch]);

  useEffect(() => {
    if (status === apiResponseType.success) {
      setCurrentPage(data?.response?.currentPage);
    } else if (status === apiResponseType.failed) {
      multipleErrorToastMessage(getDoctorListApi);
    }
  }, [status]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        !isLoading &&
        !data?.response?.list?.length &&
        !debouncedSearch.trim()
      ) {
        setIsDataThere(true);
      } else {
        setIsDataThere(false);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [isLoading, data, debouncedSearch]);

  return (
    <div className="page">
      <TabSwitcher tabs={tabs} selected={5} />
      <div className="text-blue my-2 flex flex-col items-start gap-1 lg:gap-2 w-full">
        <h2 className="text-xl lg:text-2xl font-medium text-blue">
          Doctor Management
        </h2>
        <p className="text-xs lg:text-sm w-full">
          Easily manage, view, and update doctor profiles, availability, and
          specialties in one place.
        </p>
      </div>

      <div className="flex gap-5 items-center justify-between w-full">
        <SearchBox search={search} setSearch={setSearch} />
        <Button variant="light" onClick={() => goTo(ROUTES.DOCTOR_CREATE)}>
          <PlusIcon />
          Add Doctor
        </Button>
      </div>

      {isDataThere ? (
        <EmptyData from="doctor" />
      ) : (
        <>
          {isLoading ? (
            <AccordionGroupSkeleton />
          ) : (
            Array(doctors) &&
            doctors.length > 0 && (
              <div className="flex flex-col gap-2">
                {doctors.map((item) => (
                  <AccordionItem
                    key={item.userId}
                    item={item}
                    isOpen={openItem === item.userId}
                    handleDeleteClick={handleDeleteClick}
                    setResetModalOpen={setResetModalOpen}
                    onClick={() => handleClick(item.userId)}
                  />
                ))}
              </div>
            )
          )}
        </>
      )}

      {confirmationModal && (
        <ConfirmationModal
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title={<span className="text-blue text-xl">Confirm Delete</span>}
          primaryButtonName={"Delete"}
          content={`Are you sure to delete this doctor? This action cannot be undone.`}
        />
      )}

      {/* Reset Password Modal */}
      <ResetPasswordModal
        open={resetModalOpen}
        onClose={() => setResetModalOpen("")}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        pageLimit={pageLimit}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default Doctors;

import { useEffect, useState } from "react";
import { apiResponseType, HeaderType } from "../../../utils/types";
import SearchBox from "../../../components/Searchbox";
import FilterBox from "../../patient-register/components/FilterBox";
import DateRangeFilter from "../../../components/DateRangeFilter";
import PlusIcon from "../../../components/svgs/PlusIcon";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAppointmentByID,
  getAppointmentList,
  resetUpdateAppointmentStatus,
  updateAppointmentById,
} from "../../../slices/appointmentSlice";
import { formatDateToReadable } from "../../../utils/common";
import TableGrid from "../../../components/table/TableGrid";
import useDebounce from "../../../hooks/useDebounce";
import { filterConfig, searchTypeOptions } from "../helper";
import { tabs as patientRegisterTabs } from "../../patient-register/helper";
import TabSwitcher from "../../../components/TabSwitcher";
import useNavigateTo from "../../../hooks/useNavigateTo";
import { useLocation } from "react-router-dom";
import { RescheduleModal } from "../components/RescheduleModal";
import { toastMessage } from "../../../utils/toastMessage";
import { parse } from "date-fns";
import toast from "react-hot-toast";
import { ConfirmationModal } from "../../../components/ConfirmationModal";
import { getPatientStatusIcon } from "../../../utils/icon";
import TrashIcon from "../../../assets/svg/trash.svg?react";
import Reschedule from "../../../assets/svg/reschedule.svg?react";
import { EmptyData } from "../../../components/EmptyData";
import AntSearchableSelector from "../../../components/AntDesign/AntSearchableSelector";
import PatientUIUtils from "../../../components/PatientUIUtils";
import { ROUTES } from "../../../routes/helper";
import Button from "../../../components/Buttons/Button";
import { usePermission } from "../../../hooks/usePermission";
import ViewOnly from "../../../components/ViewOnly";
import RefreshButton from "../../../components/Buttons/RefreshButton";
import ResetButton from "../../../components/Buttons/ResetButton";
import DownloadCsvButton from "../../../components/Buttons/DownloadCsvButton";

const Appointments = () => {
  const isViewOnly = !usePermission("appointment", "modify");
  const location = useLocation();
  const isRegistrationPage = location.pathname.includes(
    ROUTES.REGISTRATION_APPOINTMENT_LIST
  );
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const [searchBy, setSearchBy] = useState("all");
  const debouncedSearch = useDebounce(search, 500);
  const {
    getAppointmentListApi,
    updateAppointmentByIdApi,
    deleteAppointmentApi,
  } = useSelector((state) => state.appointmentManagement);
  const { data, isLoading: apiLoading, status } = getAppointmentListApi;
  const pageLimit = data?.response?.pageLimit;
  const totalRecords = data?.response?.totalRecords;
  const totalPages = data?.response?.totalPages;
  const goTo = useNavigateTo();
  const [appointmentId, setAppointmentId] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [isDateTimeValid, setIsDateTimeValid] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState("");
  const [searchFilters, setSearchFilters] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [isDataThere, setIsDataThere] = useState(false);
  const [params, setParams] = useState({});
  const commonProps = {
    className: "h-6 w-6",
  };

  const headerData = [
    {
      name: "ID",
      value: "appId",
    },
    {
      name: "Patient Name",
      value: "patientName",
      _class: "col-span-2",
    },
    {
      name: "Doctor Details",
      value: "doctorName",
      _class: "col-span-2",
    },
    {
      name: "Appointment Time",
      value: "registrationTime",
      _class: "col-span-2",
    },
    {
      name: "Appointment Status",
      value: "status",
      _class: "col-span-2",
      type: HeaderType.colorBudge,
    },
    {
      name: "Actions",
      value: "actions",
      _class: "col-span-3",
      type: HeaderType.dynamicAction,
      actions: [
        {
          label: "Start Patient Registration",
          icon: (
            <div className="border rounded-full flex items-center border-blue-200 p-2.5 h-[38px]">
              {getPatientStatusIcon("Walkin")}
              Check-In
            </div>
          ),
          onClick: (row) => {
            goTo(
              `${ROUTES.REGISTRATION_CREATE}?userid=${row.patientId}&appid=${row.appId}`
            );
          },
          disabled: isViewOnly,
        },
        {
          label: "Reshedule Appointment",
          icon: <Reschedule {...commonProps} />,
          onClick: (row) => {
            row?.status === "booked"
              ? setAppointmentId(row?.appId)
              : toast.error(
                  "You may reschedule the appointment if it has not been canceled or completed."
                );
          },
          disabled: isViewOnly,
        },
        {
          label: "Delete Appointment",
          icon: <TrashIcon {...commonProps} />,
          onClick: (row) => {
            row?.status !== "booked" && row?.status !== "rescheduled"
              ? toast.error(
                  "You may cancel the appointment if it has not yet been completed."
                )
              : setDeletePopupOpen(row?.appId);
          },
          disabled: isViewOnly,
        },
      ],
    },
  ];

  const appointmentList =
    data?.response?.list?.map((app) => ({
      id: app?._id,
      appId: app?.appointmentId,
      patientId: app?.patientId,
      patientName: PatientUIUtils(
        app.name,
        app.gender,
        app?.dateOfBirth
        // goto,
        // `/patient/basic-details/${patient._id}`
      ),
      doctorName: app?.doctorDetails ? (
        <div className="flex flex-col justify-center gap-1">
          <span>{`${app?.doctorDetails?.titleName} ${app?.doctorDetails?.name}`}</span>
        </div>
      ) : (
        "Not Assigned"
      ),
      registrationTime: (
        <div className="flex flex-col justify-center gap-1">
          <span>{formatDateToReadable(app?.date)}</span>
          <span className="text-blue/50">{app?.time}</span>
        </div>
      ),
      status: app.status,
    })) || [];

  const handleRefreshQueue = (params) => {
    console.log(params);
    dispatch(getAppointmentList(params));
  };

  useEffect(() => {
    const newParams = {
      page: currentPage,
      searchBy: searchFilters,
      query: debouncedSearch.trim(),
      startDate: dateRange?.[0],
      endDate: dateRange?.[1],
    };
    setParams(newParams);
    dispatch(getAppointmentList(newParams));
  }, [dispatch, currentPage, debouncedSearch, searchFilters, dateRange]);

  useEffect(() => {
    if (
      !apiLoading &&
      !data?.response?.list?.length &&
      !debouncedSearch.trim() &&
      !searchFilters.trim() &&
      !dateRange[0]?.trim() &&
      !dateRange[1]?.trim() &&
      data?.response?.list !== undefined
    ) {
      setIsDataThere(true);
    } else {
      setIsDataThere(false);
    }
  }, [apiLoading, data, debouncedSearch, searchFilters, dateRange]);

  useEffect(() => {
    if (status === apiResponseType.success) {
      setCurrentPage(data?.response?.currentPage);
    }
  }, [status]);

  const onModalCloseButton = () => {
    setAppointmentId("");
  };

  const onRescheduleConfirm = () => {
    const appointmentDateTime = parse(
      rescheduleDate + " " + rescheduleTime,
      "dd-MM-yyyy hh:mm a",
      new Date()
    );
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    if (appointmentDateTime.getTime() >= todayStart.getTime()) {
      dispatch(
        updateAppointmentById({
          id: appointmentId,
          data: {
            date: rescheduleDate,
            time: rescheduleTime,
          },
        })
      );
    } else {
      toast.error("Please choose a future date and time for the appointment.");
    }
  };

  useEffect(() => {
    if (rescheduleDate !== "" && rescheduleTime !== "")
      setIsDateTimeValid(true);
    else setIsDateTimeValid(false);
  }, [rescheduleDate, rescheduleTime]);

  useEffect(() => {
    if (updateAppointmentByIdApi?.status === apiResponseType.success) {
      toastMessage(updateAppointmentByIdApi);
      setIsDateTimeValid(false);
      setAppointmentId("");
      dispatch(getAppointmentList({ page: currentPage }));
      dispatch(resetUpdateAppointmentStatus());
    } else if (deleteAppointmentApi?.status === apiResponseType.success) {
      toastMessage(updateAppointmentByIdApi);
      setDeletePopupOpen(false);
      dispatch(getAppointmentList({ page: currentPage }));
    }
  }, [updateAppointmentByIdApi, deleteAppointmentApi]);

  const handleConfirmDelete = async () => {
    if (deletePopupOpen) {
      dispatch(deleteAppointmentByID(deletePopupOpen));
    }
    setDeletePopupOpen("");
  };

  const handleCancelDelete = () => {
    setDeletePopupOpen("");
  };

  return (
    <>
      <div className="page">
        {isDataThere ? (
          <EmptyData from="appointment" />
        ) : (
          <div className="flex flex-col gap-2">
            {isRegistrationPage ? (
              <TabSwitcher tabs={patientRegisterTabs} selected={4} />
            ) : (
              <div className="flex flex-col gap-2 text-blue mb-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-medium">Appointments</h2>
                  {isViewOnly && <ViewOnly />}
                </div>
                <p className="text-sm w-1/2">
                  View and manage all appointments here.
                </p>
              </div>
            )}
            <div className="flex justify-between w-full items-start xl:items-center mt-2 gap-2">
              <div className="flex flex-col xl:flex-row gap-2">
                <div className="flex gap-2">
                  <AntSearchableSelector
                    name="searchby"
                    value={searchBy}
                    onChange={setSearchBy}
                    options={searchTypeOptions}
                    labelName="Search By"
                    isCompressed
                  />
                  <SearchBox
                    search={search}
                    setSearch={setSearch}
                    isCompressed
                  />
                  <ResetButton
                    iconVisible={false}
                    onClick={() => {
                      setSearchBy("all");
                      setSearch("");
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <FilterBox
                    filterConfig={filterConfig}
                    titleName={"Filter Appointments"}
                    setSearchFilters={setSearchFilters}
                  />
                  <DateRangeFilter
                    handleDateSelection={(date) => setDateRange(date)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RefreshButton
                  onClick={() => handleRefreshQueue(params)}
                  loading={apiLoading}
                  content="Refresh Appointments"
                />
                {!isViewOnly ? (
                  <Button
                    variant="light"
                    className="!p-3 text-xs lg:text-sm"
                    onClick={() => {
                      goTo(ROUTES.APPOINTMENT_CREATE);
                    }}
                  >
                    <span className="hidden lg:flex">
                      <PlusIcon />
                    </span>
                    Create New Appointment
                  </Button>
                ) : null}
                <DownloadCsvButton
                  data={data?.response?.list}
                  fileName={`All-Appointments-${new Date().getTime()}.csv`}
                  keysToRemove={[
                    "serialId",
                    "doctorDetails._id",
                    "departmentDetails._id",
                    "hospitalId",
                    "patientId",
                    "_id",
                    "doctorId",
                  ]}
                />
              </div>
            </div>

            <TableGrid
              columns={headerData}
              data={appointmentList}
              isLoading={apiLoading}
              allowPagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageLimit={pageLimit}
              totalRecords={totalRecords}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>

      {appointmentId && (
        <RescheduleModal
          onClose={onModalCloseButton}
          onConfirm={onRescheduleConfirm}
          setRescheduleDate={setRescheduleDate}
          setRescheduleTime={setRescheduleTime}
          isDateTimeValid={isDateTimeValid}
          title={`Reschedule Appointment for ${appointmentId}`}
        />
      )}

      {deletePopupOpen && (
        <ConfirmationModal
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title={<span className="text-blue text-xl">Confirm Delete</span>}
          primaryButtonName={"Delete"}
          content={`Are you sure you want to delete the Appointment "${deletePopupOpen}"? This action cannot be undone.`}
        />
      )}
    </>
  );
};

export default Appointments;

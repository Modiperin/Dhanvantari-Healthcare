import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "../../../hooks/useDebounce";
import SearchBox from "../../../components/Searchbox";
import {
  addNewPatient,
  endVisit,
  getPatientQ,
  updateVisitDetails,
} from "../../../slices/nurseOPD";
import CardList from "../../../components/listing/card/CardList";
import PatientCard from "../components/PatientCard";
import FilterBox from "../../patient-register/components/FilterBox";
import DateRangeFilter from "../../../components/DateRangeFilter";
import CardListSkeleton from "../../../components/listing/CardListSkeleton";
import PatientCardSkeleton from "../loader/PatientCardSkeleton";
import Pagination from "../../../components/Pagination";
import {
  addSocketMessageHandler,
  removeSocketMessageHandler,
} from "../../../utils/socketMessages";
import Toggle from "../../../components/Toggle";
import useCooldown from "../../../hooks/useCooldown";
import TooltipWrapper from "../../../components/ReactTooltip";
import { successToastMessage } from "../../../utils/toastMessage";
import { filterConfig } from "../helper";
import EmptyCase from "../components/EmptyCase";
import { useReactToPrint } from "react-to-print";
import SpinnerLoader from "../../../components/loader/SpinnerLoader";
import { DEFAULT_HOSPITAL_LOGO } from "../../../utils/config";
import RefreshButton from "../../../components/Buttons/RefreshButton";

const DoctorOPD = () => {
  const printRef = useRef();
  const [printPatient, setPrintPatient] = useState(null);
  const [printLoading, setPrintLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [contDoneToggle, setContDone] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilters, setSearchFilters] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [toggleCooldown, triggerToggleCooldown] = useCooldown(3000);
  const [refreshCooldown, triggerRefreshCooldown] = useCooldown(2000);
  const { opdListApi } = useSelector((state) => state.nurseOPD);
  const user = useSelector((state) => state.user?.userInfo?.response);
  const dispatch = useDispatch();

  // TODO: Change the API call to fetch doctor-specific data
  const list = opdListApi?.data?.response?.list || [];

  const {
    totalPages = 1,
    totalRecords = 0,
    pageLimit = 1,
    doneCount = 0,
  } = opdListApi?.data?.response || {};

  const fetchPatientQueue = () => {
    dispatch(
      getPatientQ({
        from: "doctor",
        query: debouncedSearch.trim(),
        page: currentPage,
        startDate: dateRange?.[0],
        endDate: dateRange?.[1],
        searchBy: searchFilters,
        contStatus: contDoneToggle ? "Completed" : "Pending,Ongoing",
      })
    );
  };

  useEffect(() => {
    fetchPatientQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    currentPage,
    debouncedSearch,
    dateRange,
    searchFilters,
    contDoneToggle,
  ]);

  // Handle new patient event
  useEffect(() => {
    const addNewPatientEventHandler = (event) => {
      if (event?.eventName === "NEW_PATIENT") {
        dispatch(addNewPatient(event.data));
      } else if (event.eventName === "END_VISIT") {
        dispatch(endVisit(event.data));
      }
    };

    addSocketMessageHandler(addNewPatientEventHandler);

    return () => {
      removeSocketMessageHandler(addNewPatientEventHandler);
    };
  }, [dispatch]);

  const handleEndVisit = (visitId) => {
    dispatch(
      updateVisitDetails({ id: visitId, data: { status: "Completed" } })
    );
  };

  const handleRefreshQueue = () => {
    triggerRefreshCooldown();
    fetchPatientQueue();
    successToastMessage("We are refreshing the patient queue.");
  };

  const printEmptyCase = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Empty_Case`,
    removeAfterPrint: true,
    pageStyle: `
        @page {
          size: A4;
          margin: 5mm;
        }
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        } 
        body::before {
         content: "";
         position: fixed;
         top: 50%;
         left: 50%;
         width: 300px;
         height: 300px;
         background: url(${
           user?.hospitalData?.logo || DEFAULT_HOSPITAL_LOGO
         }) no-repeat center center;
         background-size: contain;
         opacity: 0.08;       
         transform: translate(-50%, -50%); /* optional tilt */
         z-index: -1;          
         pointer-events: none; 
       }
       .print-footer {
         position: fixed;
         bottom: 0mm;                /* space from bottom */
         left: 50%;
         transform: translateX(-50%); /* center horizontally */
        }
      `,
    onAfterPrint: () => setPrintLoading(false),
  });

  const handlePrint = (petient) => {
    setPrintLoading(true);
    setPrintPatient(petient);
    setTimeout(() => {
      printEmptyCase();
      // setPrintLoading(false);
    }, 0);
  };

  return (
    <div className="bg-white rounded-lg w-full min-h-[100dvh] p-5 flex flex-1 flex-col gap-3">
      <div className="flex flex-col lg:flex-row gap-2">
        <div className="flex items-center gap-2">
          <SearchBox
            search={search}
            setSearch={setSearch}
            placeholder="Search Patient"
            isCompressed
          />
          <FilterBox
            filterConfig={filterConfig}
            titleName="Filter Nurse OPDs"
            setSearchFilters={setSearchFilters}
          />
        </div>
        <div className="flex items-center gap-2">
          <DateRangeFilter handleDateSelection={(date) => setDateRange(date)} />
          <RefreshButton
            onClick={handleRefreshQueue}
            loading={opdListApi.isLoading || refreshCooldown}
            cooldown={3000}
            disabled={opdListApi.isLoading || refreshCooldown}
            content="Refresh Doctor OPD Queue"
          />

          <TooltipWrapper
            id="vitals-toggle"
            content="Under cooldown, please wait."
            visible={toggleCooldown}
          >
            <Toggle
              isDisabled={toggleCooldown}
              leftSideLabel="Check in"
              rightSideLabel="Check out"
              isChecked={contDoneToggle}
              toggleOffClass="bg-green-500/80"
              toggleOnClass="bg-red-500/80"
              handleCheckboxChange={() => {
                setContDone((prev) => !prev);
                triggerToggleCooldown();
              }}
              counts={{
                doneCount: contDoneToggle ? totalRecords : doneCount,
                notDoneCount: contDoneToggle ? doneCount : totalRecords,
              }}
            />
          </TooltipWrapper>
        </div>
      </div>

      {opdListApi.isLoading ? (
        <CardListSkeleton SkeletonComponent={PatientCardSkeleton} />
      ) : (
        <>
          <CardList
            data={list || []}
            renderCard={(patient, idx) => (
              <PatientCard
                key={patient.id || idx}
                visitId={patient.visitId}
                name={patient.name}
                gender={patient.gender}
                age={patient.dateOfBirth}
                priority={patient.priority}
                phoneNo={patient.phoneNo}
                status={patient.status}
                currentStatus={patient.contStatus}
                visitType={patient.type}
                time={patient.createdAt}
                doctorDetails={patient.doctorDetails}
                departmentDetails={patient.departmentDetails}
                vitalDetails={patient.vitalDetails}
                department={patient.department}
                onOtherAction={() => {}}
                from="doctoropd"
                handleEndVisit={handleEndVisit}
                handlePrint={handlePrint}
              />
            )}
            emptyText="No Patients Present in Queue."
          />
          {list?.length ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalRecords={totalRecords}
              pageLimit={pageLimit}
              onPageChange={(page) => setCurrentPage(page)}
            />
          ) : null}
        </>
      )}

      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div ref={printRef}>
          <EmptyCase
            doctorName={printPatient?.doctorDetails?.name || "N/A"}
            patientName={printPatient?.patientName || "N/A"}
            gender={printPatient?.gender || "N/A"}
            age={printPatient?.age || "N/A"}
            hospitalData={user?.hospitalData}
            doctorData={printPatient?.doctorDetails || "N/A"}
          />
        </div>
      </div>

      {printLoading ? <SpinnerLoader message="Preparing print..." /> : null}
    </div>
  );
};

export default DoctorOPD;

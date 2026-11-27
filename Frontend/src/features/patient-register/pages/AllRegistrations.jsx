import { useEffect, useState } from "react";
import TabSwitcher from "../../../components/TabSwitcher";
import { filterConfig, searchTypeOptions, tabs } from "../helper";
import { apiResponseType, HeaderType } from "../../../utils/types";
import TableGrid from "../../../components/table/TableGrid";
import { useDispatch, useSelector } from "react-redux";
import { getPatientVisitList } from "../../../slices/patientVisitSlice";
import { formatDateToReadable } from "../../../utils/common";
import { formatTimeToAMPM } from "../../../utils/dateAndTime";
import SearchBox from "../../../components/Searchbox";
import useDebounce from "../../../hooks/useDebounce";
import FilterBox from "../components/FilterBox";
import DateRangeFilter from "../../../components/DateRangeFilter";
// import PlusIcon from "../../../assets/svg/plus.svg?react";
import { EmptyData } from "../../../components/EmptyData";
import AntSearchableSelector from "../../../components/AntDesign/AntSearchableSelector";
import PatientUIUtils from "../../../components/PatientUIUtils";
import RefreshButton from "../../../components/Buttons/RefreshButton";
import ResetButton from "../../../components/Buttons/ResetButton";
import DownloadCsvButton from "../../../components/Buttons/DownloadCsvButton";
// import Button from "../../../components/Buttons/Button";

const AllRegistrations = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState("all");
  const debouncedSearch = useDebounce(search, 500);
  const dispatch = useDispatch();
  const { getPatientVisitListApi } = useSelector((state) => state.patientVisit);
  const { data, status, isLoading: apiLoading } = getPatientVisitListApi;
  const [searchFilters, setSearchFilters] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [params, setParams] = useState({});
  const [isDataNotThere, setIsDataNotThere] = useState(false);
  // const handleOther = (id) => {
  //   console.log("Handle other", id);
  // };
  // console.log({apiLoading});

  console.log({ dateRange, searchFilters });

  const pageLimit = data?.response?.pageLimit;
  const totalRecords = data?.response?.totalRecords;
  const totalPages = data?.response?.totalPages;

  const patientVisits =
    data?.response?.list?.map((patient) => ({
      id: patient._id,
      visitId: patient?.visitId,
      patientName: PatientUIUtils(
        patient.name,
        patient.gender,
        patient?.dateOfBirth
        // goto,
        // `/patient/basic-details/${patient._id}`
      ),
      doctorName: patient.doctorDetails?.name || "Not Assigned",
      priority: patient.priority,
      registrationTime: (
        <div className="flex flex-col justify-center gap-1">
          <span>{formatDateToReadable(patient.createdAt, false, true)}</span>
          <span className="text-blue/50">
            {formatTimeToAMPM(patient.createdAt)}
          </span>
        </div>
      ),

      type: patient.type,
      status: patient.status,
    })) || [];

  // console.log({patientVisits});

  // const commonProps = {
  //   className: "h-4 lg:h-6 w-4 lg:w-6 cursor-pointer",
  // };

  const headerData = [
    {
      name: "Visit Id",
      value: "visitId",
      _class: "col-span-2 lg:col-span-1",
    },
    {
      name: "Patient Name",
      value: "patientName",
      _class: "col-span-3",
    },
    {
      name: "Doctor Name",
      value: "doctorName",
      _class: "col-span-2 lg:col-span-1",
    },
    {
      name: "Priority",
      value: "priority",
      type: HeaderType.flag,
      _class: "flex w-full justify-center",
    },
    {
      name: "Registration Time",
      value: "registrationTime",
      _class: "col-span-2",
    },
    {
      name: "Walkin/Appointment",
      value: "type",
      _class: "lg:col-span-2",
      type: HeaderType.iconText,
    },
    {
      name: "Check-out or Not",
      value: "status",
      _class: "lg:col-span-2",
      type: HeaderType.iconText,
    },
    // {
    //   name: "Actions",
    //   value: "actions",
    //   _class: "col-span-1",
    //   type: HeaderType.dynamicAction,
    //   actions: [
    //     {
    //       label: "Actions",
    //       icon: (
    //         <Button
    //           className="lg:gap-1 text-[9px] xl:text-xs px-1 xl:px-3 rounded-full"
    //           variant="light"
    //         >
    //           <PlusIcon {...commonProps} />
    //           Actions
    //         </Button>
    //       ),
    //       onClick: (row) => handleOther(row.id),
    //     },
    //   ],
    // },
  ];

  const visitApiCalling = (newParams) => {
    dispatch(getPatientVisitList(newParams));
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
    visitApiCalling(newParams);
  }, [dispatch, currentPage, debouncedSearch, searchFilters, dateRange]);

  useEffect(() => {
    if (status === apiResponseType.success) {
      setCurrentPage(data?.response?.currentPage);
    }
  }, [status]);

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
      setIsDataNotThere(true);
    } else {
      setIsDataNotThere(false);
    }
  }, [apiLoading, data, debouncedSearch]);

  return (
    <div className="page">
      <TabSwitcher tabs={tabs} selected={3} />
      {isDataNotThere ? (
        <EmptyData from="registrations" />
      ) : (
        <>
          <div className="flex justify-between w-full">
            <div className="flex flex-col xl:flex-row gap-2">
              <div className="flex gap-2">
                <AntSearchableSelector
                  name="searchby"
                  value={searchBy}
                  onChange={setSearchBy}
                  isCompressed
                  options={searchTypeOptions}
                  defaultOption={"Search By"}
                  _className=""
                />
                <SearchBox search={search} setSearch={setSearch} isCompressed />
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
                  titleName="Filter Registrations"
                  setSearchFilters={setSearchFilters}
                />
                <DateRangeFilter
                  handleDateSelection={(date) => setDateRange(date)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 h-10 2xl:h-10">
              <RefreshButton
                onClick={() => visitApiCalling(params)}
                loading={apiLoading}
                content="Refresh Registrations"
              />
              <DownloadCsvButton
                name="Download Registrations"
                fileName={`All-Registrations-${new Date().getTime()}.csv`}
                data={data?.response?.list || []}
                keysToRemove={[
                  "doctorDetails._id",
                  "doctorDetails.departmentId",
                  "departmentDetails._id",
                  "vitalDetails.vitalId",
                  "vitalDetails._id",
                ]}
              />
            </div>
          </div>

          <TableGrid
            columns={headerData}
            data={patientVisits}
            isLoading={apiLoading}
            allowPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageLimit={pageLimit}
            totalRecords={totalRecords}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </div>
  );
};

export default AllRegistrations;

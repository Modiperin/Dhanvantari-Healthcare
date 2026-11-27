import React, { useEffect, useState } from "react";
import SearchBox from "../../../components/Searchbox";
import PlusIcon from "../../../components/svgs/PlusIcon";
import useDebounce from "../../../hooks/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import { getPatientList } from "../../../slices/patientSlice";
import { multipleErrorToastMessage } from "../../../utils/toastMessage";
import { apiResponseType, HeaderType } from "../../../utils/types";
import TableGrid from "../../../components/table/TableGrid";
import useNavigateTo from "../../../hooks/useNavigateTo";
import { formatDateToReadable } from "../../../utils/common";
import PatientUIUtils from "../../../components/PatientUIUtils";
// import { downloadCSV } from "../../../utils/downloadCSV";
import VitalCollectionModal from "../components/VitalCollectionModal";
import FilterBox from "../../patient-register/components/FilterBox";
import { filterConfig } from "../helper";
import Button from "../../../components/Buttons/Button";
import { usePermission } from "../../../hooks/usePermission";
import { ROUTES } from "../../../routes/helper";
import { EmptyData } from "../../../components/EmptyData";

const AllPatientList = () => {
  const isViewOnly = !usePermission("patient", "modify");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { getPatientListApi } = useSelector((state) => state.patientManagement);
  const { data, isLoading, status } = getPatientListApi;
  const pageLimit = data?.response?.pageLimit;
  const totalRecords = data?.response?.totalRecords;
  const totalPages = data?.response?.totalPages;
  const goto = useNavigateTo();
  const [openVitalModal, setOpenVitalModal] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [searchFilters, setSearchFilters] = useState("");
  const [isDataThere, setIsDataThere] = useState(false);

  useEffect(() => {
    dispatch(
      getPatientList({
        page: currentPage,
        query: debouncedSearch.trim(),
        searchBy: searchFilters,
      })
    );
  }, [dispatch, currentPage, debouncedSearch, searchFilters]);

  useEffect(() => {
    if (status === apiResponseType.failed) {
      multipleErrorToastMessage(getPatientListApi);
    } else if (status === apiResponseType.success) {
      setCurrentPage(data?.response?.currentPage || 1);
    }
  }, [status]);

  const patients =
    data?.response?.list?.map((patient) => ({
      id: patient._id,
      patientName: PatientUIUtils(
        patient.name,
        patient.gender,
        patient?.dateOfBirth,
        goto,
        `/patient/basic-details/${patient._id}`
      ),
      patientId: "P-".concat(patient.serialId),
      bloodGroup: patient.bloodGroup,
      contactDetail: (
        <div className="flex gap-0.5">
          <span>+91{patient.phoneNo}</span>
          <span className="text-blue/50">/</span>
          <span className="text-blue/90">{patient?.email || ``}</span>
        </div>
      ),
      lastVisited: patient?.lastVisited
        ? formatDateToReadable(patient?.lastVisited)
        : formatDateToReadable(patient?.createdAt, false, true),
    })) || [];

  const options = [
    {
      label: "View Patient",
      onClick: (row) => {
        goto(`${ROUTES.PATIENT_BASIC_DETAIL}/${row?.id}`);
      },
    },
  ];

  if (!isViewOnly) {
    options.push(
      ...[
        {
          label: "Start Registration",
          onClick: (row) => {
            goto(`/registration/create?userid=${row?.id}`);
          },
        },
        {
          label: "Collect Vitals",
          onClick: (row) => {
            setOpenVitalModal(true);
            setPatientId(row?.id);
            // console.log("Delete action triggered for", name);
            // handleDeleteClick(id);
          },
        },
        {
          label: "Patient Billing",
          onClick: () => {
            // console.log("Reset Password action triggered for", name);
            // setResetModalOpen(id);
          },
        },
      ]
    );
  }

  const headerData = [
    {
      name: "Patient ID",
      value: "patientId",
    },
    {
      name: "Patient Name",
      value: "patientName",
      _class: "col-span-2",
    },
    {
      name: "Contact Detail",
      value: "contactDetail",
      _class: "col-span-3",
    },
    {
      name: "Blood Group",
      value: "bloodGroup",
      _class: "col-span-2 text-center",
    },
    {
      name: "Last Visited",
      value: "lastVisited",
      _class: "col-span-2",
    },
    {
      name: "Actions",
      value: "actions",
      _class: "col-span-2",
      type: HeaderType.actionWithSubMenu,
      options,
    },
  ];

  useEffect(() => {
    if (
      !isLoading &&
      !data?.response?.list?.length &&
      !debouncedSearch.trim() &&
      !searchFilters.trim() &&
      data?.response?.list !== undefined
    ) {
      setIsDataThere(true);
    } else {
      setIsDataThere(false);
    }
  }, [isLoading, data, debouncedSearch, searchFilters]);

  return (
    <div className="page">
      {isDataThere ? (
        <EmptyData from="patient" />
      ) : (
        <div>
          <div className="text-blue my-3 flex flex-col items-start gap-3 w-full">
            <h2 className="text-xl lg:text-2xl font-medium text-blue">
              Patients
            </h2>
            <p className="text-xs lg:text-sm">
              This page will show all the registered patients in the system. You
              can manage patients here, including adding new ones, updating
              existing ones and delete any existing patients.
            </p>
          </div>
          <div className="flex gap-5 my-2 items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <SearchBox search={search} setSearch={setSearch} />
              <FilterBox
                filterConfig={filterConfig}
                titleName="Filter Patients"
                setSearchFilters={setSearchFilters}
              />
            </div>
            {/* {!isViewOnly && (
              <Button
                variant="light"
                // onClick={() => downloadCSV(data?.response?.list)}
              >
                <PlusIcon />
                Create New Patient
              </Button>
            )} */}
          </div>
          <TableGrid
            data={patients}
            columns={headerData}
            isLoading={isLoading}
            allowPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageLimit={pageLimit}
            totalRecords={totalRecords}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {openVitalModal && (
        <VitalCollectionModal
          open={openVitalModal}
          onClose={() => setOpenVitalModal(false)}
          patientId={patientId}
          className="min-w-100vh"
        />
      )}
    </div>
  );
};

export default AllPatientList;

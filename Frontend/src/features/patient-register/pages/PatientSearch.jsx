import { useEffect, useState } from "react";
import TabSwitcher from "../../../components/TabSwitcher";
import { tabs } from "../helper";
import SearchBoxForPatient from "../components/SearchBoxForPatient";
import { useDispatch, useSelector } from "react-redux";
import { getPatientList } from "../../../slices/patientSlice";
import { apiResponseType, HeaderType } from "../../../utils/types";
import TableGrid from "../../../components/table/TableGrid";
import { formatDateToReadable } from "../../../utils/common";
import IconButton from "../../../components/IconButton";
import PlusIcon from "../../../assets/svg/plus.svg?react";
import { EmptyData } from "../../../components/EmptyData";
import PatientUIUtils from "../../../components/PatientUIUtils";

const PatientSearch = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { getPatientListApi } = useSelector((state) => state.patientManagement);
  const { data, status, isLoading } = getPatientListApi;
  const [search, setSearch] = useState("");
  const handleOther = (id) => {
    console.log("Handle other", id);
  };

  const pageLimit = data?.response?.pageLimit;
  const totalRecords = data?.response?.totalRecords;
  const totalPages = data?.response?.totalPages;

  const patients =
    data?.response?.list?.map((patient) => ({
      id: patient._id,
      patientName: PatientUIUtils(
        patient.name,
        patient.gender,
        patient?.dateOfBirth
        // patient._id,
        // goto,
        // `/patient/basic-details/${patient._id}`
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
      lastVisited: patient?.updatedAt
        ? formatDateToReadable(patient?.updatedAt, false, true)
        : formatDateToReadable(patient?.createdAt, false, true),
    })) || [];

  const commonProps = {
    className: "h-4 lg:h-6 w-4 lg:w-6 cursor-pointer",
  };

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
      type: HeaderType.dynamicAction,
      actions: [
        {
          label: "Actions",
          icon: (
            <IconButton name="Actions" className="gap-2">
              <PlusIcon {...commonProps} />
            </IconButton>
          ),
          onClick: (row) => handleOther(row.id),
        },
      ],
    },
  ];

  useEffect(() => {
    dispatch(getPatientList({ page: currentPage }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (status === apiResponseType.success) {
      setCurrentPage(data?.response?.currentPage);
    }
  }, [status]);

  return (
    <div className="page">
      <TabSwitcher tabs={tabs} selected={2} />
      {!isLoading && !data?.response?.list?.length && !search.trim() ? (
        <EmptyData from="patient" />
      ) : (
        <>
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
          <SearchBoxForPatient setSearchForParent={setSearch} />
          <TableGrid
            columns={headerData}
            data={patients}
            isLoading={isLoading}
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

export default PatientSearch;

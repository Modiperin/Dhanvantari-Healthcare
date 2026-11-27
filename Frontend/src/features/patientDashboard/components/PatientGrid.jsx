import React, { useState } from "react";
import { useSelector } from "react-redux";
import TableGrid from "../../../components/table/TableGrid";
import { HeaderType } from "../../../utils/types";
import PlusIcon from "../../../components/svgs/PlusIcon";
import IconButton from "../../../components/IconButton";
import { dobToAge, formatDateToReadable } from "../../../utils/common";
import useNavigateTo from "../../../hooks/useNavigateTo";

const commonProps = {
  className: "h-6 w-6 cursor-pointer",
};

export const headerData = [
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
        // onClick: (row) => handleOther(row.id),
      },
    ],
  },
];

export const PatientGrid = () => {
  const { getPatientListApi } = useSelector((state) => state.patientManagement);
  const { data,isLoading } = getPatientListApi;
  const pageLimit = data?.response?.pageLimit;
  const totalRecords = data?.response?.totalRecords;
  const totalPages = data?.response?.totalPages;
  const [currentPage, setCurrentPage] = useState(1);
  const goto=useNavigateTo()

  const patients =
    data?.response?.list?.map((patient) => ({
      id: patient._id,
      patientName: (
        <div className="flex capitalize gap-0.5" onClick={()=> goto(`/patient/view/basic-details/${patient._id}`)}>
          <span className="text-blue-500 capitalize cursor-pointer">
            {patient.name}
          </span>
          <span className="text-blue/50">|</span>
          <span> {patient.gender},</span>
          <span className="text-blue/90">
            {patient?.dateOfBirth &&
              dobToAge(patient?.dateOfBirth).toString().concat("y")}
          </span>
        </div>
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
  return (
    <>
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
    </>
  );
};

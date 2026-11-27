import { useEffect, useState } from "react";
import TabSwitcher from "../../../components/TabSwitcher";
import { tabs } from "../helper";
import useDebounce from "../../../hooks/useDebounce";
import { filterConfig } from "../../payment/helper";
import SearchBox from "../../../components/Searchbox";
import useNavigateTo from "../../../hooks/useNavigateTo";
import { ROUTES } from "../../../routes/helper";
import FilterBox from "../../patient-register/components/FilterBox";
import DateRangeFilter from "../../../components/DateRangeFilter";
import Button from "../../../components/Buttons/Button";
import { useDispatch, useSelector } from "react-redux";
import PatientUIUtils from "../../../components/PatientUIUtils";
import { apiResponseType, HeaderType } from "../../../utils/types";
import { getPharmacies } from "../../../slices/pharmacySlice";
import GenerateBillIcon from "../../../assets/svg/generate-bill.svg?react";
import TrashIcon from "../../../assets/svg/trash.svg?react";
import { EmptyData } from "../../../components/EmptyData";
import TableGrid from "../../../components/table/TableGrid";

const PharmacyOPD = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilters, setSearchFilters] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const goTo = useNavigateTo();
  const [isDataNotThere, setIsDataNotThere] = useState(false);
  const { getPharmaciesApi } = useSelector((state) => state.pharmacy);
  const { data, status, isLoading } = getPharmaciesApi;
  const dispatch = useDispatch();

  const pageLimit = data?.response?.pageLimit;
  const totalRecords = data?.response?.totalRecords;
  const totalPages = data?.response?.totalPages;

  useEffect(() => {
    if (
      !isLoading &&
      !data?.response?.list?.length &&
      !debouncedSearch.trim() &&
      !searchFilters.trim() &&
      !dateRange[0]?.trim() &&
      !dateRange[1]?.trim()
    ) {
      setIsDataNotThere(true);
    } else {
      setIsDataNotThere(false);
    }
  }, [isLoading, data, debouncedSearch, searchFilters, dateRange]);

  const pharmaciesQueue =
    data?.response?.list?.map((p) => ({
      id: p._id,
      visitId: p?.visitId,
      serialId: p?.serialId,
      patientName: PatientUIUtils(p.name, p.gender, p?.dateOfBirth),
      phoneNo: "+91".concat(p?.phoneNo),
      patientId: p?.patientId,
      pid: p.patientId,
      name: p?.name,
      pharmacyId: p?.pharmacyId,
      isAmountPaid: p?.isAmountPaid,
    })) || [];

  // eslint-disable-next-line no-unused-vars
  const handleDeleteClick = (row) => {
    // console.log({ row });
  };

  const handleGenerateBill = (row) => {
    if (row.pharmacyId) {
      goTo(
        `${ROUTES.UPDATE_PHARMACY}/${row.pharmacyId}?visitId=${row.visitId}`
      );
    } else {
      goTo(`${ROUTES.CREATE_PHARMACY}?visitId=${row.visitId}`);
    }
  };

  const commonProps = {
    className: "h-4 lg:h-6 w-4 lg:w-6 cursor-pointer",
  };

  const headerData = [
    {
      name: "Patient Id",
      value: "serialId",
    },
    {
      name: "Visit Id",
      value: "visitId",
    },
    {
      name: "Patient Name",
      value: "patientName",
      _class: "col-span-3",
    },
    {
      name: "Phone",
      value: "phoneNo",
      _class: "col-span-2",
    },
    {
      name: "Paid",
      value: "isAmountPaid",
      type: HeaderType.colorBudge,
      _class: "col-span-2",
    },
    {
      name: "Actions",
      value: "actions",
      _class: "col-span-3",
      type: HeaderType.dynamicAction,
      actions: [
        {
          label: "Generate Bill",
          icon: (
            <Button variant="light" className="rounded-full gap-1">
              <GenerateBillIcon />
              Generate Bill
            </Button>
          ),
          onClick: (row) => handleGenerateBill(row),
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
    dispatch(
      getPharmacies({
        page: currentPage,
        query: debouncedSearch.trim(),
        startDate: dateRange?.[0],
        endDate: dateRange?.[1],
        searchBy: searchFilters,
      })
    );
  }, [currentPage, debouncedSearch, dateRange, searchFilters]);

  useEffect(() => {
    if (status === apiResponseType.success) {
      setCurrentPage(data?.response?.currentPage);
    }
  }, [status]);

  return (
    <div className="page w-full">
      <TabSwitcher tabs={tabs} selected={1} />
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <SearchBox
            search={search}
            setSearch={setSearch}
            placeholder="Search Pharmacy"
          />
          <FilterBox
            filterConfig={filterConfig}
            titleName="Filter Payment OPD"
            setSearchFilters={setSearchFilters}
          />
          <DateRangeFilter handleDateSelection={(date) => setDateRange(date)} />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="light"
            className="p-1.5 lg:p-3"
            onClick={() => goTo(ROUTES.CREATE_PHARMACY)}
          >
            New Invoice
          </Button>
        </div>
      </div>
      {isDataNotThere ? (
        <EmptyData from="pharmacy" />
      ) : (
        <TableGrid
          columns={headerData}
          data={pharmaciesQueue}
          isLoading={isLoading}
          allowPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageLimit={pageLimit}
          totalRecords={totalRecords}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default PharmacyOPD;

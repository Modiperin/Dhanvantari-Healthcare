import { useEffect, useState } from "react";
import TabSwitcher from "../../../components/TabSwitcher";
import { filterConfig, tabs } from "../helper";
import SearchBox from "../../../components/Searchbox";
import FilterBox from "../../patient-register/components/FilterBox";
import { useDispatch, useSelector } from "react-redux";
import { getPayments } from "../../../slices/paymentSlice";
import useDebounce from "../../../hooks/useDebounce";
import PatientUIUtils from "../../../components/PatientUIUtils";
import { apiResponseType, HeaderType } from "../../../utils/types";
import TableGrid from "../../../components/table/TableGrid";
import GenerateBillIcon from "../../../assets/svg/generate-bill.svg?react";
import Button from "../../../components/Buttons/Button";
import GeneratePatientSummaryModal from "../components/GeneratePatientSummaryModal";
import useNavigateTo from "../../../hooks/useNavigateTo";
import { ROUTES } from "../../../routes/helper";
import DateRangeFilter from "../../../components/DateRangeFilter";
import { EmptyData } from "../../../components/EmptyData";

const PaymentOPD = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilters, setSearchFilters] = useState("");
  const [showGeneratePatientSummary, setShowGeneratePatientSummary] =
    useState(false);
  const goTo = useNavigateTo();
  const dispatch = useDispatch();
  const { getPaymentApi } = useSelector((state) => state.payment);
  const { data, status, isLoading } = getPaymentApi;
  const [dateRange, setDateRange] = useState([]);
  const [isDataNotThere, setIsDataNotThere] = useState(false);

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

  const paymentQueue =
    data?.response?.list?.map((p) => ({
      id: p._id,
      visitId: p?.visitId,
      serialId: p?.serialId,
      patientName: PatientUIUtils(p.name, p.gender, p?.dateOfBirth),
      phoneNo: "+91".concat(p?.phoneNo),
      patientId: p?.patientId,
      pid: p.patientId,
      name: p?.name,
      paymentId: p?.paymentId,
      isAmountPaid: p?.isAmountPaid,
    })) || [];

  const handleGenerateBill = (row) => {
    if (row.paymentId) {
      goTo(
        `${ROUTES.UPDATE_PAYMENT}/${row.paymentId}?visitId=${row.visitId}&patientId=${row.patientId}`
      );
    } else {
      goTo(
        `${ROUTES.CREATE_PAYMENT}?visitId=${row.visitId}&patientId=${row.patientId}`
      );
    }
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
      ],
    },
  ];

  useEffect(() => {
    dispatch(
      getPayments({
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
    <>
      <div className="page w-full">
        <TabSwitcher tabs={tabs} selected={1} />

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <SearchBox
              search={search}
              setSearch={setSearch}
              placeholder="Search Payment"
            />
            <FilterBox
              filterConfig={filterConfig}
              titleName="Filter Payment OPD"
              setSearchFilters={setSearchFilters}
            />
            <DateRangeFilter
              handleDateSelection={(date) => setDateRange(date)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="light" onClick={() => goTo(ROUTES.CREATE_PAYMENT)}>
              New Invoice
            </Button>
          </div>
        </div>
        {isDataNotThere ? (
          <EmptyData from="payment" />
        ) : (
          <>
            <TableGrid
              columns={headerData}
              data={paymentQueue}
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
      {setShowGeneratePatientSummary && (
        <GeneratePatientSummaryModal
          open={showGeneratePatientSummary}
          onClose={() => setShowGeneratePatientSummary(false)}
        />
      )}
    </>
  );
};

export default PaymentOPD;

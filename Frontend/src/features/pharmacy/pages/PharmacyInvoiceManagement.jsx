import { useEffect, useMemo, useState } from "react";
import { filterConfig, tabs } from "../helper";
import TabSwitcher from "../../../components/TabSwitcher";
import useDebounce from "../../../hooks/useDebounce";
import useNavigateTo from "../../../hooks/useNavigateTo";
import { useDispatch, useSelector } from "react-redux";
import SearchBox from "../../../components/Searchbox";
import FilterBox from "../../patient-register/components/FilterBox";
import DateRangeFilter from "../../../components/DateRangeFilter";
import { ROUTES } from "../../../routes/helper";
import { apiResponseType, HeaderType } from "../../../utils/types";
import PatientUIUtils from "../../../components/PatientUIUtils";
import { formatDateToReadable } from "../../../utils/common";
import {
  getInvoiceCards,
  getInvoiceLists,
  resetApiState,
} from "../../../slices/pharmacySlice";
import TableGrid from "../../../components/table/TableGrid";
import GrapgIcon from "../../../assets/svg/graph.svg?react";
import InvoiceIcon from "../../../assets/svg/invoice.svg?react";
import PenddingPaymentIcon from "../../../assets/svg/pendding-payment.svg?react";
import SucessIcon from "../../../assets/svg/sucess.svg?react";
import PaymentCard from "../../patientDashboard/components/PaymentCard";
import RefreshButton from "../../../components/Buttons/RefreshButton";
import DownloadCsvButton from "../../../components/Buttons/DownloadCsvButton";
import InvoiceSummaryModal from "../../payment/components/InvoiceSummaryModal";

const getPharmaciesCard = ({
  totalPayment,
  dueAmount,
  paidAmount,
  totalPaymentCount,
}) => [
  {
    title: "Total Invoices",
    icon: <InvoiceIcon />,
    value: totalPaymentCount,
    extraClass: "bg-orange-50 text-[#D46300]",
  },
  {
    title: "Total Payments",
    icon: <GrapgIcon />,
    value: `₹${totalPayment.toFixed(2)}`,
    extraClass: "bg-light-blue/50 text-blue-400",
  },
  {
    title: "Pending Payments",
    icon: <PenddingPaymentIcon />,
    value: `₹${dueAmount.toFixed(2)}`,
    extraClass: "bg-red-50 text-red-600",
  },
  {
    title: "Paid Amount",
    icon: <SucessIcon />,
    value: `₹${paidAmount.toFixed(2)}`,
    extraClass: "bg-green-50 text-green-600",
  },
];

const getTableColumns = (goto, setShowInvoiceSummary, setPrintInvoiceData) => [
  { name: "Invoice No", value: "invoiceId" },
  { name: "Patient Name", value: "patientName", _class: "col-span-2" },
  { name: "Phone", value: "phoneNo", _class: "col-span-2" },
  { name: "Visit Id", value: "visitId" },
  { name: "Total Amount", value: "grandTotal" },
  { name: "Mode", value: "mode", type: HeaderType.paymode },
  {
    name: "Date",
    value: "date",
    _class: "col-span-1",
  },
  { name: "Paid", value: "isAmountPaid", type: HeaderType.colorBudge },
  {
    name: "Actions",
    value: "actions",
    _class: "col-span-2",
    type: HeaderType.actionWithSubMenu,
    options: [
      {
        label: "View Or Edit",
        onClick: (row) => {
          goto(`${ROUTES.UPDATE_PHARMACY}/${row?._id}`);
        },
      },
      {
        label: "Print",
        onClick: (row) => {
          setShowInvoiceSummary(true);
          setPrintInvoiceData(row);
          console.log("Print functionality", row);
        },
      },
      {
        label: "Whatsapp",
        onClick: (row) => console.log("Whatsapp functionality", row),
      },
    ],
  },
];

const PharmacyInvoiceManagement = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [searchFilters, setSearchFilters] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState([]);
  const [showInvoiceSummary, setShowInvoiceSummary] = useState(false);
  const [printInvoiceData, setPrintInvoiceData] = useState(null);
  const goto = useNavigateTo();
  const dispatch = useDispatch();
  const { pharmacyInvoiceListApi, pharmacyInvoiceCardApi } = useSelector(
    (state) => state.pharmacy
  );
  const { data, isLoading, status } = pharmacyInvoiceListApi;
  const pageLimit = data?.response?.pageLimit;
  const totalRecords = data?.response?.totalRecords;
  const totalPages = data?.response?.totalPages;
  const [params, setParams] = useState({});

  const {
    totalPayment = 0,
    paidAmount = 0,
    dueAmount = 0,
    totalPaymentCount = 0,
  } = pharmacyInvoiceCardApi.data?.response || {};
  const paymentCards = useMemo(
    () =>
      getPharmaciesCard({
        totalPayment,
        dueAmount,
        paidAmount,
        totalPaymentCount,
      }),
    [totalPayment, dueAmount, paidAmount, totalPaymentCount]
  );

  const headerData = getTableColumns(
    goto,
    setShowInvoiceSummary,
    setPrintInvoiceData
  );

  const invoiceData =
    data?.response?.list?.map((i) => {
      return {
        ...i,
        id: i?._id,
        patientName: PatientUIUtils(i.name, i.gender, i?.dateOfBirth),
        date: formatDateToReadable(i.createdAt, false, true),
        phoneNo: "+91 ".concat(i.phoneNo),
        visitId: i?.visitId || "-",
        mode: i?.paymodes?.map((p) => p.type).join(", ") || "-",
        invoiceId: i?.invoiceId || "-",
        isAmountPaid: i?.isAmountPaid,
        payModes: i?.paymodes || [],
      };
    }) || [];

  const handleRefreshQueue = () => {
    dispatch(getInvoiceLists());
    dispatch(getInvoiceCards());
  };

  useEffect(() => {
    let newParams = {
      page: currentPage,
      query: debouncedSearch.trim(),
      searchBy: searchFilters,
      startDate: dateRange?.[0],
      endDate: dateRange?.[1],
    };
    setParams(newParams);
    handleRefreshQueue(newParams);
    return () => {
      resetApiState("pharmacyInvoiceListApi");
      resetApiState("pharmacyInvoiceCardApi");
    };
  }, [currentPage, debouncedSearch, searchFilters, dateRange]);

  useEffect(() => {
    if (status === apiResponseType.success) {
      setCurrentPage(data?.response?.currentPage);
    }
  }, [status]);

  return (
    <div className="page">
      <TabSwitcher tabs={tabs} selected={2} />
      <div className="flex gap-5 items-center justify-between w-full">
        <div className="flex items-center gap-2 w-1/2">
          <SearchBox
            search={search}
            setSearch={setSearch}
            placeholder="Search By Name or Number"
            extraClass="w-full"
            isCompressed
          />
          <FilterBox
            filterConfig={filterConfig}
            titleName="Filters for Pharmacy Invoices"
            setSearchFilters={setSearchFilters}
          />
          <DateRangeFilter handleDateSelection={(date) => setDateRange(date)} />
        </div>
        <div className="flex gap-2 items-center">
          <RefreshButton
            onClick={() => handleRefreshQueue(params)}
            loading={isLoading || pharmacyInvoiceCardApi?.isLoading}
            disabled={isLoading || pharmacyInvoiceCardApi?.isLoading}
            content="Refresh Pharmacy Invoice List"
          />
          <DownloadCsvButton
            name="Download Pharmacy Invoices"
            fileName="pharmacy_invoices.csv"
            data={data?.response?.list || []}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {paymentCards.map((pay, idx) => (
          <PaymentCard
            key={idx}
            {...pay}
            isLoading={pharmacyInvoiceCardApi.isLoading}
          />
        ))}
      </div>
      <TableGrid
        columns={headerData}
        data={invoiceData}
        isLoading={isLoading}
        allowPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageLimit={pageLimit}
        totalRecords={totalRecords}
        onPageChange={(page) => setCurrentPage(page)}
      />
      {showInvoiceSummary && printInvoiceData && (
        <InvoiceSummaryModal
          open={showInvoiceSummary}
          onClose={() => setShowInvoiceSummary(false)}
          invoiceData={printInvoiceData}
          patientData={printInvoiceData}
          forWhat="pharmacy"
        />
      )}
    </div>
  );
};

export default PharmacyInvoiceManagement;

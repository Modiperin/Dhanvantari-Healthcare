import TabSwitcher from "../../../components/TabSwitcher";
import { filterConfig, tabs } from "../helper";
import GrapgIcon from "../../../assets/svg/graph.svg?react";
import InvoiceIcon from "../../../assets/svg/invoice.svg?react";
import PenddingPaymentIcon from "../../../assets/svg/pendding-payment.svg?react";
import SucessIcon from "../../../assets/svg/sucess.svg?react";
import PaymentCard from "../../patientDashboard/components/PaymentCard";
import { useEffect, useMemo, useState } from "react";
import SearchBox from "../../../components/Searchbox";
import FilterBox from "../../patient-register/components/FilterBox";
import PatientUIUtils from "../../../components/PatientUIUtils";
import TableGrid from "../../../components/table/TableGrid";
import { apiResponseType, HeaderType } from "../../../utils/types";
import { formatDateToReadable } from "../../../utils/common";
import { useDispatch, useSelector } from "react-redux";
import {
  getInvoiceCards,
  getInvoiceLists,
  resetApiState,
  viewPayment,
} from "../../../slices/paymentSlice";
import useDebounce from "../../../hooks/useDebounce";
import DateRangeFilter from "../../../components/DateRangeFilter";
import BillPatientModal from "../../OPD/components/BillPatientModal";
import RefreshButton from "../../../components/Buttons/RefreshButton";
import DownloadCsvButton from "../../../components/Buttons/DownloadCsvButton";
import InvoiceSummaryModal from "../components/InvoiceSummaryModal";

const getPaymentCards = ({
  totalPayment,
  unpaidVisitCount,
  dueAmount,
  paidAmount,
}) => [
  {
    title: "Total Payments",
    icon: <GrapgIcon />,
    value: `₹${totalPayment.toFixed(2)}`,
    extraClass: "bg-light-blue/50 text-blue-400",
  },
  {
    title: "Unpaid Visits",
    icon: <InvoiceIcon />,
    value: unpaidVisitCount,
    extraClass: "bg-orange-50 text-[#D46300]",
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

const getTableColumns = (
  setViewBillPatientModal,
  dispatch,
  setShowInvoicePaymentSummary,
  setPrintInvoiceData
) => [
  { name: "Invoice No", value: "invoiceId" },
  { name: "Patient Name", value: "patientName", _class: "col-span-2" },
  { name: "Phone", value: "phoneNo", _class: "col-span-2" },
  { name: "Visit Id", value: "visitId" },
  { name: "Total Amount", value: "grandTotal" },
  { name: "Mode", value: "mode", type: HeaderType.paymode },
  { name: "Date", value: "date", _class: "col-span-1" },
  { name: "Paid", value: "isAmountPaid", type: HeaderType.colorBudge },
  {
    name: "Actions",
    value: "actions",
    _class: "col-span-2",
    type: HeaderType.actionWithSubMenu,
    options: [
      {
        label: "View Or Update",
        onClick: (row) => {
          // console.log("View action triggered for", row);
          setViewBillPatientModal(row);
          dispatch(
            viewPayment({
              paymentId: row?._id,
            })
          );
        },
      },
      {
        label: "Print",
        onClick: (row) => {
          setShowInvoicePaymentSummary(true);
          setPrintInvoiceData(row);
          console.log("Print functionality", row);
        },
      },
      // {
      //   label: "Whatsapp",
      //   onClick: (row) => console.log("Whatsapp functionality", row),
      // },
    ],
  },
];

const InvoiceManagement = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [searchFilters, setSearchFilters] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showInvoicePaymentSummary, setShowInvoicePaymentSummary] =
    useState(false);
  const [printInvoiceData, setPrintInvoiceData] = useState(null);
  const dispatch = useDispatch();
  const { paymentInvoiceListApi, paymentInvoiceCardApi } = useSelector(
    (state) => state.payment
  );

  const { data, isLoading, status } = paymentInvoiceListApi;
  const pageLimit = data?.response?.pageLimit;
  const totalRecords = data?.response?.totalRecords;
  const totalPages = data?.response?.totalPages;
  const [dateRange, setDateRange] = useState([]);
  const [viewBillPatientModal, setViewBillPatientModal] = useState(null);
  const [params, setParams] = useState({});
  const {
    totalPayment = 0,
    paidAmount = 0,
    dueAmount = 0,
    unpaidVisitCount = 0,
  } = paymentInvoiceCardApi.data?.response || {};
  const paymentCards = useMemo(
    () =>
      getPaymentCards({
        totalPayment,
        unpaidVisitCount,
        dueAmount,
        paidAmount,
      }),
    [totalPayment, unpaidVisitCount, dueAmount, paidAmount]
  );

  const headerData = getTableColumns(
    setViewBillPatientModal,
    dispatch,
    setShowInvoicePaymentSummary,
    setPrintInvoiceData
  );
  // console.log({ data });

  const invoiceData =
    data?.response?.list?.map((i) => {
      return {
        ...i,
        patientName: PatientUIUtils(i.name, i.gender, i?.dateOfBirth),
        date: formatDateToReadable(i.createdAt, false, true),
        phoneNo: "+91 ".concat(i.phoneNo),
        visitId: i?.visitId || "-",
        mode: i?.paymodes?.map((p) => p.type).join(", "),
        invoiceId: i?.invoiceId || "-",
        payModes: i?.paymodes || [],
        isAmountPaid: i?.isAmountPaid,
      };
    }) || [];

  const handleRefreshQueue = (params) => {
    dispatch(getInvoiceLists(params));
    dispatch(getInvoiceCards(params));
  };

  useEffect(() => {
    const newParams = {
      page: currentPage,
      query: debouncedSearch.trim(),
      searchBy: searchFilters,
      startDate: dateRange?.[0],
      endDate: dateRange?.[1],
    };
    setParams(newParams);
    handleRefreshQueue(newParams);
    return () => {
      resetApiState("paymentInvoiceListApi");
      resetApiState("paymentInvoiceCardApi");
    };
  }, [currentPage, debouncedSearch, searchFilters, dateRange]);
  // console.log(params);

  useEffect(() => {
    if (status === apiResponseType.success) {
      setCurrentPage(data?.response?.currentPage);
    }
  }, [status]);

  return (
    <>
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
              titleName="Filter"
              setSearchFilters={setSearchFilters}
            />
            <DateRangeFilter
              handleDateSelection={(date) => setDateRange(date)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <RefreshButton
              onClick={() => handleRefreshQueue(params)}
              loading={isLoading || paymentInvoiceCardApi?.isLoading}
              disabled={isLoading || paymentInvoiceCardApi?.isLoading}
              content="Refresh Payment Invoice List"
            />
            <DownloadCsvButton
              data={data?.response?.list || []}
              name="Download Payment Invoices"
              fileName="payment_invoices.csv"
              keysToRemove={["id", "createdAt"]}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {paymentCards.map((pay, idx) => (
            <PaymentCard
              key={idx}
              {...pay}
              isLoading={paymentInvoiceCardApi.isLoading}
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
      </div>
      {viewBillPatientModal && (
        <BillPatientModal
          open={viewBillPatientModal}
          onClose={() => setViewBillPatientModal(null)}
          patientData={{
            serialId: viewBillPatientModal?.serialId,
            name: viewBillPatientModal?.name,
            phoneNo: viewBillPatientModal?.phoneNo,
            _id: viewBillPatientModal?.patientId,
          }}
        />
      )}
      {showInvoicePaymentSummary && printInvoiceData && (
        <InvoiceSummaryModal
          open={showInvoicePaymentSummary}
          onClose={() => setShowInvoicePaymentSummary(false)}
          invoiceData={printInvoiceData}
          patientData={printInvoiceData}
        />
      )}
    </>
  );
};

export default InvoiceManagement;

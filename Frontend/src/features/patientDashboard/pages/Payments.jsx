import { useParams } from "react-router-dom";
import TabSwitcher from "../../../components/TabSwitcher";
import { useDispatch, useSelector } from "react-redux";
import {
  getPatientPayments,
  getPatientPaymentsCard,
} from "../../../slices/paymentSlice";
import { useEffect, useMemo, useState } from "react";
import PatientInfo from "../components/PatientInfo";
import SearchBox from "../../../components/Searchbox";
import Button from "../../../components/Buttons/Button";
import DownloadIcon from "../../../assets/svg/download.svg?react";
import { formatDate } from "../../../utils/dateAndTime";
import { HeaderType } from "../../../utils/types";
import { ROUTES } from "../../../routes/helper";
import useNavigateTo from "../../../hooks/useNavigateTo";
import TableGrid from "../../../components/table/TableGrid";
import GrapgIcon from "../../../assets/svg/graph.svg?react";
import InvoiceIcon from "../../../assets/svg/invoice.svg?react";
import PenddingPaymentIcon from "../../../assets/svg/pendding-payment.svg?react";
import SucessIcon from "../../../assets/svg/sucess.svg?react";
import PaymentCard from "../components/PaymentCard";
import DateRangeFilter from "../../../components/DateRangeFilter";
import useDebounce from "../../../hooks/useDebounce";
import { tabs } from "../helper";
import InvoiceSummaryModal from "../../payment/components/InvoiceSummaryModal";
import RefreshButton from "../../../components/Buttons/RefreshButton";
import { filterConfig } from "../../payment/helper";
import FilterBox from "../../patient-register/components/FilterBox";

const getTableColumns = (
  goto,
  setShowInvoicePaymentSummary,
  setPrintInvoiceData,
  patientId
) => [
  { name: "Invoice ID", value: "invoiceId", _class: "col-span-2" },
  { name: "Visit ID", value: "visitId", _class: "col-span-1" },
  { name: "Total Amount", value: "totalAmount", _class: "col-span-2" },
  {
    name: "Mode",
    value: "mode",
    _class: "col-span-2",
    type: HeaderType.paymode,
  },
  { name: "Date", value: "createdAt", _class: "col-span-2" },
  { name: "Paid", value: "isAmountPaid", type: HeaderType.colorBudge },
  {
    name: "Actions",
    value: "actions",
    _class: "col-span-2",
    type: HeaderType.actionWithSubMenu,
    options: [
      {
        label: "View",
        onClick: (row) =>
          goto(
            `${ROUTES.PATIENTS_PAYMENTS_UPDATE}/${row?.id}?visitId=${row.visitId}`,
            { patientId }
          ),
      },
      {
        label: "Edit",
        onClick: (row) =>
          goto(
            `${ROUTES.PATIENTS_PAYMENTS_UPDATE}/${row?.id}?visitId=${row.visitId}`
          ),
      },
      {
        label: "Print",
        onClick: (row) => {
          setShowInvoicePaymentSummary(true);
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

const Payments = () => {
  const { patientId } = useParams();
  const goto = useNavigateTo();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState([]);
  const [search, setSearch] = useState("");
  const [searchFilters, setSearchFilters] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [showInvoicePaymentSummary, setShowInvoicePaymentSummary] =
    useState(false);
  const [printInvoiceData, setPrintInvoiceData] = useState(null);
  const [params, setParams] = useState({});
  // console.log({ printInvoiceData });

  // Fetch payments on mount or patientId change
  const handleRefreshQueue = (params) => {
    console.log(params);
    dispatch(getPatientPayments(params));
    dispatch(getPatientPaymentsCard({ patientId }));
  };
  useEffect(() => {
    if (patientId) {
      const newParams = {
        patientId,
        query: debouncedSearch.trim(),
        startDate: dateRange?.[0],
        endDate: dateRange?.[1],
        page: currentPage,
      };
      setParams(newParams);
      handleRefreshQueue(newParams);
    }
  }, [dispatch, patientId, currentPage, debouncedSearch, dateRange]);

  const { data, isLoading } = useSelector(
    (state) => state.payment.patientPaymentsApi
  );

  // console.log({ data });
  const { data: cardData, isLoading: isLoadingCard } = useSelector(
    (state) => state.payment.patientPaymentsCardApi
  );

  const {
    list = [],
    patientData,
    totalPages = 1,
    totalRecords = 0,
    pageLimit = 1,
  } = data?.response || {};

  const {
    totalPayment = 0,
    paidAmount = 0,
    dueAmount = 0,
    unpaidVisitCount = 0,
    // pendingAmount = 0,
  } = cardData?.response || {};

  const tableRows = useMemo(() => {
    return list.map((visit) => ({
      id: visit._id,
      invoiceId: visit.invoiceId || "-",
      visitId: visit.visitId || "-",
      totalAmount: visit.grandTotal || "-",
      mode: visit?.paymodes?.map((mode) => mode.type).join(", "),
      createdAt: formatDate(visit.createdAt, "MMMM do yyyy h:mm a"),
      isAmountPaid: visit.isAmountPaid,
      payments: visit?.payments || [],
      grandTotal: visit.grandTotal || 0,
      payModes: visit?.paymodes || [],
      dueAmount: visit.dueAmount || 0,
    }));
  }, [list]);

  const paymentCards = useMemo(
    () =>
      getPaymentCards({
        totalPayment: totalPayment,
        unpaidVisitCount,
        dueAmount: dueAmount,
        paidAmount: paidAmount,
      }),
    [totalPayment, unpaidVisitCount, dueAmount, paidAmount]
  );

  return (
    <div className="page">
      <TabSwitcher tabs={tabs} selected={4} id={patientId} />
      {/* CARDS */}
      <div className="grid mt-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {paymentCards.map((pay, idx) => (
          <PaymentCard key={idx} {...pay} isLoading={isLoadingCard} />
        ))}
      </div>

      <div className="py-4">
        <PatientInfo patientData={patientData} />

        <div className="flex items-center justify-between mt-6 gap-2">
          <div className="flex gap-2 w-full">
            <SearchBox
              search={search}
              setSearch={setSearch}
              placeholder="Search By Ids"
              isCompressed
            />
            <FilterBox
              filterConfig={filterConfig}
              titleName="Patient's Payment Filters"
              setSearchFilters={setSearchFilters}
            />
            <DateRangeFilter
              handleDateSelection={(date) => setDateRange(date)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <RefreshButton
              onClick={() => handleRefreshQueue(params)}
              loading={isLoading || cardData?.isLoading}
              disabled={isLoading || cardData?.isLoading}
              content="Refresh Payment Invoice List"
              cooldown={1500}
            />
            <Button className="gap-1">
              <DownloadIcon />
              <span className="hidden lg:flex">Download</span>
            </Button>
          </div>
        </div>

        <div className="mt-3">
          <TableGrid
            data={tableRows}
            columns={getTableColumns(
              goto,
              setShowInvoicePaymentSummary,
              setPrintInvoiceData,
              patientId
            )}
            isLoading={isLoading}
            allowPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageLimit={pageLimit}
            totalRecords={totalRecords}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
      {setShowInvoicePaymentSummary && patientData && (
        <InvoiceSummaryModal
          open={showInvoicePaymentSummary}
          onClose={() => setShowInvoicePaymentSummary(false)}
          invoiceData={printInvoiceData}
          patientData={patientData}
        />
      )}
    </div>
  );
};

export default Payments;

import Modal from "../../../components/Modal";
import Button from "../../../components/Buttons/Button";
import PrinterIcon from "../../../components/svgs/Printer";
import SendIcon from "../../../assets/svg/send.svg?react";
import { useSelector } from "react-redux";
import { dobToAge } from "../../../utils/common";
import VerticalLine from "../../../components/lines/VerticalLine";
import TableGrid from "../../../components/table/TableGrid";
import logo from "../../../assets/images/logo/logo.png";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import SpinnerLoader from "../../../components/loader/SpinnerLoader";
import { DEFAULT_HOSPITAL_LOGO } from "../../../utils/config";

const headerData = [
  {
    name: "Service",
    value: "name",
    _class: "col-span-3",
  },
  {
    name: "Unit",
    value: "unit",
    _class: "col-span-1",
  },
  {
    name: "Amount (₹)",
    value: "amount",
    _class: "col-span-2",
  },
  {
    name: "Discount (₹)",
    value: "discount",
    _class: "col-span-2",
  },
  {
    name: "Tax (%)",
    value: "tax",
    _class: "col-span-2",
  },
  {
    name: "Total (₹)",
    value: "total",
    _class: "col-span-2",
  },
];

const InvoiceSummaryModal = ({
  open = true,
  onClose,
  invoiceData,
  patientData,
  forWhat = "payment",
}) => {
  // const patientData = getPatientPrescriptionsApi?.data?.response?.patientData;
  const user = useSelector((state) => state.user?.userInfo?.response);
  const hospitalData = user?.hospitalData;
  const printRef = useRef();
  const [printLoading, setPrintLoading] = useState(false);

  // Patient Info
  const patientName = patientData?.name || "N/A";
  const gender = patientData?.gender || "N/A";
  const age = patientData?.dateOfBirth
    ? dobToAge(patientData?.dateOfBirth)
    : "N/A";
  // const age = 21;
  //hospital Info
  const hospitalName = hospitalData?.name || "N/A";

  const printCase = useReactToPrint({
    contentRef: printRef,
    documentTitle:
      forWhat === "pharmacy"
        ? `Invoice_Pharmacy_${patientData?.name || "Patient"}`
        : `Invoice_Payment_${patientData?.name || "Patient"}`,
    removeAfterPrint: true, // removes the iframe after print
    pageStyle: `
        @page {
          size: A4;
          margin: 5mm;
        }
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          padding:12px !important;
        } 
        body::before {
         content: "";
         position: fixed;
         top: 50%;
         left: 50%;
         width: 300px;         
         height: 300px;        
         background: url(${"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGm2ra9r3Uig9r50KPmU5HLMZCQ3YPWLNC2A&s"}) no-repeat center center;
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

  const handlePrint = () => {
    setPrintLoading(true);
    setTimeout(() => {
      printCase();
    }, 0);
  };

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onClose}
        title={
          <span className="text-blue text-xl">
            Patient {forWhat === "pharmacy" ? "Pharmacy" : "Payment"} Invoice
            Summary
          </span>
        }
        showClose
        contentClassName="min-w-[90%] lg:min-w-[840px] max-h-[85vh] overflow-y-auto overflow-x-clip"
        className="overflow-y-scroll scrollbar-hide text-blue min-h-[200px]"
        stickyHeader
      >
        <div className="flex flex-col justify-between h-full pb-5">
          <div ref={printRef}>
            <div className="relative flex flex-col gap-4 overflow-y-scroll scrollbar-hide">
              <div className="flex items-center border-b border-light-blue py-2 gap-4">
                <div className="">
                  <img
                    src={hospitalData?.logo || DEFAULT_HOSPITAL_LOGO}
                    alt="Company Logo"
                    height="90px"
                    width="90px"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl">{hospitalName}</span>
                  <span className="text-sm">{hospitalData?.address}</span>
                  <span className="text-sm">
                    Ph: {hospitalData?.phoneNo || "N/A"}
                  </span>
                  <span className="text-sm">
                    Email: {hospitalData?.email || "N/A"}
                  </span>
                </div>
              </div>

              {/* Patient Info */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-1 items-center justify-center">
                  <span className="text-2xl">{patientName}</span>
                  <VerticalLine />

                  <span className="text-sm capitalize">{gender}</span>
                  <VerticalLine />
                  <span className="text-sm">
                    {age ? `${age} year(s)` : "N/A"}
                  </span>
                </div>
              </div>
              <div>
                <TableGrid
                  data={
                    forWhat === "pharmacy"
                      ? invoiceData?.pharmacies
                      : invoiceData?.payments
                  }
                  columns={headerData}
                  isCompressView
                  className="rounded-t-lg rounded-b-none border-b-0"
                />
                <span className="bg-extra-light-blue w-full p-2 flex justify-between font-semibold text-sm rounded-b-lg border border-light-blue pr-14">
                  <span>Grand Total </span>
                  <span>{invoiceData?.grandTotal}/-</span>
                </span>
              </div>
              {invoiceData?.payModes?.length > 0 && (
                <div className="px-2 font-medium flex flex-col gap-2">
                  {invoiceData?.payModes?.map((mode, index) => (
                    <span key={index}>
                      ₹ {mode.amount} Paid Via {mode.type}
                    </span>
                  ))}
                </div>
              )}
              {/* <div className="px-2 font-medium flex gap-2 items-center justify-between">
            ₹ 1500 Paid Via Cash. <Badge type="billed" />
          </div> */}
            </div>
            <div className="hidden print:flex print-footer justify-center items-center gap-1">
              <div className="text-xs mt-1">Powered by</div>
              <img src={logo} alt="Company Logo" height="100px" width="100px" />
            </div>
          </div>
          <div className="flex items-center justify-end gap-4 w-full mt-2">
            <Button variant="light" className="gap-1" onClick={handlePrint}>
              <PrinterIcon />
              Print
            </Button>
            {/* <Button className="gap-1">
            <SendIcon />
            Send
          </Button> */}
          </div>
        </div>
      </Modal>

      {printLoading ? <SpinnerLoader message="Preparing print..." /> : null}
    </>
  );
};

export default InvoiceSummaryModal;

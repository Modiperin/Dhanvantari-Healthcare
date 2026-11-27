import React, { useEffect, useRef, useState } from "react";
import Button from "../../../components/Buttons/Button";
import PrintIcon from "../../../assets/svg/printer.svg?react";
import WAIcon from "../../../assets/svg/whatsapp.svg?react";
import BillIcon from "../../../assets/svg/bill.svg?react";
import PrescriptionDetailsSkeleton from "../../patientDashboard/loader/PrescriptionDetailsSkeleton";
import PrescriptionDetails from "../../patientDashboard/components/PrescriptionDetails";
import { viewPrescriptions } from "../../../slices/patientSlice";
import { useDispatch, useSelector } from "react-redux";
import RightArrow from "../../../assets/svg/arrow-right.svg?react";
import EditPrescriptionIcon from "../../../assets/svg/prescription-edit.svg?react";
import {
  resetApiState,
  sendPrescriptionWhatsapp,
  updateVisitDetails,
} from "../../../slices/nurseOPD";
import useApiResponseHandler from "../../../hooks/useApiResponseHandler";
import Spinner from "../../../components/Spinner";
import BillPatientModal from "./BillPatientModal";
import { getDuesDetails, viewPayment } from "../../../slices/paymentSlice";
import {
  multipleErrorToastMessage,
  toastMessage,
} from "../../../utils/toastMessage";
import { useReactToPrint } from "react-to-print";
import SpinnerLoader from "../../../components/loader/SpinnerLoader";

const commonStyle =
  "flex bg-[#158BE2] text-white rounded-lg text-xs rounded-full !px-2.5 !py-0 !gap-0.5 duration-300";

const GeneratePrescription = ({ selectedVisit, setSearchParams }) => {
  const dispatch = useDispatch();
  const { viewPrescriptionsApi } = useSelector(
    (state) => state.patientManagement
  );
  const user = useSelector((state) => state.user?.userInfo?.response);
  const { updateVisitApi, sendPrescriptionWhatsappApi } = useSelector(
    (state) => state.nurseOPD
  );

  const printRef = useRef();
  const [printLoading, setPrintLoading] = useState(false);

  const isSendWhatsAppLoading = sendPrescriptionWhatsappApi?.isLoading;
  const patientData = viewPrescriptionsApi?.data?.response?.patientData;
  const isPrescriptionsLoading = viewPrescriptionsApi?.isLoading;
  const prescriptionData = viewPrescriptionsApi?.data?.response || {};
  const [openBillPatientModal, setOpenBillPatientModal] = useState(false);

  const printCase = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Prescription_${
      patientData?.name || "Patient"
    }_${selectedVisit}`,
    removeAfterPrint: true, // removes the iframe after print
    pageStyle: `
      @page {
        size: A4;
        margin: 5mm;
      }
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
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

  const handleEndVisit = (visitId) => {
    dispatch(
      updateVisitDetails({ id: visitId, data: { contStatus: "Completed" } })
    );
  };

  useEffect(() => {
    if (selectedVisit) {
      dispatch(viewPrescriptions({ visitId: selectedVisit }));
    }
  }, [selectedVisit]);

  useApiResponseHandler({
    status: updateVisitApi.status,
    data: updateVisitApi.data,
    error: updateVisitApi.error,
    resetReduxStatus: () => dispatch(resetApiState("updateVisitApi")),
  });

  useEffect(() => {
    return () => {
      dispatch(resetApiState("updateVisitApi"));
    };
  }, []);

  useEffect(() => {
    if (
      sendPrescriptionWhatsappApi &&
      sendPrescriptionWhatsappApi.status === "success"
    ) {
      toastMessage(sendPrescriptionWhatsappApi);
    } else if (
      sendPrescriptionWhatsappApi &&
      sendPrescriptionWhatsappApi.status === "failed"
    ) {
      multipleErrorToastMessage(sendPrescriptionWhatsappApi);
    }
  }, [sendPrescriptionWhatsappApi, dispatch]);

  const handleSendWhatsApp = () => {
    dispatch(
      sendPrescriptionWhatsapp({
        id: prescriptionData?.consultationData?._id || "",
        patientId: patientData._id,
      })
    );
  };

  return (
    <>
      <div className="w-full p gap-4 h-full grid grid-cols-5">
        <div className="col-span-full lg:col-span-2 border rounded-lg border-light-blue h-full flex flex-col gap-3 p-4">
          {/* <div className="text-[#00AC00] bg-[#00AC00]/10 rounded-md p-1 px-2 text-sm flex gap-1 items-center w-fit">
            <span>
              <TickCircle color="#00AC00" />
            </span>{" "}
            <span>Success</span>
          </div> */}
          <div className="text-blue text-xl">
            Sending prescription link to the patient:
          </div>
          <div className="flex items-center gap-2 text-light-blue-text">
            <span>WhatsApp & SMS sent to: </span>
            <span className="rounded-md bg-light-blue p-1 text-sm flex gap-2 items-center">
              +91 {patientData?.phoneNo || "N/A"}
            </span>
          </div>
          <div className="flex gap-2 items-center w-full justify-end">
            {/* <Button className={commonStyle}>
              <AttachmentIcon />
              <span>Send Attachment</span>
            </Button> */}
            <Button
              className={commonStyle}
              disabled={
                prescriptionData.isSentToWhatsApp || isSendWhatsAppLoading
              }
              onClick={handleSendWhatsApp}
            >
              {isSendWhatsAppLoading ? (
                <Spinner border="white" />
              ) : (
                <>
                  <WAIcon />
                  <span>Send via own WhatsApp</span>
                </>
              )}
            </Button>
            <Button
              className={commonStyle}
              onClick={() => {
                dispatch(getDuesDetails(patientData?._id));
                setOpenBillPatientModal(true);
                dispatch(
                  viewPayment({
                    visitId: selectedVisit,
                    patientId: patientData?._id,
                  })
                );
              }}
            >
              <BillIcon />
              <span>Bill Patient</span>
            </Button>
          </div>
        </div>
        <div className="col-span-full lg:col-span-3 border rounded-lg border-light-blue h-full">
          {isPrescriptionsLoading || !patientData ? (
            <PrescriptionDetailsSkeleton />
          ) : (
            <PrescriptionDetails
              visitData={prescriptionData}
              patientData={patientData}
              hospitalData={user?.hospitalData}
              ref={printRef}
            />
          )}
        </div>
        <div className="w-full flex items-center justify-end col-span-full gap-4">
          <Button onClick={handlePrint} className="gap-1 duration-300">
            <PrintIcon />
            <span>Print</span>
          </Button>
          <Button
            variant="light"
            onClick={() => {
              setSearchParams({});
            }}
          >
            <EditPrescriptionIcon /> <span>Edit Prescription</span>
          </Button>
          <Button
            className="gap-1 duration-300"
            onClick={() => handleEndVisit(selectedVisit)}
            disabled={updateVisitApi.isLoading}
          >
            <span>End Consultation</span>{" "}
            {updateVisitApi.isLoading ? <Spinner /> : <RightArrow />}
          </Button>
        </div>
      </div>
      {setOpenBillPatientModal && (
        <BillPatientModal
          open={openBillPatientModal}
          onClose={() => setOpenBillPatientModal(false)}
          patientData={{
            serialId: patientData?.serialId,
            name: patientData?.name,
            phoneNo: patientData?.phoneNo,
            _id: patientData?._id,
          }}
          visitId={selectedVisit}
        />
      )}
      {printLoading ? <SpinnerLoader message="Preparing print..." /> : null}
    </>
  );
};

export default GeneratePrescription;

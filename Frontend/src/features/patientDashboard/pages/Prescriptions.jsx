import { useEffect, useMemo, useRef, useState } from "react";
import TabSwitcher from "../../../components/TabSwitcher";
import { tabs } from "../helper";
import Button from "../../../components/Buttons/Button";
import PrintIcon from "../../../assets/svg/printer.svg?react";
import EditPrescIcon from "../../../assets/svg/receipt-edit.svg?react";
import SendSMSorTextIcon from "../../../assets/svg/directbox-send.svg?react";
import SaveIcon from "../../../assets/svg/save-2.svg?react";
import SavePluseIcon from "../../../assets/svg/save-add.svg?react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPatientPrescriptions,
  viewPrescriptions,
} from "../../../slices/patientSlice";
import { useParams } from "react-router-dom";
import PrescriptionListSidebar from "../components/PrescriptionListSidebar";
import PrescriptionDetails from "../components/PrescriptionDetails";
import PrescriptionDetailsSkeleton from "../loader/PrescriptionDetailsSkeleton";
import PrescriptionListSkeleton from "../loader/prescriptionSideBarSkeleton";
import PrescriptionButtonGroupSkeleton from "../loader/PrescriptionButtonGroupSkeleton";
import { EmptyData } from "../../../components/EmptyData";
import { ROUTES } from "../../../routes/helper";
import { useReactToPrint } from "react-to-print";
import { DEFAULT_HOSPITAL_LOGO } from "../../../utils/config";

const Prescriptions = () => {
  const { patientId } = useParams();
  const printRef = useRef();
  const [selectedVisit, setSelectedVisit] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPatientPrescriptions({ patientId }));
  }, [patientId]);

  const { getPatientPrescriptionsApi, viewPrescriptionsApi } = useSelector(
    (state) => state.patientManagement
  );
  const user = useSelector((state) => state.user?.userInfo?.response);

  const prescriptionsList = useMemo(
    () => getPatientPrescriptionsApi?.data?.response?.list || [],
    [getPatientPrescriptionsApi]
  );

  const prescriptionsListLoading = getPatientPrescriptionsApi?.isLoading;
  const patientData = getPatientPrescriptionsApi?.data?.response?.patientData;
  const isPrescriptionsLoading = viewPrescriptionsApi?.isLoading;

  useEffect(() => {
    if (
      prescriptionsList.length &&
      selectedVisit !== prescriptionsList[0].visitId
    ) {
      setSelectedVisit(prescriptionsList[0].visitId);
    }
  }, [prescriptionsList]);

  useEffect(() => {
    if (selectedVisit) {
      dispatch(viewPrescriptions({ visitId: selectedVisit }));
    }
  }, [selectedVisit, dispatch]);

  const prescriptionData = viewPrescriptionsApi?.data?.response || {};

  const handlePrint = useReactToPrint({
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
     background: url(${
       user?.hospitalData?.logo || DEFAULT_HOSPITAL_LOGO
     }) no-repeat center center;
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
  });

  return (
    <div className="page">
      <TabSwitcher tabs={tabs} selected={2} id={patientId} />
      {!prescriptionsListLoading && !prescriptionsList.length ? (
        <EmptyData
          from="prescriptions"
          redirectTo={`${ROUTES.PATIENT_BASIC_DETAIL}/${patientId}`}
        />
      ) : (
        <div>
          <div className="flex h-[calc(100vh-100px)] gap-4">
            {prescriptionsListLoading ? (
              <PrescriptionListSkeleton />
            ) : (
              <PrescriptionListSidebar
                prescriptionsList={prescriptionsList}
                selectedVisit={selectedVisit}
                setSelectedVisit={setSelectedVisit}
              />
            )}

            {prescriptionsListLoading ||
            isPrescriptionsLoading ||
            !patientData ? (
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
          {/* Button Group */}
          {isPrescriptionsLoading ? (
            <PrescriptionButtonGroupSkeleton />
          ) : (
            <div className="flex justify-end mt-4 gap-2">
              <Button variant="light">
                <SavePluseIcon />
                <span className="ml-2">Use as Template</span>
              </Button>
              <Button variant="light">
                <SaveIcon />
                <span className="ml-2"> Save as Template</span>
              </Button>
              <Button variant="light">
                <SendSMSorTextIcon />
                <span className="ml-2"> Send SMS/WhatsApp</span>
              </Button>
              <Button variant="light">
                <EditPrescIcon />
                <span className="ml-2"> Edit Prescription</span>
              </Button>
              <Button onClick={handlePrint}>
                <PrintIcon />
                <span className="ml-2">Print</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Prescriptions;

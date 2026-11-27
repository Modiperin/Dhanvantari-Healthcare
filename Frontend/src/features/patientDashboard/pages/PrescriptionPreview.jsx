import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { callAPI } from "../../../services/callAPI";
import { API_BASE_URL, DEFAULT_HOSPITAL_LOGO } from "../../../utils/config";
import PrescriptionDetails from "../components/PrescriptionDetails";
import Spinner from "../../../components/Spinner";
import InfoIcon from "../../../assets/svg/info.svg?react";
import Button from "../../../components/Buttons/Button";
import { useReactToPrint } from "react-to-print";

const PrescriptionPreview = () => {
  document.title = "Prescription Preview";
  const { token } = useParams();
  const [visitData, setVisitData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalidLink, setIsInvalidLink] = useState(false);
  const dispatch = useDispatch();
  const contentRef = useRef();

  const fetchPrescriptionDetails = async (token) => {
    try {
      setIsLoading(true);
      const res = await callAPI(
        `${API_BASE_URL}/consultation/preview/${token}?from=preview`,
        "GET"
      );

      const data = res?.data?.response;

      if (data) {
        setVisitData(data);
      }
    } catch (error) {
      console.log(error);
      setIsInvalidLink(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptionDetails(token);
  }, [dispatch, token]);

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `Prescription_${visitData?.patientData?.name || "Patient"}_${
      visitData?.visitId || ""
    }`,
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
         visitData?.hospitalData?.logo || DEFAULT_HOSPITAL_LOGO
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

  if (isInvalidLink) {
    return (
      <div className="page bg-white">
        <div className="w-full max-w-[1200px] mx-auto mt-6">
          <div className="flex h-screen items-center justify-center gap-2">
            <div className="relative w-24 h-24 mr-4">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                <InfoIcon className="w-12 h-12 text-red-500" />
              </div>
              <div className="absolute inset-0 bg-red-200 rounded-full animate-ping opacity-30"></div>
            </div>
            <p className="text-xl text-blue">
              This prescription link has expired or is no longer valid. Please
              contact your healthcare provider for a new link.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page bg-white">
      <div id="pdf-container" className="w-full max-w-[1200px] mx-auto mt-6">
        {isLoading ? (
          <div className="flex h-screen items-center justify-center gap-2">
            <Spinner />
            <p className="">We are loading your prescription details...</p>
          </div>
        ) : (
          <>
            <PrescriptionDetails
              visitData={visitData}
              patientData={visitData?.patientData || {}}
              hospitalData={visitData?.hospitalData || {}}
              from="preview"
              ref={contentRef}
            />
            <div className="flex justify-center mt-4">
              <Button onClick={handlePrint}>Download PDF</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PrescriptionPreview;

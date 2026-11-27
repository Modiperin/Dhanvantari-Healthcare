import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../components/Modal";
import { formatDate } from "../../../utils/dateAndTime";
import { useEffect, useState } from "react";
import { cn } from "../../../lib/utils";
import {
  resetPatientPrescriptionsStatus,
  resetViewPatientByIdStatus,
  viewPrescriptions,
} from "../../../slices/patientSlice";
import DateListSkeleton from "./DateListSkeleton";
import CommonAccordionItem from "../../../components/CommonAccordion";
import DynamicGrid from "./DynamicGrid";
import { removeKeysFromObject } from "../../../utils/common";
import NormalTableView from "../../../components/table/NormalTableView";
import MedicationCard from "./MedicationCard";
import AccordionSkeleton from "./AccordionSkeleton";
import EmblaCarousel from "../../../components/EmblaCarousel";

const PatientHistoryModal = ({ open = true, onClose }) => {
  const [selectedVisit, setSelectedVisit] = useState("");
  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (id) => {
    setOpenItems(
      (prev) =>
        prev.includes(id)
          ? prev.filter((itemId) => itemId !== id) // Close if already open
          : [...prev, id] // Open if currently closed
    );
  };

  //patient history related
  const dispatch = useDispatch();
  const { getPatientPrescriptionsApi, viewPrescriptionsApi } = useSelector(
    (state) => state.patientManagement
  );

  // console.log({ selectedVisit })
  const rawVitalData = viewPrescriptionsApi.data?.response?.vitalData;
  const rawComplaints = rawVitalData?.complaints;
  const rawDiagnosis =
    viewPrescriptionsApi.data?.response?.consultationData?.diagnosis;
  const rawMedication =
    viewPrescriptionsApi.data?.response?.consultationData?.medications;
  const rawLabs = viewPrescriptionsApi.data?.response?.consultationData?.labs;
  const rawClinicalFindings =
    viewPrescriptionsApi.data?.response?.consultationData?.clinicalFindings;
  const rawReferToDoctor =
    viewPrescriptionsApi.data?.response?.consultationData?.referToDoctor;

  const complaints =
    rawComplaints?.reduce((ac, r) => {
      const [el1, ...rest] = Object.keys(r);
      ac[r[el1]] = rest.map((el) => (el === "days" ? `${r[el]} ${el}` : r[el]));
      return ac;
    }, {}) || {};

  const diagnosis =
    rawDiagnosis?.reduce((ac, r) => {
      const [el1, ...rest] = Object.values(r);
      const newRest = rest.reduce((acc, el) => {
        if (typeof el === "object") {
          acc.push(Object.values(el).join(" "));
        } else {
          acc.push(el);
        }
        return acc;
      }, []);
      ac[el1] = newRest;
      return ac;
    }, {}) || {};

  const medications =
    rawMedication?.map((m) =>
      removeKeysFromObject(m, ["timing", "totalQuantity"])
    ) || [];

  const labs =
    rawLabs?.reduce((ac, r) => {
      const [el1, ...rest] = Object.values(r);
      const newRest = rest.reduce((acc, el) => {
        if (typeof el === "object") {
          acc.push(Object.values(el).join(" "));
        } else {
          acc.push(el);
        }
        return acc;
      }, []);
      ac[el1] = newRest;
      return ac;
    }, {}) || {};

  const clinicalFindings =
    rawClinicalFindings?.reduce((ac, r) => {
      const [el1, ...rest] = Object.values(r);
      ac[el1] = rest;
      return ac;
    }, {}) || {};

  const referToDoctor = rawReferToDoctor
    ? removeKeysFromObject(rawReferToDoctor, "id")
    : {};

  const VITAL_FIELDS = {
    Height: "height",
    Temperature: "temperature",
    SPO2: "spo2",
    "Respiration Rate": "respirationRate",
    Pulse: "pulse",
    BSF: "bsf",
    Weight: "weight",
    BP: "bp",
    RBS: "rbs",
    BMI: "bmi",
    "BS PP": "bspp",
  };

  const UNITS = {
    height: "cm",
    temperature: "°F",
    spo2: "%",
    respirationRate: "bpm",
    pulse: "/min",
    bsf: "mg/dl",
    weight: "kg",
    bp: "mmHg",
    rbs: "mg/dl",
    bmi: "kg/m²",
    bspp: "mg/dl",
  };

  const transformVitalData = (rawVitalData) => {
    return Object.keys(VITAL_FIELDS).reduce((acc, displayField) => {
      const dataField = VITAL_FIELDS[displayField];
      const value = rawVitalData?.[dataField];
      acc[displayField] = value ? `${value} ${UNITS[dataField]}` : null;
      return acc;
    }, {});
  };

  const vitalData = rawVitalData ? transformVitalData(rawVitalData) : {};

  const dateList =
    getPatientPrescriptionsApi.data?.response?.list
      ?.map((p) => ({
        id: p.visitId,
        m: formatDate(p.createdAt, "MMM"),
        d: formatDate(p.createdAt, "dd"),
        y: formatDate(p.createdAt, "yyyy"),
        t: formatDate(p.createdAt, "hh:mm a"),
        createdAt: p.createdAt,
      }))
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) || [];

  const accordionData = [];

  if (selectedVisit) {
    if (rawVitalData) {
      accordionData.push({
        id: "vitalDetails",
        title: "Vitals Details",
        content: <DynamicGrid data={vitalData} />,
        color: "#F8FBFF",
        border: "#005FAC1A",
      });
    }

    if (rawComplaints) {
      accordionData.push({
        id: "complaints",
        title: "Complaints",
        content: <NormalTableView data={complaints} />,
        color: "#F8FBFF",
        border: "#005FAC1A",
      });
    }

    if (rawDiagnosis) {
      accordionData.push({
        id: "diagnosis",
        title: "Diagnosis",
        content: <NormalTableView data={diagnosis} />,
      });
    }

    if (rawMedication) {
      accordionData.push({
        id: "medications",
        title: "Medications",
        content: <MedicationCard data={medications} />,
        color: "#00AC001A",
      });
    }

    if (rawLabs) {
      accordionData.push({
        id: "labs",
        title: "Lab Investigations",
        content: <NormalTableView data={labs} />,
        color: "#005FAC1A",
      });
    }

    if (rawClinicalFindings) {
      accordionData.push({
        id: "clinicalFindings",
        title: "Clinical Findings",
        content: <NormalTableView data={clinicalFindings} />,
        color: "#AC00031A",
      });
    }

    if (rawReferToDoctor) {
      accordionData.push({
        id: "referToDoctor",
        title: "Refer To Doctor",
        content: <NormalTableView data={referToDoctor} />,
      });
    }
  }

  useEffect(() => {
    if (selectedVisit) {
      dispatch(viewPrescriptions({ visitId: selectedVisit }));
    } else if (dateList.length > 0 && !selectedVisit) {
      setSelectedVisit(dateList[0].id);
    }
  }, [selectedVisit, getPatientPrescriptionsApi]);

  useEffect(() => {
    return () => {
      setSelectedVisit("");
      setOpenItems([]);
      dispatch(() => resetViewPatientByIdStatus());
      dispatch(() => resetPatientPrescriptionsStatus());
    };
  }, []);

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title={<span className="text-blue text-xl">Patient History</span>}
      contentClassName="min-w-[650px] max-h-[85vh] min-h-[20vh] overflow-y-auto"
      className="bg-white rounded-md pb-4 flex flex-col gap-4"
      showClose
    >
      <div className="flex items-center w-full flex-1 gap-2">
        {getPatientPrescriptionsApi.isLoading ? (
          <DateListSkeleton />
        ) : dateList.length > 0 ? (
          <EmblaCarousel>
            {dateList.map((d) => {
              return (
                <div
                  key={d.id}
                  onClick={() => {
                    setSelectedVisit(d.id);
                    setOpenItems([]);
                    toggleItem("medications");
                  }}
                >
                  <div
                    className={cn(
                      "cursor-pointer flex flex-col rounded-t-lg items-center border border-light-blue  text-xs px-8 py-1",
                      selectedVisit === d.id
                        ? "text-white bg-blue"
                        : "text-blue bg-white"
                    )}
                  >
                    <span>{d.m}</span>
                    <span className="font-semibold text-lg leading-5">
                      {d.d}
                    </span>
                    <span>{d.y}</span>
                  </div>
                  <div className="text-[10px] text-blue bg-light-blue text-center py-1 rounded-b-lg">
                    {d.t}
                  </div>
                </div>
              );
            })}
          </EmblaCarousel>
        ) : (
          <div className="mx-auto text-2xl mt-2">No Data Found</div>
        )}
      </div>
      {viewPrescriptionsApi.isLoading ? (
        <AccordionSkeleton />
      ) : (
        accordionData.map((item) => (
          <CommonAccordionItem
            key={item.id}
            id={item.id}
            isOpen={openItems.includes(item.id)} // Check if this item is in open array
            onClick={() => toggleItem(item.id)}
            headerContent={item.title}
            headerColor={item.color}
            headerBorderColor={item.border}
            bodyContent={item.content || <></>}
          />
        ))
      )}
    </Modal>
  );
};

export default PatientHistoryModal;

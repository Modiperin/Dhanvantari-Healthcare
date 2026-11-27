import React, { forwardRef } from "react";
import VerticalLine from "../../../components/lines/VerticalLine";
import HorizontalLine from "../../../components/lines/HorizontalLine";
import TableHeader from "../../../components/table/TableHeader";
import ClockIcon from "../../../assets/svg/clock.svg?react";
import { formatDate } from "../../../utils/dateAndTime";
import { dobToAge, formatDateToReadable } from "../../../utils/common";
import Divider from "../../../components/Divider";
import { DEFAULT_HOSPITAL_LOGO, WEB_APP_URL } from "../../../utils/config";
import { medicalTimingOptions } from "../helper";
import { QRCodeSVG } from "qrcode.react";
import logo from "../../../assets/images/logo/dhanvantari-logo-blue.svg";

const headerData = [
  {
    name: "Medicine Name",
    value: "Medications",
    _class: "col-span-3",
  },
  {
    name: "Frequency",
    value: "Frequency",
    _class: "col-span-3",
  },
  {
    name: "Duration",
    value: "Duration",
    _class: "col-span-3",
  },
  {
    name: "Instruction",
    value: "instruction",
    _class: "col-span-3",
  },
];

const PrescriptionDetails = forwardRef(
  ({ visitData, patientData, hospitalData, from = "" }, ref = null) => {
    const consultationData = visitData?.consultationData || [];
    const doctorData = visitData?.doctorData || {};

    // Patient Info
    const patientName = patientData?.name || "N/A";
    const patientCode = visitData?.visitId || "N/A";
    const gender = patientData?.gender || "N/A";
    const age = dobToAge(patientData?.dateOfBirth);

    const visitDate = visitData?.createdAt
      ? formatDate(visitData.createdAt, "MMMM do yyyy, hh:mm a")
      : "N/A";

    // Doctor Info
    const doctorName = doctorData?.name || "N/A";

    const titleName = doctorData?.titleName || "";
    const hospitalName = hospitalData?.name || "N/A";

    // Complaints
    const complaints =
      visitData?.vitalData?.complaints?.map(
        (c) => `${c.chief}${c.region ? ` (${c.region})` : ""}`,
      ) || [];

    // Diagnosis
    const diagnosis = consultationData.diagnosis?.map((d) => `${d.name}`) || [];

    // Medications
    const medications = consultationData.medications?.map((med) => ({
      name: med.name,
      timing:
        medicalTimingOptions.find((option) => option.value === med.timing)
          ?.label || "-",
      unit: med.totalQuantity ? `[${med.totalQuantity} unit]` : "-",
      frequency:
        Array.isArray(med.timeSlot) && med.timeSlot.length
          ? med.timeSlot.map((slot) => `${slot}(${med.doses})`).join(" - ")
          : "-",
      duration: med.noOfDays ? `${med.noOfDays} Days` : "-",
      instruction: med.instruction || "-",
    })) || [
      {
        name: "-",
        generic: "-",
        unit: "-",
        frequency: "-",
        duration: "-",
        instruction: "-",
      },
    ];

    // Labs
    const labs = consultationData.labs?.map((l) => l.name) || [];

    // Clinical Findings
    const findings =
      consultationData.clinicalFindings?.map((f) => f.name) || [];

    // Referred To
    const referredTo = "";
    //  consultationData.referToDoctor
    //     ? `Doctor: ${consultationData.referToDoctor.name}${
    //         consultationData.referToDoctor.notesForPatient
    //           ? `, ${consultationData.referToDoctor.notesForPatient}`
    //           : ""
    //       }`
    //     : "";

    const followUp = visitData?.followUp || "";

    return (
      <div
        ref={ref}
        className={`flex flex-col overflow-scroll border p-4 text-blue border-light-blue print:border-none w-full rounded-md scrollbar-hide ${
          from === "preview" ? "min-h-screen" : ""
        }`}
      >
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-light-blue">
          <div className="flex flex-col">
            <div className="font-bold text-lg lg:text-xl">
              {titleName} {doctorName}
            </div>
            <span className="text-[12px]">
              <Divider items={doctorData?.qualifications} />
              <div>Reg No.:{doctorData?.registrationNo || " N/A"}</div>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="">
              <img
                src={hospitalData?.logo || DEFAULT_HOSPITAL_LOGO}
                alt="Company Logo"
                height="90px"
                width="90"
              />
            </div>
            <div className="flex flex-col text-right">
              <span className="font-bold text-lg lg:text-xl">
                {hospitalName}
              </span>
              <span className="text-sm">{hospitalData?.address}</span>
              <span className="text-sm">
                Ph: {hospitalData?.phoneNo || "N/A"}
              </span>
              <span className="text-sm">
                Email: {hospitalData?.email || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Patient Info */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center xl:justify-between mb-2 gap-1">
          <div className="flex flex-wrap gap-1 items-center lg:justify-center">
            <span className="text-xl lg:text-2xl">{patientName}</span>
            <VerticalLine />
            <span className="text-sm">{patientCode}</span>
            <VerticalLine />
            <span className="text-sm capitalize">{gender}</span>
            <VerticalLine />
            <span className="text-sm">{age ? `${age} year(s)` : "N/A"}</span>
          </div>
          <div className="text-sm flex gap-1 items-center">
            <ClockIcon />
            <span>{visitDate}</span>
          </div>
        </div>

        {/* Habits */}
        {/* <div className="flex items-center my-2 gap-2">
        <div className="min-w-40">Lifestyle Habits</div>
        <VerticalLine />
        {habits.map((h, idx) => (
          <div className="text-sm flex gap-1" key={idx}>
            <span className="font-semibold">{h.label}:</span>
            <span>{h.value}</span>
          </div>
        ))}
      </div>
      <HorizontalLine /> */}

        {/* Complaints */}
        {(complaints.length && (
          <>
            <div className="flex items-center my-2 gap-2">
              <div className="min-w-40">Chief Complaints</div>
              <VerticalLine />
              <div className="text-sm flex gap-1">
                {complaints.map((c, idx) => (
                  <React.Fragment key={idx}>
                    <span>{c === "null" ? "N/A" : c}</span>
                    {idx !== complaints.length - 1 && <VerticalLine />}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <HorizontalLine />
          </>
        )) ||
          null}

        {/* Diagnosis */}
        {(diagnosis.length && (
          <>
            <div className="flex items-center my-2 gap-2">
              <div className="min-w-40">Diagnosis</div>
              <VerticalLine />
              <div className="text-sm flex gap-1">
                {diagnosis.map((d, idx) => (
                  <React.Fragment key={idx}>
                    <span>{d}</span>
                    {idx !== diagnosis.length - 1 && <VerticalLine />}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <HorizontalLine />
          </>
        )) ||
          null}

        {/* Prescription */}
        {/* Todo Need to show the full form of M-A-E-N below the table */}
        <div className="my-3">
          <p className="text-xl">Prescription</p>
          <div className="mt-3 border border-light-blue rounded-lg">
            <TableHeader data={headerData} />
            <div className="overflow-x-scroll text-sm border-t border-light-blue scrollbar-hide">
              {medications.map((medication, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 items-center justify-between py-2 px-4 border-b border-light-blue"
                >
                  <div className="col-span-3 flex flex-col">
                    <span>{medication.name}</span>
                    <span>{medication.unit}</span>
                  </div>
                  <div className="col-span-3 flex flex-col">
                    <span>{medication.frequency}</span>
                    <span>{medication?.timing}</span>
                  </div>
                  <div className="col-span-3">{medication.duration}</div>
                  <div className="col-span-3">{medication.instruction}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Labs */}
        {labs.length ? (
          <>
            <div className="flex items-center my-2 gap-2">
              <div className="min-w-40">Prescribed Lab Tests</div>
              <VerticalLine />
              <div className="flex flex-wrap gap-2 text-sm">
                {labs.map((test, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span>{test}</span>
                    {idx !== labs.length - 1 && <VerticalLine />}
                  </div>
                ))}
              </div>
            </div>
            <HorizontalLine />
          </>
        ) : null}

        {/* Findings */}
        {(findings.length && (
          <>
            <div className="flex items-center my-2 gap-2">
              <div className="min-w-40">Examination Findings</div>
              <VerticalLine />
              <div className="text-sm flex gap-1">
                {findings.map((finding, idx) => (
                  <span key={idx}>{finding}</span>
                ))}
              </div>
            </div>
            <HorizontalLine />
          </>
        )) ||
          null}

        {/* Referred To */}
        {(referredTo && (
          <>
            <div className="flex items-center my-2 gap-2">
              <div className="min-w-40">Referred To</div>
              <VerticalLine />
              <div className="text-sm flex gap-1">
                <span>{referredTo}</span>
              </div>
            </div>
            <HorizontalLine />
          </>
        )) ||
          null}

        {/* Follow-up */}
        {Object.keys(followUp).length > 0 && (
          <div className="flex items-center my-2 gap-2">
            {/* <div className="min-w-40">Follow-up</div> */}
            Next Follow-up visit on
            <VerticalLine />
            <div className="flex gap-1">
              <span className="font-semibold">
                {formatDateToReadable(followUp.date)}
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-between items-end mt-8">
          <div className="flex flex-col items-center">
            <QRCodeSVG
              value={`${WEB_APP_URL}/${visitData?.prescriptionLink}`}
              size={100}
              level="M"
            />
            <div className="text-xs mt-1 text-center">
              <div>Digital Prescription</div>
              <div className="text-gray-600">Scan to download</div>
            </div>
          </div>

          {from !== "preview" ? (
            <div className="text-right font-semibold">
              <div className="mb-8">_________________</div>
              <div>
                {titleName} {doctorName}
              </div>
            </div>
          ) : null}
        </div>

        <div className="hidden print:flex print-footer flex-col">
          <div className="flex justify-center items-center gap-1">
            <div className="text-xs mt-1">Powered by</div>
            <img src={logo} alt="Company Logo" height="100px" width="100px" />
          </div>
          <div className="text-[8px] text-center">{consultationData?._id}</div>
        </div>
      </div>
    );
  },
);

export default PrescriptionDetails;

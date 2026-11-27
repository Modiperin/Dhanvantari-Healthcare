import React from "react";
import Button from "./Button";
import TooltipWrapper from "../ReactTooltip";
import { downloadCSV } from "../../utils/downloadCSV";
import DownloadIcon from "../../assets/svg/download.svg?react";

export const keysToRemoveDefault = [
  "_id",
  "createdAt",
  "updatedAt",
  "__v",
  "id",
  "hospitalId",
  "patientId",
  "doctorId",
  "departmentId",
  "appointmentId",
  "userId",
  "dob",
];

const DownloadCsvButton = ({
  name = "Download Data",
  fileName = "data.csv",
  data = [],
  keysToRemove = [],
  fullWidth = false,
}) => {
  const handleDownload = () => {
    downloadCSV({
      data,
      fileName,
      keysToRemove: keysToRemoveDefault.concat(keysToRemove),
    });
  };

  if (fullWidth) {
    // Full width button, no tooltip, show name
    return (
      <Button
        className="h-full flex items-center justify-center gap-2 text-xs lg:text-sm"
        onClick={handleDownload}
      >
        <DownloadIcon />
        <span className="hidden lg:flex">{name}</span>
      </Button>
    );
  }

  // Half width button, show tooltip, only icon
  return (
    <TooltipWrapper id="Download" content={name}>
      <Button className="h-full" onClick={handleDownload}>
        <DownloadIcon />
      </Button>
    </TooltipWrapper>
  );
};

export default DownloadCsvButton;

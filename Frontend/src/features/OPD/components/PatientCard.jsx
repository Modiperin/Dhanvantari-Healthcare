import ClockIcon from "../../../assets/svg/clock.svg?react";
import DocUserIcon from "../../../assets/svg/user.svg?react";
import DocumentCopyIcon from "../../../assets/svg/document-copy.svg?react";
import HeartIcon from "../../../assets/svg/heart.svg?react";
// import DocumentUpload from "../../../assets/svg/document-upload.svg?react";
import ProfileIcon from "../../../assets/svg/profile.svg?react";
import PhoneIcon from "../../../assets/svg/phone.svg?react";
import ManIcon from "../../../assets/svg/man.svg?react";
import WomenIcon from "../../../assets/svg/woman.svg?react";
import useNavigateTo from "../../../hooks/useNavigateTo";
import { getPatientStatusIcon, getPriorityIcon } from "../../../utils/icon";
import { prioriry } from "../../../utils/types";
import { formatDate } from "../../../utils/dateAndTime";
import ActionDropdown from "../../../components/ActionDropdown";
import { useState } from "react";
import { dobToAge } from "../../../utils/common";
import TooltipWrapper from "../../../components/ReactTooltip";
import { ROUTES } from "../../../routes/helper";

const PatientCard = ({
  visitId,
  name,
  gender,
  age,
  priority: priorityName,
  phoneNo,
  visitType,
  time,
  doctorDetails,
  departmentDetails,
  // onUploadDocs,
  handleEndVisit,
  handlePrint = () => {},
  currentStatus,
  from = "nurseopd",
}) => {
  const goTo = useNavigateTo();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleButtonClick = () => {
    let redirectUrl = `${ROUTES.NURSE_OPD_VITAL}/${visitId}`;

    if (from === "doctoropd") {
      redirectUrl = `${ROUTES.DOCTOR_OPD_CONSULTATION}/${visitId}`;
    }

    goTo(redirectUrl);
  };

  const labelMap = {
    nurseopd: {
      Ongoing: "Resume Vital",
      Pending: "Vital Collection",
    },
    doctoropd: {
      Ongoing: "Resume Consultation",
      Pending: "Start Consultation",
    },
  };

  return (
    <>
      <div className="relative border border-light-blue hover:border-blue/40  text-blue rounded-xl p-2 lg:p-4 flex flex-col gap-1 lg:gap-2 mt-4 lg:mt-6">
        {currentStatus === "Ongoing" && (
          <span className="absolute -top-6 lg:-top-7 left-8 bg-[#00ac0030] rounded-sm px-4 py-1 text-xs lg:text-sm">
            {"Ongoing"}
          </span>
        )}

        <div className="flex items-center gap-2 justify-between">
          <div className="text-sm lg:text-lg flex items-center gap-2 font-medium">
            <ProfileIcon />
            <div className="overflow-x-auto whitespace-nowrap scrollbar-hide max-w-[150px]">
              <TooltipWrapper
                id="patient-name"
                content={name}
                // className="!font-sans !text-blue !bg-white !border !border-light-blue"
              >
                <span className="inline-block cursor-pointer">{name}</span>
              </TooltipWrapper>
            </div>
            |{" "}
            <div className="flex items-center">
              {gender === "male" ? <ManIcon /> : <WomenIcon />} {dobToAge(age)}y
            </div>
          </div>
          <div className="flex text-xs lg:text-sm items-center gap-1">
            <div className="flex items-center gap-1">
              {getPriorityIcon(priorityName)}
              {prioriry[priorityName]}
            </div>
            <div className="w-px h-6 bg-blue-100 mx-2" />
            <div className="flex items-center gap-1">
              {getPatientStatusIcon(visitType)}
              {visitType}
            </div>
            <div className="w-px h-6 bg-blue-100 mx-2" />
            <div className="flex items-center gap-1">
              <ClockIcon />
              {/* 03:34 PM */}
              {formatDate(time, "hh:mm a")}
            </div>
          </div>
        </div>

        <div className="flex text-xs lg:text-sm items-center gap-2 justify-between">
          <div className="flex items-center gap-1 text-light-blue-text">
            {/* {code} / {phone} */}
            <div className="flex items-center gap-1">
              <DocumentCopyIcon />
              {visitId}
            </div>
            <div className="w-px h-6 bg-blue-100 mx-2" />
            <div className="flex items-center gap-1">
              <PhoneIcon className="w-4 h-4" /> {phoneNo || "N/A"}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="flex items-center gap-1">
              <DocUserIcon />
              {doctorDetails?.titleName} {doctorDetails?.name || "N/A"}
            </span>
            <div className="w-px h-6 bg-blue-100 mx-2" />
            <span className="">{departmentDetails?.name || "N/A"}</span>
          </div>
        </div>

        <div className="flex gap-2 lg:mt-3 flex-wrap">
          <ActionDropdown
            buttonIcon={<HeartIcon />}
            actions={[
              {
                label: "View Patient Details",
                // icon: <HeartIcon />,
                onClick: () => {},
              },
              {
                label: "Print Case",
                // icon: <HeartIcon />,
                onClick: () => {
                  handlePrint({
                    doctorDetails,
                    patientName: name,
                    gender,
                    age: dobToAge(age),
                  });
                },
              },
              {
                label: "End Visit",
                // icon: <HeartIcon />,
                onClick: () => handleEndVisit(visitId),
              },
              {
                label: "No Show",
                // icon: <HeartIcon />,
                onClick: () => {},
              },
            ]}
            open={dropdownOpen}
            onOpenChange={setDropdownOpen}
          >
            <button
              className="rounded-full cursor-pointer text-xs lg:text-sm text-blue bg-[#F0F7FF] p-2 lg:px-3 lg:py-2 hover:bg-blue-50"
              onClick={() => setDropdownOpen((open) => !open)}
            >
              <span className="px-1">+</span> Other Action
            </button>
          </ActionDropdown>

          <button
            className={`rounded-full cursor-pointer p-2 lg:px-3 lg:py-2 text-xs lg:text-sm flex items-center gap-1 ${
              currentStatus === "Ongoing" ? "bg-[#00AC001A]" : "bg-[#F0F7FF]"
            }`}
            onClick={handleButtonClick}
          >
            <HeartIcon />
            {labelMap[from][currentStatus] || "Action"}
          </button>

          {/* <button
            className="rounded-full cursor-pointer flex items-center gap-1 border border-light-blue px-3 py-1 text-sm"
            onClick={onUploadDocs}
          >
            <DocumentUpload /> Upload Medical Documents
          </button> */}
        </div>
      </div>
    </>
  );
};

export default PatientCard;

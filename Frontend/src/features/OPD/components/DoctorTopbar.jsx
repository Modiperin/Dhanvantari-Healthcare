import Clock from "../../../assets/svg/clock.svg?react";
import BackIcon from "../../../assets/svg/back.svg?react";
import useNavigateTo from "../../../hooks/useNavigateTo";
import ProfileIcon from "../../../assets/svg/profile.svg?react";
import VerticalLine from "../../../components/lines/VerticalLine";
import PhoneIcon from "../../../assets/svg/phone.svg?react";
import SMSIcon from "../../../assets/svg/sms.svg?react";
import { dobToAge } from "../../../utils/common";
import {
  getGenderSymbolIcon,
  getPatientStatusIcon,
  getPriorityIcon,
} from "../../../utils/icon";
import { prioriry } from "../../../utils/types";

const DoctorTopBar = ({ patientVisitData }) => {
  const goTo = useNavigateTo();
  const patientData = patientVisitData?.patientData;

  return (
    <div className="sticky top-0 z-[39] backdrop-blur-sm text-blue py-3 px-4 h-16 w-full rounded-lg bg-white/90 flex items-center justify-between border-b border-light-blue text-sm">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => goTo(-1)}
          className="p-2 cursor-pointer rounded-lg hover:bg-blue-100 transition-colors"
          aria-label="Go back"
        >
          <BackIcon />
        </button>
        <span className="flex font-semibold items-center gap-2">
          <ProfileIcon />
          {patientData?.name}
        </span>
        <div className="text-blue hidden xl:flex flex-wrap gap-0.5 ml-2 text-xs items-center">
          <div className="font-medium">#P-{patientData?.serialId}</div>
          <VerticalLine />
          <div className="flex gap-0.5 items-center">
            <PhoneIcon className="mr-0.5 h-4 w-4" />
            <span>{patientData?.phoneNo}</span>
          </div>
          <VerticalLine />
          <div className="flex gap-0.5 items-center">
            <SMSIcon className="mr-0.5 h-4 w-4" />
            <span>{patientData?.email}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span>
          Age:
          {patientData?.dateOfBirth
            ? dobToAge(patientData?.dateOfBirth)
            : "N/A"}
        </span>
        <VerticalLine />
        <div className="flex text-blue-500 items-center gap-1 p-2 bg-extra-light-blue rounded-md">
          {getGenderSymbolIcon(patientData?.gender)}
          <span className="capitalize">{patientData?.gender}</span>
        </div>

        <div className="flex items-center justify-between gap-1 ml-1">
          <span>Blood Group</span>
          <span className="flex items-center gap-1 p-1 bg-pink-100 rounded-md">
            {patientData?.bloodGroup || "N/A"}
          </span>
        </div>
        <VerticalLine />
        <div className="flex items-center gap-1">
          {getPriorityIcon(patientData?.priority)}
          {prioriry[patientData?.priority] || "Normal"}
        </div>
        <VerticalLine />
        <div className="flex items-center gap-1">
          {patientVisitData?.type &&
            getPatientStatusIcon(patientVisitData?.type)}
          {patientVisitData?.type || "N/A"}
        </div>
        <VerticalLine />

        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          13:45
        </span>
      </div>
    </div>
  );
};

export default DoctorTopBar;

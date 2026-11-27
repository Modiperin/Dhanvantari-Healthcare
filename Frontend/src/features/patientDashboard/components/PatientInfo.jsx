import VerticalLine from "../../../components/lines/VerticalLine";
import PhoneIcon from "../../../assets/svg/phone.svg?react";
import SMSIcon from "../../../assets/svg/sms.svg?react";

const PatientInfo = ({ patientData }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="h-14 w-14 rounded-full bg-light-blue flex items-center justify-center text-xl font-base text-blue">
        {(() => {
          const initials = patientData?.name
            ?.split(" ")
            .map((n) => n[0])
            .filter(Boolean);

          if (!initials?.length) return "";

          if (initials.length <= 2) {
            return initials.join("").toUpperCase();
          }
          return initials.slice(0, 2).join("").toUpperCase();
        })()}
      </div>
      <div>
        <h2 className="text-xl font-bold text-blue word-spacing">
          {patientData?.name}
        </h2>
        <div className="mt-1 text-blue flex flex-wrap gap-2 text-sm">
          <div className="font-medium">#P-{patientData?.serialId}</div>
          <VerticalLine />
          <div className="flex gap-1 items-center">
            <PhoneIcon className="mr-1 h-4 w-4" />
            <span>{patientData?.phoneNo}</span>
          </div>
          <VerticalLine />
          <div className="flex gap-1 items-center">
            <SMSIcon className="mr-1 h-4 w-4" />
            <span>{patientData?.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;

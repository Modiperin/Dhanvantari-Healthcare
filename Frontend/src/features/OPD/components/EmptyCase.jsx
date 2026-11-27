import VerticalLine from "../../../components/lines/VerticalLine";
import Divider from "../../../components/Divider";
// import logo from "../../../assets/images/logo/logo.png";
import logo from "../../../assets/images/logo/dhanvantari-logo-blue.svg"
import { DEFAULT_HOSPITAL_LOGO } from "../../../utils/config";

const EmptyCase = ({
  doctorName,
  patientName,
  gender,
  age,
  hospitalData,
  doctorData,
}) => {
  const hospitalName = hospitalData?.name || "N/A";
  return (
    <div className="flex flex-col flex-1 flex-grow min-h-[94vh] p-4 text-blue w-full rounded-md overflow-hidden">
      {/* Top Section: Doctor and Hospital Info */}
      <div className="flex justify-between items-start pb-4 mb-4 border-b border-light-blue">
        {/* Doctor Info */}
        <div className="flex flex-col">
          <div className="font-bold text-xl">{doctorName}</div>
          <span className="text-[12px]">
            <Divider items={doctorData?.qualifications} />
            <div>Reg No.:{doctorData?.registrationNo || " N/A"}</div>
          </span>
        </div>

        {/* Hospital Info */}
        <div className="flex items-center gap-4">
          <div>
            <img
              src={hospitalData.logo || DEFAULT_HOSPITAL_LOGO}
              alt="Company Logo"
              height="90px"
              width="90"
            />
          </div>
          <div className="flex flex-col text-right">
            <div className="font-bold text-xl">{hospitalName}</div>
            <div className="text-sm">{hospitalData?.address}</div>
            <div className="text-sm">Ph: {hospitalData?.phoneNo || "N/A"}</div>
            <div className="text-sm">Email: {hospitalData?.email || "N/A"}</div>
          </div>
        </div>
      </div>

      {/* Patient Info */}
      <div className="flex flex-col justify-between !flex-grow min-h-[300px]">
        <div className="flex gap-2 items-center justify-start border-b border-light-blue pb-2">
          <span className="text-2xl font-medium">{patientName}</span>
          <VerticalLine />
          <span className="capitalize">{gender}</span>
          <VerticalLine />
          <span>{age ? `${age} year(s)` : "N/A"}</span>
        </div>
        <div className="">
          <div className="text-right mt-30 font-semibold">
            {doctorData?.titleName} {doctorName}
          </div>
          <div className="hidden print:flex print-footer justify-center items-center gap-1">
            <div className="text-xs mt-1">Powered by</div>
            <img src={logo} alt="Company Logo" height="100px" width="100px" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyCase;

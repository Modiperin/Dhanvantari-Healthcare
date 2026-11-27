import WalkinIcon from "../assets/svg/walkin.svg?react";
import AppointmentIcon from "../assets/svg/appointment.svg?react";
import CheckInIcon from "../assets/svg/checkin.svg?react";
import CheckOutIcon from "../assets/svg/checkout.svg?react";
import { cn } from "../lib/utils";
const IconText = ({ _class = "", text }) => {
  let IconComponent = null;

  switch (text) {
    case "Walkin":
      IconComponent = <WalkinIcon />;
      break;
    case "Checked-in":
      IconComponent = <CheckInIcon />;
      break;
    case "Checked-out":
      IconComponent = <CheckOutIcon />;
      break;
    case "Appointment":
      IconComponent = <AppointmentIcon />;
      break;
    default:
      IconComponent = null;
  }

  return (
    <div className={cn(_class, "flex gap-2 px-2 py-2")}>
      <span className="hidden lg:flex"> {IconComponent}</span>
      <span
        className={`text-[10px] lg:text-xs w-[80px] text-justify ${
          text === "Checked-in"
            ? "text-red-500"
            : text === "Checked-out"
            ? "text-green-500"
            : "text-blue"
        }`}
      >
        {text}
      </span>
    </div>
  );
};

export default IconText;

import FlagIcon from "../components/svgs/FlagIcon";
import WalkinIcon from "../assets/svg/walkin.svg?react";
import AppointmentIcon from "../assets/svg/appointment.svg?react";
import CheckInIcon from "../assets/svg/checkin.svg?react";
import CheckOutIcon from "../assets/svg/checkout.svg?react";
import ManSymbolIcon from "../assets/svg/manSymbol.svg?react";
import FemaleSymbolIcon from "../components/svgs/Female";

export const getPriorityIcon = (priority) => {
  switch (priority) {
    case "Emergency":
    case 1:
      return <FlagIcon color="#FF0000" />;
    case "VIP":
    case 2:
      return <FlagIcon color="#d4af37" />;
    default:
      return <FlagIcon />;
  }
};

export const getPatientStatusIcon = (status) => {
  switch (status) {
    case "Walkin":
      return <WalkinIcon />;
    case "Checked-in":
      return <CheckInIcon />;
    case "Checked-out":
      return <CheckOutIcon />;
    case "Appointment":
      return <AppointmentIcon />;
    default:
      return <></>;
  }
};

export const getGenderSymbolIcon = (gender) => {
  switch (gender) {
    case "male":
      return <ManSymbolIcon />;
    case "female":
      return <FemaleSymbolIcon />;
    default:
      return <></>;
  }
};

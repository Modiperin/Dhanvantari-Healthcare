import TableGrid from "../../../../components/table/TableGrid";
import { HeaderType } from "../../../../utils/types";

const headerForAppointment = [
  {
    name: "Doctor Name",
    value: "doctorName",
    _class: "col-span-4",
  },
  {
    name: "Date",
    value: "date",
    _class: "col-span-4",
  },
  {
    name: "Time",
    value: "time",
    _class: "col-span-2",
  },
  {
    name: "Continue",
    value: "continue",
    _class: "col-span-2",
    type: HeaderType.checkbox,
  },
];
const Appointments = ({
  appointmentData,
  setAppointmentData,
  setAppointmentId,
}) => {
  const handleChecked = (val) => {
    if (appointmentData.find((ele) => ele.id === val)?.continue === true) {
      setAppointmentId("");
      setAppointmentData(
        appointmentData.map((ele) => ({ ...ele, continue: false }))
      );
    } else {
      setAppointmentId(val);
      setAppointmentData(
        appointmentData.map((ele) =>
          ele.id === val
            ? { ...ele, continue: true }
            : { ...ele, continue: false }
        )
      );
    }
  };

  return (
    <div className="card flex flex-col gap-3">
      <h2 className="title">Appointment Details</h2>
      <TableGrid
        data={appointmentData}
        columns={headerForAppointment}
        isCompressView={true}
        handleChecked={handleChecked}
        from="appointment"
      />
    </div>
  );
};

export default Appointments;

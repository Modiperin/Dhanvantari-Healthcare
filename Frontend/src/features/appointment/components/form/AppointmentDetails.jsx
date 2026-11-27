import AntDatePicker from "../../../../components/AntDatePicker";
import { AntTimePicker } from "../../../../components/AntTimePicker";
import { useFormContext } from "react-hook-form";

const AppointmentDetails = () => {
  const { control, formState } = useFormContext();
  const { errors } = formState;
  return (
    <div className="card">
      <h2 className="title pb-1">Appointment Details</h2>
      <div className="grid grid-cols-4 gap-3">
        <div className="col-span-2">
          <AntDatePicker
            id="date"
            name="date"
            label="Appointment Date"
            control={control}
            errors={errors}
            required={true}
            format="DD/MM/YYYY"
            placeholder="DD/MM/YYYY"
          />
        </div>
        <div className="col-span-2">
          <AntTimePicker
            id="time"
            name="time"
            label="Appointment Time"
            format={"hh:mm A"}
            placeholder="HH:MM A"
            control={control}
            errors={errors}
            required={true}
          />
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;

import React from "react";
import Modal from "../../../components/Modal";
import AntDatePicker from "../../../components/AntDatePicker";
import { AntTimePicker } from "../../../components/AntTimePicker";
import Button from "../../../components/Buttons/Button";
import CancelButton from "../../../components/Buttons/CancelButton";

export const RescheduleModal = ({
  title = "Reschedule Appointment",
  primaryButtonName = "Reschedule",
  onClose,
  onConfirm,
  setRescheduleDate,
  setRescheduleTime,
  isDateTimeValid,
}) => {
  return (
    <>
      <Modal open={true} onOpenChange={onClose} title={title}>
        <div className="grid grid-cols-2 gap-x-4 mb-4">
          <AntDatePicker
            id="date"
            name="date"
            label="Reschedule Date"
            required={true}
            onChange={(date, dateString) => {
              // console.log(dateString);
              setRescheduleDate(dateString);
            }}
          />
          <AntTimePicker
            id="time"
            name="time"
            label="Reschedule Time"
            format={"hh:mm A"}
            placeholder="HH:MM A"
            required={true}
            onChange={(time, timeString) => {
              // console.log(timeString)
              setRescheduleTime(timeString);
            }}
          />
        </div>
        <div className="flex justify-end space-x-3 pb-7">
          <CancelButton onClick={onClose} />
          <Button
            onClick={onConfirm}
            disabled={!isDateTimeValid}
            className={`px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors`}
          >
            {primaryButtonName}
          </Button>
        </div>
      </Modal>
    </>
  );
};

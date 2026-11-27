import React, { useState } from "react";
import Button from "../../../components/Buttons/Button";
import CommonInput from "../../../components/CommonInput";
import DeleteIcon from "../../../assets/svg/trash.svg?react";
import AddIcon from "../../../assets/svg/add-circle.svg?react";
import Modal from "../../../components/Modal";
import CancelButton from "../../../components/Buttons/CancelButton";

const structureShift = (shift) => {
  const result = [];
  for (let i = 0; i < shift.length; i += 2) {
    if (shift[i + 1]) result.push({ start: shift[i], end: shift[i + 1] });
  }
  return result;
};

const TimePopup = ({
  doctor,
  day,
  open = true,
  onClose,
  onSubmit,
  initialTiming = ["09:00", "17:00"],
}) => {
  const [timing, setTiming] = useState(structureShift(initialTiming));

  const addShift = (shift) => setTiming((prev) => [...prev, shift]);

  const updateShift = (index, field, value) => {
    setTiming((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot))
    );
  };

  const removeShift = (index) => {
    setTiming((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const flattened = timing.flatMap(({ start, end }) => [start, end]);
    onSubmit(flattened);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title={
        <span className="text-blue text-xl">
          Set Timing for <b>{doctor?.name}</b> on <b>{day}</b>
        </span>
      }
      contentClassName="min-w-[650px] max-h-[85vh] overflow-y-auto bg-white"
      className="bg-white rounded-md px-6 py-4"
      showClose
    >
      {timing.map((slot, index) => (
        <div key={index} className="flex items-center gap-3 mb-3">
          <CommonInput
            id={`start-${index}`}
            labelName="Start Time"
            type="time"
            value={slot.start}
            onChange={(val) => updateShift(index, "start", val)}
          />
          <CommonInput
            id={`end-${index}`}
            labelName="End Time"
            type="time"
            value={slot.end}
            onChange={(val) => updateShift(index, "end", val)}
          />
          {index === 0 ? (
            <button
              type="button"
              onClick={() => addShift(timing[0])}
              className="p-2 rounded-full hover:bg-blue-100 cursor-pointer"
              aria-label="Add shift"
            >
              <AddIcon className="text-blue-600" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => removeShift(index)}
              className="p-2 rounded-full hover:bg-red-100 cursor-pointer"
              aria-label="Remove shift"
            >
              <DeleteIcon className="text-red-500" />
            </button>
          )}
        </div>
      ))}

      <div className="flex justify-end gap-3 mt-6 mb-2">
        <CancelButton onClick={onClose} />
        <Button onClick={handleSubmit}>Add Shift</Button>
      </div>
    </Modal>
  );
};

export default TimePopup;

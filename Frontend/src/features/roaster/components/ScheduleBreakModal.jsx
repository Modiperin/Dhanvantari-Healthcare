import { useState } from "react";
import Button from "../../../components/Buttons/Button";
import CommonInput from "../../../components/CommonInput";
import DeleteIcon from "../../../assets/svg/trash.svg?react";
import AddIcon from "../../../assets/svg/add-circle.svg?react";
import Modal from "../../../components/Modal";
import { splitDate } from "../../../utils/dateAndTime";
import AntDatePicker from "../../../components/AntDatePicker";
import CancelButton from "../../../components/Buttons/CancelButton";

const ScheduleBreakModal = ({ doctor, open = true, onClose, onSubmit }) => {
  const [date, setDate] = useState("");
  const [timing, setTiming] = useState([{ start: "09:00", end: "17:00" }]);
  const [isWholeDay, setIsWholeDay] = useState(true);

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

    onSubmit({
      date,
      timing: flattened,
      onLeave: isWholeDay,
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title={
        <span className="text-blue text-xl">
          Schedule Break for <b>{doctor?.name}</b>
        </span>
      }
      contentClassName="min-w-[650px] max-h-[85vh] overflow-y-auto bg-white"
      className="bg-white rounded-md px-6 py-4"
      showClose
    >
      <div>
        {/* <ReactDatePicker
          selectedDate={date}
          outputFormat="dd-MM-yyyy"
          placeholder="dd-mm-yyyy"
          onChange={handleDateChange}
        /> */}

        <AntDatePicker
          id="date"
          name="date"
          label="date"
          required={true}
          onChange={(date, dateString) => setDate(splitDate(dateString))}
        />
      </div>
      <div className="flex my-6 justify-between items-center text-blue">
        <span>I am not available for the whole day</span>
        <input
          type="checkbox"
          className="ml-2 h-4 w-4 accent-primary  border-gray-300 rounded focus:ring-primary"
          onChange={() => setIsWholeDay(!isWholeDay)}
          checked={isWholeDay}
        />
      </div>

      <div
        className={`transition-all duration-400 ease-in-out ${
          isWholeDay
            ? "opacity-0 scale-y-95 pointer-events-none h-0"
            : "opacity-100 scale-y-100 h-auto"
        } origin-top`}
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
      </div>

      <div className="flex justify-end gap-3 mt-6 mb-2">
        <CancelButton onClick={onClose} />
        <Button onClick={handleSubmit} disabled={!date}>
          Schedule Break
        </Button>
      </div>
    </Modal>
  );
};

export default ScheduleBreakModal;

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Modal from "./Modal";
import Button from "./Buttons/Button";
import { useDispatch, useSelector } from "react-redux";
import { updatePadConfig, updatePadConfigration } from "../slices/userSlice";
import {
  multipleErrorToastMessage,
  successToastMessage,
} from "../utils/toastMessage";
import Spinner from "./Spinner";

// Sortable row for each field
function SortableField({ id, label, active, onToggle }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex mt-2 items-center justify-between p-2 bg-white rounded-md border border-light-blue"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab flex items-center space-x-2"
      >
        <span className="text-gray-500">☰</span>
        <span className="text-gray-800">{label}</span>
      </div>

      <button
        onClick={() => onToggle(id)}
        className={`px-3 py-1 text-sm font-medium rounded cursor-pointer ${
          active
            ? "bg-blue border text-white"
            : "bg-light-blue text-blue border border-blue-100"
        }`}
      >
        {active ? "Active" : "Inactive"}
      </button>
    </div>
  );
}

const fieldIdToLabel = {
  complaints: "Complaints",
  vitals: "Vitals",
  diagnosis: "Diagnosis",
  medications: "Medications",
  lab: "Lab Results",
  clinicalFindings: "Clinical Findings",
  referToDoctor: "Refer To Doctor",
};

const initialFields = [
  { id: "vitals", label: "Vitals", active: true },
  { id: "complaints", label: "Complaints", active: true },
  { id: "diagnosis", label: "Diagnosis", active: true },
  { id: "medications", label: "Medications", active: true },
  { id: "lab", label: "Lab Results", active: true },
  { id: "clinicalFindings", label: "Clinical Findings", active: true },
  { id: "referToDoctor", label: "Refer To Doctor", active: true },
];

const DoctorPad = ({ open = "", onClose }) => {
  const user = useSelector((state) => state.user?.userInfo?.response);
  const updatePadConfigApi = useSelector(
    (state) => state.user?.updatePadConfigApi
  );

  const padConfigLoading = updatePadConfigApi?.isLoading;

  const dispatch = useDispatch();

  const padConfig =
    user?.padConfig && Object.keys(user.padConfig).length
      ? user.padConfig.map((field) => ({
          id: field.id,
          label: fieldIdToLabel[field.id],
          active: field.active,
        }))
      : null;

  const initialConfig = padConfig || initialFields;
  const [fields, setFields] = useState(initialConfig);

  useEffect(() => {
    if (updatePadConfigApi && updatePadConfigApi.status === "success") {
      successToastMessage("Pad configuration updated successfully");
      dispatch(updatePadConfigration(fields));
    } else if (updatePadConfigApi && updatePadConfigApi.status === "failed") {
      multipleErrorToastMessage(updatePadConfigApi);
    }
  }, [updatePadConfigApi, dispatch]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      setFields((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const toggleActive = (id) => {
    setFields((items) =>
      items.map((f) => (f.id === id ? { ...f, active: !f.active } : f))
    );
  };

  const handleSave = () => {
    const staffId = user?.userId;
    const data = {
      padConfig: fields.map((field) => ({
        id: field.id,
        active: field.active,
      })),
    };
    dispatch(updatePadConfig({ staffId, data }));
  };

  const hasChanges = useMemo(() => {
    return JSON.stringify(fields) !== JSON.stringify(initialConfig);
  }, [fields, initialConfig]);

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title={<span className="text-blue text-xl">Configure your Pad</span>}
      contentClassName="min-h-[650px] overflow-y-auto min-w-[90%] lg:min-w-[900px]"
      className="relative rounded-md"
      showClose
    >
      <div className="px-4 text-blue">
        <p className="p-3">Order of fields on pad</p>
        <div className="grid grid-cols-2 font-semibold  border-b pb-1">
          <span>FIELD</span>
          <span className="text-right">ENABLED / DISABLED</span>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {fields.map((field) => (
                <SortableField
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  active={field.active}
                  onToggle={toggleActive}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <div className="flex justify-end gap-4 pt-6">
          <Button variant="light" onClick={onClose}>
            Cancel
          </Button>

          <Button
            disabled={padConfigLoading || !hasChanges}
            onClick={handleSave}
          >
            {padConfigLoading ? <Spinner /> : "Save"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DoctorPad;

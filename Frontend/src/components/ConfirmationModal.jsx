import CancelButton from "./Buttons/CancelButton";
import SaveButton from "./Buttons/SaveButton";
import Modal from "./Modal";

export const ConfirmationModal = ({
  onClose,
  onConfirm,
  content,
  title,
  primaryButtonName,
}) => {
  return (
    <>
      <Modal open={true} onOpenChange={onClose} title={title}>
        <p className="text-gray-600 mb-6">{content}</p>
        <div className="flex justify-end space-x-3 pb-7">
          <CancelButton onClick={onClose} />
          <SaveButton
            onClick={onConfirm}
            name={primaryButtonName}
            className={`px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors`}
          />
        </div>
      </Modal>
    </>
  );
};

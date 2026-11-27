import Modal from "../../../components/Modal";
import { MedicalHistoryForm } from "./MedicalHistoryForm";
import MedicalHistorySkeletonLoader from "../loader/MedicalHistorySkeletonLoader";

const MedicalHistoryModal = ({
  history = {},
  open = true,
  onClose,
  onSubmit,
  isLoading = false,
  isHistoryApiLoading = false,
}) => {
  // console.log("MedicalHistoryModal history:", history);

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title={<span className="text-blue text-xl">Patient Medical History</span>}
      contentClassName="min-w-[650px] max-h-[85vh] overflow-y-auto bg-white"
      className="bg-white rounded-md px-6 py-4"
      showClose
    >
      {isHistoryApiLoading ? (
        <MedicalHistorySkeletonLoader />
      ) : (
        <MedicalHistoryForm
          onSubmit={onSubmit}
          history={history}
          isLoading={isLoading}
        />
      )}
    </Modal>
  );
};

export default MedicalHistoryModal;

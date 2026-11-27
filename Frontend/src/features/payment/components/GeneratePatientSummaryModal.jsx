import Button from "../../../components/Buttons/Button";
import Modal from "../../../components/Modal";

const GeneratePatientSummaryModal = ({ open = true, onClose }) => {
  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title={<span className="text-blue text-xl">Patient Payment Summary</span>}
      showClose
      className="pb-4"
    >
      <div className="text-blue h-full rounded-lg flex flex-col gap-2 text-sm divide-light-blue divide-y">
        <div className="w-full flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <p>Pharmacy Charges</p>
            <span className="text-xs px-2 py-1 rounded-xl text-green-500 bg-green-100 w-fit">
              Done
            </span>
          </div>
          <div>₹ 600</div>
        </div>
        <div className="w-full flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <p>Advance Payment</p>
            <span className="text-xs px-2 py-1 rounded-xl text-red-500 bg-red-100 w-fit">
              Not Done
            </span>
          </div>
          <div>₹ 1000</div>
        </div>
        <div className="w-full flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <p>Payment Status</p>
          </div>
          <span className="text-xs px-2 py-1 rounded-xl text-green-500 bg-green-100 w-fit">
            Billed
          </span>
        </div>
        <div className="w-full flex items-center justify-between py-2 text-xl">
          <p>Total Payable</p>
          <p>1600 ₹</p>
        </div>
      </div>
      <div className="flex items-center gap-4 my-2">
        <Button variant="light">Mark As Dues</Button>
        <Button>Make Payment</Button>
      </div>
    </Modal>
  );
};

export default GeneratePatientSummaryModal;

import { useState } from "react";
import Modal from "../../../components/Modal";
import CheckBox from "../../../components/Checkbox";
import SaveButton from "../../../components/Buttons/SaveButton";

const DueSettlementModal = ({
  dueVisitList,
  open = true,
  onClose,
  handleSubmit,
  isDueSettlementLoading,
}) => {
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const handleChecked = (invoiceId) => {
    setSelectedInvoices((prev) =>
      prev.includes(invoiceId)
        ? prev.filter((id) => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title={<span className="text-blue text-xl">Previous Dues Overview</span>}
      contentClassName="min-w-[650px] max-h-[85vh] bg-white overflow-y-auto"
      headerClassName="sticky top-0 bg-white "
      className="bg-white rounded-md px-6 overflow-y-auto max-h-full"
      showClose
    >
      <>
        <div className="flex flex-col gap-3 text-blue text-sm">
          {!dueVisitList.length ? (
            <div className="text-center text-gray-500 py-6">
              No previous dues found.
            </div>
          ) : (
            dueVisitList.map((due) => (
              <div
                key={due.invoiceId}
                className="flex items-center justify-between bg-white rounded border border-light-blue px-4 py-3"
              >
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Invoice ID:</span>
                    <span className="font-mono font-semibold">
                      {due.invoiceId || "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Total Due:</span>
                    <span className="text-red-600 font-semibold">
                      ₹{due.totalDue ?? "0"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {selectedInvoices.includes(due.invoiceId) && (
                    <div className="text-green-600">Marked as paid.</div>
                  )}
                  <div>
                    <CheckBox
                      handleChecked={() => handleChecked(due.invoiceId)}
                      name={due.invoiceId}
                      checked={selectedInvoices.includes(due.invoiceId)}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end gap-4 mt-6 mb-6">
          {dueVisitList.length && (
            <p className="text-xs text-blue flex items-center">
              All selected dues will be marked as paid when you click the
              button.
            </p>
          )}
          <SaveButton
            name="Confirm Settlement"
            onClick={() => handleSubmit(selectedInvoices)}
            disabled={!selectedInvoices.length || isDueSettlementLoading}
            isLoading={isDueSettlementLoading}
          />
        </div>
      </>
    </Modal>
  );
};

export default DueSettlementModal;

import { useEffect } from "react";
import Button from "../../../components/Buttons/Button";
import DeleteIcon from "../../../assets/svg/trash.svg?react";
import Modal from "../../../components/Modal";
import { formatDate } from "../../../utils/dateAndTime";
import { getPaymentLogs } from "../../../slices/paymentSlice";
import { useDispatch, useSelector } from "react-redux";
import ModifyIcon from "../../../components/svgs/ModifyIcon";
import PlusIcon from "../../../components/svgs/PlusIcon";
import ClockIcon from "../../../assets/svg/clock.svg?react";
import ProfileIcon from "../../../assets/svg/profile.svg?react";
import SettlementIcon from "../../../assets/svg/money-recive.svg?react";
import PaymentLogsModalSkeleton from "../loader/PaymentLogsModalSkeleton";

const getChangeIcon = (changeType) => {
  switch (changeType) {
    case "added":
      return <PlusIcon className="w-4 h-4 text-emerald-600" />;
    case "updated":
      return <ModifyIcon className="w-4 h-4 text-blue-600" />;
    case "deleted":
      return <DeleteIcon className="w-4 h-4 text-red-600" />;
    case "settlement":
      return <SettlementIcon className="w-4 h-4" />;
    default:
      return <ClockIcon className="w-4 h-4 text-gray-500" />;
  }
};

const getActionText = (log) => {
  switch (log.changeType) {
    case "added":
      return (
        <span>
          Added {""}
          <span className="font-semibold">{log.newData.name}</span> | {""}
          <span className="text-green-600">₹{log.newData.total}</span>
        </span>
      );
    case "updated":
      return (
        <span>
          Changed {""}
          <span className="font-semibold">{log.field}</span> from {""}
          <span className="text-red-600">{log.oldValue || "-"}</span> {""}
          <span className="font-semibold">{log.field}</span> to {""}
          <span className="text-green-600">{log.newValue || "-"}</span>
        </span>
      );
    case "deleted":
      return (
        <span>
          Removed {""}
          <span className="font-semibold">{log.oldData.name}</span> | {""}
          <span className="text-red-600">₹{log.oldData.total}</span>
        </span>
      );
    case "settlement":
      return (
        <span>
          Marked as {""}
          <span className="font-semibold">settled</span> | {""}
          <span className="text-green-600">₹{log.settlementAmount}</span>
        </span>
      );
    default:
      return "Unknown action";
  }
};

const PaymentLogsModal = ({ paymentId, open = true, onClose }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPaymentLogs({ paymentId }));
  }, [paymentId]);

  const { data, isLoading } = useSelector(
    (state) => state.payment.paymentLogsApi
  );

  const logs = data?.response || [];

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title={
        <span className="text-blue text-xl">Payment History and Changes</span>
      }
      contentClassName="min-w-[650px] max-h-[85vh] bg-white overflow-y-scroll"
      headerClassName="sticky top-0 bg-white "
      className="bg-white rounded-md px-6 overflow-y-auto max-h-full"
      showClose
    >
      {isLoading ? (
        <PaymentLogsModalSkeleton />
      ) : (
        <>
          <div className="flex flex-col ">
            {logs.length === 0 ? (
              <div className="flex items-center justify-center gap-2">
                <ClockIcon className="w-10 h-10 text-gray-300" />
                <p className="text-gray-500">No changes yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log, index) => (
                  <div key={index} className="flex gap-4 group">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                      {getChangeIcon(log.changeType)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 leading-relaxed">
                            {getActionText(log)}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <ProfileIcon className="w-3 h-3" />
                              {log?.userDetails?.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              {formatDate(log.timestamp, "dd-MM-yyyy HH:mm")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6 mb-6">
            <Button onClick={onClose}>Done</Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default PaymentLogsModal;

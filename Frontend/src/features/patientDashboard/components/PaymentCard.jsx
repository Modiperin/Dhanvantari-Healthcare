import PaymentCardSkeleton from "../loader/PaymentCardSkeleton";

const PaymentCard = ({ title, icon, value, extraClass = "", isLoading }) => {
  if (isLoading) {
    return <PaymentCardSkeleton />;
  }

  return (
    <div className={`flex p-4 rounded-lg items-center gap-4 ${extraClass}`}>
      {icon}
      <div className="flex flex-col gap-1">
        <span>{title}</span>
        <span className="font-bold text-lg">{value}</span>
      </div>
    </div>
  );
};

export default PaymentCard;

import CircleIcon from "../../../assets/svg/Circle.svg?react";

const ChatLoading = () => {
  return (
    <div className="flex items-center px-3 py-2 bg-extra-light-blue rounded-tr-lg rounded-b-lg justify-between gap-2 -z-10">
      <CircleIcon className="animate-bounce delay-0 h-4 w-4" />
      <CircleIcon className="animate-bounce delay-150 h-4 w-4" />
      <CircleIcon className="animate-bounce delay-300 h-4 w-4" />
    </div>
  );
};

export default ChatLoading;

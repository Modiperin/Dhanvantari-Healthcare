const Spinner = ({
  size = "w-6 h-6",
  color = "white",
  border = "border-primary",
}) => {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-t-transparent ${size} ${color} ${border}`}
    ></div>
  );
};

export default Spinner;

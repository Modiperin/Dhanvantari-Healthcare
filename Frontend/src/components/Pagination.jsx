import DoublePrev from "../assets/svg/double-prev.svg?react";
import DoubleNext from "../assets/svg/double-next.svg?react";
import Prev from "../assets/svg/prev.svg?react";
import Next from "../assets/svg/next.svg?react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalRecords,
  pageLimit,
  showResultInfo = true,
}) => {
  const handleFirst = () => onPageChange(1);
  const handleLast = () => onPageChange(totalPages);
  const handlePrev = () => currentPage > 1 && onPageChange(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && onPageChange(currentPage + 1);

  const start = (currentPage - 1) * pageLimit + 1 || 0;
  const end = Math.min(currentPage * pageLimit, totalRecords) || 0;

  return (
    <div className="flex items-center justify-between w-full p-2 lg:p-4 text-blue text-sm lg:text-base">
      {showResultInfo && (
        <div>
          Results {start} - {end} of {totalRecords}
        </div>
      )}
      <div className="flex items-center justify-center gap-5">
        <button
          onClick={handleFirst}
          disabled={currentPage === 1}
          className={`pagination-btn ${currentPage === 1 ? "disable" : ""}`}
        >
          <DoublePrev />
        </button>

        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`pagination-btn ${currentPage === 1 ? "disable" : ""}`}
        >
          <Prev />
        </button>

        <span className="pagination-btn w-10 h-10 lg:w-12 lg:h-12 text-white bg-[#158BE2] text-sm lg:text-xl">
          {currentPage}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`pagination-btn ${
            currentPage === totalPages ? "disable" : ""
          }`}
        >
          <Next />
        </button>

        <button
          onClick={handleLast}
          disabled={currentPage === totalPages}
          className={`pagination-btn ${
            currentPage === totalPages ? "disable" : ""
          }`}
        >
          <DoubleNext />
        </button>
      </div>
    </div>
  );
};

export default Pagination;

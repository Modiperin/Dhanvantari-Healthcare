import { useEffect, useState } from "react";
import WeeklyCalendar from "../components/WeeklyCalendar";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoasterList } from "../../../slices/roasterSlice";
import useDebounce from "../../../hooks/useDebounce";
import SearchBox from "../../../components/Searchbox";
import Pagination from "../../../components/Pagination";
import ViewOnly from "../../../components/ViewOnly";
import { usePermission } from "../../../hooks/usePermission";

const Roaster = () => {
  const isViewOnly = !usePermission("roaster", "modify");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const { listResponse, isListLoading } = useSelector((state) => state.roaster);

  const getRoasterList = () => {
    dispatch(fetchRoasterList({ query: debouncedSearch, page: currentPage }));
  };

  useEffect(() => {
    getRoasterList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, debouncedSearch, currentPage]);

  const {
    totalPages = 1,
    totalRecords = 0,
    pageLimit = 1,
  } = listResponse || {};

  return (
    <div className="page text-blue">
      <div className="flex justify-between items-center">
        <h2 className="text-xl lg:text-2xl font-medium">Shift Detail</h2>
        {isViewOnly && <ViewOnly />}
      </div>
      <p className="text-xs lg:text-sm">
        Profiles are sets of permissions dealing with module access and
        operations, setup customizations, and access to various apps. You can
        provide different sets of permissions to various users.
      </p>
      <div className="flex gap-5 items-center justify-between">
        <SearchBox
          search={search}
          setSearch={setSearch}
          placeholder="Search Doctor"
        />
      </div>

      <WeeklyCalendar
        roasterList={listResponse?.list}
        isListLoading={isListLoading}
        getRoasterList={getRoasterList}
        isViewOnly={isViewOnly}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        pageLimit={pageLimit}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default Roaster;

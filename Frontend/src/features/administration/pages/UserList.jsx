import TabSwitcher from "../../../components/TabSwitcher";
import { tabs } from "../helper";
import { useDispatch, useSelector } from "react-redux";
import useNavigateTo from "../../../hooks/useNavigateTo";
import { useEffect, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import { getStaffList } from "../../../slices/staffSlice";
import SearchBox from "../../../components/Searchbox";
import PlusIcon from "../../../components/svgs/PlusIcon";
import { EmptyData } from "../../../components/EmptyData";
import UsersGrid from "../components/UsersGrid";
import { apiResponseType } from "../../../utils/types";
import { multipleErrorToastMessage } from "../../../utils/toastMessage";
import Button from "../../../components/Buttons/Button";
import { ROUTES } from "../../../routes/helper";

const UserList = () => {
  const dispatch = useDispatch();
  const goTo = useNavigateTo();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { getStaffListApi } = useSelector((state) => state.staffManagement);
  const { data, isLoading, status } = getStaffListApi;
  const [isDataThere, setIsDataThere] = useState(false);

  useEffect(() => {
    dispatch(getStaffList({ query: debouncedSearch.trim() }));
  }, [debouncedSearch]);

  useEffect(() => {
    if (status === apiResponseType.failed) {
      multipleErrorToastMessage(getStaffListApi);
    }
  }, [status]);

  useEffect(() => {
    if (
      !isLoading &&
      !data?.response?.list?.length &&
      !debouncedSearch.trim()
    ) {
      setIsDataThere(true);
    } else {
      setIsDataThere(false);
    }
  }, [isLoading, data, debouncedSearch]);

  return (
    <div className="page">
      <TabSwitcher tabs={tabs} selected={3} />
      {isDataThere ? (
        <EmptyData from="user" />
      ) : (
        <>
          <div className="text-blue my-2 flex flex-col items-start gap-1 lg:gap-2 w-full">
            <h2 className="text-xl lg:text-2xl font-medium text-blue">Staff</h2>
            <p className="text-xs lg:text-sm w-full">
              This page will show all the list of staff in the system. You can
              manage staff here, including adding new ones, updating existing
              ones and delete any existing staff.
            </p>
          </div>
          <div className="flex gap-5 items-center justify-between w-full">
            <SearchBox
              search={search}
              setSearch={setSearch}
              placeholder="Search Staff"
            />
            <Button
              variant="light"
              // className="px-7 py-3 flex items-center bg-secondary-light-blue border border-blue/50 rounded-xl cursor-pointer"
              onClick={() => goTo(ROUTES.STAFF_CREATE)}
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Staff Member</span>
            </Button>
          </div>
          <UsersGrid />
        </>
      )}
    </div>
  );
};

export default UserList;

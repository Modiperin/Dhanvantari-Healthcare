import PlusIcon from "../../../assets/svg/plus.svg?react";
import TabSwitcher from "../../../components/TabSwitcher";
import { tabs } from "../helper";
import ProfileGrid from "../components/ProfileAllocationGrid";
import { useDispatch, useSelector } from "react-redux";
import useNavigateTo from "../../../hooks/useNavigateTo";
import { useEffect, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import { getProfileList } from "../../../slices/profileSlice";
import { multipleErrorToastMessage } from "../../../utils/toastMessage";
import SearchBox from "../../../components/Searchbox";
import { apiResponseType } from "../../../utils/types";
import { EmptyData } from "../../../components/EmptyData";
import Button from "../../../components/Buttons/Button";
import { ROUTES } from "../../../routes/helper";

const ProfileAllocation = () => {
  const dispatch = useDispatch();
  const goTo = useNavigateTo();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { getProfileListApi } = useSelector((state) => state.profileManagement);
  const { data, isLoading, status } = getProfileListApi;
  const [isDataThere, setIsDataThere] = useState(false);

  useEffect(() => {
    dispatch(getProfileList({ query: debouncedSearch.trim() }));
  }, [debouncedSearch]);

  useEffect(() => {
    if (status === apiResponseType.failed) {
      multipleErrorToastMessage(getProfileListApi);
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
    <>
      <div className="page">
        <TabSwitcher tabs={tabs} selected={1} />
        {isDataThere ? (
          <EmptyData from="profile" />
        ) : (
          <>
            <div className="text-blue my-2 flex flex-col items-start gap-1 lg:gap-2 w-full">
              <h2 className="text-xl lg:text-2xl font-medium text-blue">
                Profile(s)
              </h2>
              <p className="text-xs lg:text-sm w-full">
                Profiles are sets of permissions dealing with module access and
                operations, setup customizations, and access to various apps.
                You can provide different sets of permissions to various users.
              </p>
            </div>
            <div className="flex gap-5 items-center justify-between w-full">
              <SearchBox
                search={search}
                setSearch={setSearch}
                placeholder="Search Profiles"
              />
              <Button
                variant="light"
                onClick={() => goTo(ROUTES.PROFILE_CREATE)}
              >
                <PlusIcon />
                Create New Profile
              </Button>
            </div>
            <ProfileGrid />
          </>
        )}
      </div>
    </>
  );
};

export default ProfileAllocation;

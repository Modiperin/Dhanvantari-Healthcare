import React, { useEffect, useState } from "react";
import { tabs } from "../helper";
import TabSwitcher from "../../../components/TabSwitcher";
import { useDispatch, useSelector } from "react-redux";
import PlusIcon from "../../../components/svgs/PlusIcon";
import SearchBox from "../../../components/Searchbox";
import useDebounce from "../../../hooks/useDebounce";
import { DepartmentGrid } from "../components/DepartmentGrid";
import { getDepartmentList } from "../../../slices/departmentSlice";
import useNavigateTo from "../../../hooks/useNavigateTo";
import { EmptyData } from "../../../components/EmptyData";
import { multipleErrorToastMessage } from "../../../utils/toastMessage";
import { apiResponseType } from "../../../utils/types";
import Button from "../../../components/Buttons/Button";
import { ROUTES } from "../../../routes/helper";

const Departments = () => {
  const dispatch = useDispatch();
  const goTo = useNavigateTo();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { getDepartmentListApi } = useSelector(
    (state) => state.departmentManagement
  );
  const { data, isLoading, status } = getDepartmentListApi;
  const [isDataThere, setIsDataThere] = useState(false);

  useEffect(() => {
    dispatch(getDepartmentList({ query: debouncedSearch.trim() }));
  }, [debouncedSearch]);

  useEffect(() => {
    if (status === apiResponseType.failed) {
      multipleErrorToastMessage(getDepartmentListApi);
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
        <TabSwitcher tabs={tabs} selected={2} />
        {isDataThere ? (
          <EmptyData from="department" />
        ) : (
          <>
            <div className="text-blue my-2 flex flex-col items-start gap-1 lg:gap-2 w-full">
              <h2 className="text-xl lg:text-2xl font-medium text-blue">
                Departments
              </h2>
              <p className="text-xs lg:text-sm w-full">
                This page will show all the list of departments in the system.
                You can manage departments here, including adding new ones,
                updating existing ones and delete any existing departments.
              </p>
            </div>
            <div className="flex gap-5 items-center justify-between w-full">
              <SearchBox
                search={search}
                setSearch={setSearch}
                placeholder="Search Departments"
              />

              <Button
                variant="light"
                onClick={() => goTo(ROUTES.DEPARTMENT_CREATE)}
              >
                <PlusIcon />
                Add Department
              </Button>
            </div>
            <DepartmentGrid data={data} isLoading={isLoading} status={status} />
          </>
        )}
      </div>
    </>
  );
};

export default Departments;

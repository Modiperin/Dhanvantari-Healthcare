import { apiResponseType, HeaderType } from "../../../utils/types";
import TableGrid from "../../../components/table/TableGrid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDateToReadable } from "../../../utils/common";
import { getProfileList } from "../../../slices/profileSlice";
import useNavigateTo from "../../../hooks/useNavigateTo";
import IconButton from "../../../components/IconButton";
import CircleCheck from "../../../assets/svg/tick-circle.svg?react";
import { ROUTES } from "../../../routes/helper";
import Button from "../../../components/Buttons/Button";

const ProfileGrid = () => {
  const { getProfileListApi } = useSelector((state) => state.profileManagement);
  const { isLoading, data, status } = getProfileListApi;
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const goTo = useNavigateTo();

  const pageLimit = data?.response?.pageLimit;
  const totalRecords = data?.response?.totalRecords;
  const totalPages = data?.response?.totalPages;

  const profiles =
    data?.response?.list?.map((profile) => {
      const { _id, name, access, desc, createdAt, counts } = profile;
      return {
        id: _id,
        name,
        access,
        counts: counts || 0,
        createdAt: formatDateToReadable(createdAt, false, true),
        desc: desc ? desc : "No Description Found",
      };
    }) || [];

  const commonProps = {
    className: "h-4 lg:h-6 w-4 lg:w-6 cursor-pointer",
  };

  const headerData = [
    {
      name: "Profile Name",
      value: "name",
      _class: "col-span-3",
    },
    {
      name: "Profile Description",
      value: "desc",
      _class: "col-span-3",
      type: HeaderType.longDesc,
    },
    {
      name: "Profile Members",
      value: "counts",
      _class: "col-span-2",
    },
    {
      name: "Created At",
      value: "createdAt",
      _class: "col-span-2",
    },
    {
      name: "Access Allocations",
      value: "access",
      _class: "col-span-2",
      type: HeaderType.dynamicAction,
      actions: [
        {
          label: "Access",
          icon: (
            <IconButton
              name="Access Allocation"
              className="lg:gap-2 text-[9px] lg:text-xs px-1.5 lg:px-3"
            >
              <CircleCheck {...commonProps} />
            </IconButton>
          ),
          onClick: (row) => goTo(`${ROUTES.PROFILE_UPDATE}/${row.id}`),
        },
      ],
    },
  ];

  useEffect(() => {
    dispatch(getProfileList({ page: currentPage }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (status === apiResponseType.success) {
      setCurrentPage(data?.response?.currentPage);
    }
  }, [status]);

  return (
    <>
      <TableGrid
        data={profiles}
        columns={headerData}
        isLoading={isLoading}
        allowPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageLimit={pageLimit}
        totalRecords={totalRecords}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
};

export default ProfileGrid;

import { useEffect, useState } from "react";
import { apiResponseType, HeaderType } from "../../../utils/types";
import useNavigateTo from "../../../hooks/useNavigateTo";
import TableGrid from "../../../components/table/TableGrid";
import { ConfirmationModal } from "../../../components/ConfirmationModal";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePricing,
  getPricingList,
  resetApiState,
} from "../../../slices/pricingSlice";
import { formatDateToReadable } from "../../../utils/common";
import EditIcon from "../../../assets/svg/edit.svg?react";
import TrashIcon from "../../../assets/svg/trash.svg?react";
import { ROUTES } from "../../../routes/helper";
import toast from "react-hot-toast";

export const PricingGrid = ({ getPriceLoading, getPriceData, status }) => {
  const goTo = useNavigateTo();
  const dispatch = useDispatch();
  const { deletePricingApi } = useSelector(
    (state) => state.pricingManagement || {}
  );
  const { status: deletePricingStatus } = deletePricingApi;
  // console.log("getPriceData", getPriceData);
  const [pricingToDelete, setPricingToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageLimit = getPriceData?.response?.pageLimit;
  const totalRecords = getPriceData?.response?.totalRecords;
  const totalPages = getPriceData?.response?.totalPages;

  const pricingData =
    getPriceData?.response?.list.map((ele) => ({
      name: ele.name,
      id: ele._id,
      cost: ele.cost,
      status: ele.status,
      createdAt: formatDateToReadable(ele.createdAt, false, true),
      updatedAt: formatDateToReadable(ele.createdAt, false, true),
      currencyType: ele.currencyType,
    })) || [];

  const handleEdit = (id) => {
    goTo(`${ROUTES.PRICING_UPDATE}/${id}`);
  };

  const handleConfirmDelete = () => {
    if (pricingToDelete?.id) {
      dispatch(deletePricing(pricingToDelete.id));
    }
    setPricingToDelete(null);
  };

  const commonProps = {
    className: "h-4 lg:h-6 w-4 lg:w-6 cursor-pointer",
  };

  const headerData = [
    {
      name: "Service/Payment Name",
      value: "name",
      _class: "col-span-3",
    },
    {
      name: "Price(₹)",
      value: "cost",
      _class: "col-span-1",
      type: HeaderType.currencyType,
    },
    {
      name: "Created At",
      value: "createdAt",
      _class: "col-span-2",
    },
    {
      name: "Updated At",
      value: "updatedAt",
      _class: "col-span-2",
    },
    {
      name: "Status",
      value: "status",
      _class: "col-span-2",
      type: HeaderType.statusBudge,
    },
    {
      name: "Actions",
      value: "actions",
      _class: "col-span-2",
      type: HeaderType.dynamicAction,
      actions: [
        {
          label: "Edit",
          icon: <EditIcon {...commonProps} />,
          onClick: (row) => handleEdit(row.id),
        },
        {
          label: "Delete",
          icon: <TrashIcon {...commonProps} />,
          onClick: (row) => setPricingToDelete(row),
        },
      ],
    },
  ];

  useEffect(() => {
    dispatch(getPricingList({ page: currentPage }));
  }, [currentPage]);

  useEffect(() => {
    if (status === apiResponseType.success) {
      setCurrentPage(getPriceData?.response?.currentPage);
    }
  }, [status]);

  useEffect(() => {
    if (deletePricingStatus === apiResponseType.success) {
      toast.success("Service/Payment deleted successfully");
      dispatch(resetApiState("deletePricingApi"));
      dispatch(getPricingList());
      setCurrentPage(getPriceData?.response?.currentPage);
    }

    if (deletePricingStatus === apiResponseType.failed) {
      toast.error("Failed to delete pricing");
      dispatch(resetApiState("deletePricingApi"));
    }
  }, [deletePricingStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetApiState("deletePricingApi"));
    };
  }, []);
  return (
    <>
      <div className="overflow-x-auto border border-light-blue rounded-lg">
        <TableGrid
          data={pricingData}
          columns={headerData}
          isLoading={getPriceLoading}
          allowPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageLimit={pageLimit}
          totalRecords={totalRecords}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
      {pricingToDelete && (
        <ConfirmationModal
          onClose={() => setPricingToDelete(null)}
          onConfirm={handleConfirmDelete}
          title={<span className="text-blue text-xl">Confirm Delete</span>}
          primaryButtonName={"Delete"}
          content={`Are you sure you want to delete the Service/Payment "${pricingToDelete.name}"? This action cannot be undone.`}
        />
      )}
    </>
  );
};

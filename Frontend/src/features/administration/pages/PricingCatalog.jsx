import React, { useEffect, useState } from "react";
import TabSwitcher from "../../../components/TabSwitcher";
import { tabs } from "../helper";
import { PricingGrid } from "../components/PricingGrid";
import { useDispatch, useSelector } from "react-redux";
import { getPricingList } from "../../../slices/pricingSlice";
import { EmptyData } from "../../../components/EmptyData";
import SearchBox from "../../../components/Searchbox";
import PlusIcon from "../../../components/svgs/PlusIcon";
import useNavigateTo from "../../../hooks/useNavigateTo";
import useDebounce from "../../../hooks/useDebounce";
import { apiResponseType } from "../../../utils/types";
import { multipleErrorToastMessage } from "../../../utils/toastMessage";
import { ROUTES } from "../../../routes/helper";
import Button from "../../../components/Buttons/Button";

const PricingCatalog = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const goTo = useNavigateTo();
  const debouncedSearch = useDebounce(search, 500);
  const [isDataThere, setIsDataThere] = useState(false);
  const { getPricingListApi } = useSelector(
    (state) => state.pricingManagement || {}
  );
  const {
    data,
    isLoading: getPriceLoading,
    status: getPriceStatus,
  } = getPricingListApi;
  useEffect(() => {
    dispatch(getPricingList({ query: debouncedSearch.trim() }));
  }, [debouncedSearch]);

  useEffect(() => {
    if (getPriceStatus === apiResponseType.failed) {
      multipleErrorToastMessage(getPricingListApi);
    }
  }, [getPriceStatus]);

  useEffect(() => {
    if (
      !getPriceLoading &&
      !data?.response?.list?.length &&
      !debouncedSearch.trim()
    ) {
      setIsDataThere(true);
    } else {
      setIsDataThere(false);
    }
  }, [getPriceLoading, data, debouncedSearch]);

  return (
    <>
      <div className="page">
        <TabSwitcher tabs={tabs} selected={4} />
        {isDataThere ? (
          <EmptyData from="pricing" />
        ) : (
          <>
            <div className="text-blue my-2 flex flex-col items-start gap-1 lg:gap-2 w-full">
              <h2 className="text-xl lg:text-2xl font-medium text-blue">
                Pricing Catalog(s)
              </h2>
              <p className="text-xs lg:text-sm w-full">
                The pricing catalog is a comprehensive list of all the services
                and procedures offered by the healthcare facility, along with
                their associated costs. It serves as a reference for patients,
                insurance providers, and healthcare professionals to understand
                the financial aspects of the services provided.
              </p>
            </div>
            <div className="flex gap-5 items-center justify-between w-full">
              <SearchBox search={search} setSearch={setSearch} />
              <Button
                variant="light"
                onClick={() => goTo(ROUTES.PRICING_CREATE)}
              >
                <PlusIcon />
                Add Service/Payment
              </Button>
            </div>
            <PricingGrid
              getPriceData={data}
              getPriceLoading={getPriceLoading}
              status={getPriceStatus}
            />
          </>
        )}
      </div>
    </>
  );
};

export default PricingCatalog;

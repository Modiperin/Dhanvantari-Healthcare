import React, { useEffect } from "react";
import TabSwitcher from "../../../components/TabSwitcher";
import { activeTypeStatus, tabs } from "../helper";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  defaultValueForPricingForm,
  pricingSchema,
} from "../validations/pricingSchema";
import CommonInput from "../../../components/CommonInput";
import { PricingGrid } from "../components/PricingGrid";
import { useDispatch, useSelector } from "react-redux";
import { apiResponseType } from "../../../utils/types";
import {
  createPricing,
  getPricingById,
  getPricingList,
  updatePricing,
} from "../../../slices/pricingSlice";
import { toastMessage } from "../../../utils/toastMessage";
import useNavigateTo from "../../../hooks/useNavigateTo";
import AntSearchableSelector from "../../../components/AntDesign/AntSearchableSelector";
import SaveButton from "../../../components/Buttons/SaveButton";
import { ROUTES } from "../../../routes/helper";
import CancelButton from "../../../components/Buttons/CancelButton";
import { resetApiState } from "../../../slices/pricingSlice";

const PricingForms = () => {
  const goTo = useNavigateTo();
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    getPricingByIdApi,
    createPricingApi,
    updatePricingApi,
    getPricingListApi,
  } = useSelector((state) => state.pricingManagement || {});

  const { data: pricingDataResponse, status: pricingStatus } =
    getPricingByIdApi;
  const pricingData = pricingDataResponse?.response;
  const { data, status, isLoading } = getPricingListApi;

  const { isLoading: createPriceLoading, status: createPricingStatus } =
    createPricingApi;

  const { isLoading: updatePriceLoading, status: updatePricingStatus } =
    updatePricingApi;

  const form = useForm({
    defaultValues: defaultValueForPricingForm,
    resolver: zodResolver(pricingSchema),
  });

  const {
    register,
    formState,
    setValue,
    handleSubmit,
    setError,
    reset,
    control,
    clearErrors,
  } = form;

  const { errors } = formState;
  const onSubmit = async (data) => {
    if (id) {
      dispatch(
        updatePricing({
          id,
          data,
        })
      );
    } else {
      dispatch(createPricing(data));
    }
  };

  useEffect(() => {
    if (id) {
      if (updatePricingStatus === apiResponseType.success) {
        toastMessage(updatePricingApi, setError);
        dispatch(getPricingList({}));
        dispatch(resetApiState("updatePricingApi"));
        goTo(ROUTES.PRICINGCATALOG);
      }
    } else {
      if (createPricingStatus === apiResponseType.success) {
        dispatch(getPricingList({}));
        toastMessage(createPricingApi, setError);
        dispatch(resetApiState("createPricingApi"));
      }
    }
  }, [createPricingStatus, updatePricingStatus]);

  useEffect(() => {
    if (id) {
      reset(defaultValueForPricingForm);
      clearErrors();
      dispatch(getPricingById(id));
    } else {
      dispatch(getPricingList({}));
    }
  }, [id]);

  useEffect(() => {
    if (pricingStatus === apiResponseType.success && id) {
      setValue("name", pricingData?.name);
      setValue("cost", pricingData?.cost);
      setValue("status", pricingData?.status);
    }
    if (pricingStatus === apiResponseType.failed) {
      toastMessage(getPricingByIdApi, setError);
    }
  }, [pricingStatus, id]);

  useEffect(() => {
    return () => {
      dispatch(resetApiState("createPricingApi"));
      dispatch(resetApiState("updatePricingApi"));
    };
  }, []);

  return (
    <>
      <div className="page">
        <TabSwitcher tabs={tabs} selected={4} />
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="text-blue my-3 flex flex-col items-start gap-3 w-full"
        >
          <div className="flex w-full justify-between">
            <h2 className="text-2xl font-medium text-blue">
              {id
                ? "Update Existing Service/Payment"
                : "Create New Service/Payment"}
            </h2>
            <CancelButton />
          </div>
          <div className="grid grid-cols-4 gap-3 w-full">
            {/* Service Name */}
            <div className="col-span-2">
              <CommonInput
                labelName="Service/Payment Name*"
                id="name"
                name="name"
                register={register}
                errors={errors}
              />
            </div>
            {/* Price */}
            <div className="col-span-1">
              <CommonInput
                labelName="Price*"
                id="cost"
                name="cost"
                register={register}
                errors={errors}
                type="number"
              />
            </div>

            {/* active Status */}
            <div className="col-span-1">
              <AntSearchableSelector
                id="status"
                name="status"
                labelName="Status"
                options={activeTypeStatus}
                control={control}
                errors={errors}
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-end gap-3 mt-5">
            <SaveButton
              type="submit"
              name={id ? "Update" : "Create"}
              isLoading={createPriceLoading || updatePriceLoading}
            />
          </div>
        </form>
        {!id && (
          <PricingGrid
            getPriceData={data}
            getPriceLoading={isLoading}
            status={status}
          />
        )}
      </div>
    </>
  );
};

export default PricingForms;

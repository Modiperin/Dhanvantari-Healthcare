import { useEffect, useState } from "react";
import TabSwitcher from "../../../components/TabSwitcher";
import { defaultValueForPhramacy, paymentInvoiceType, tabs } from "../helper";
import SearchBoxForPatient from "../../patient-register/components/SearchBoxForPatient";
import { FormProvider, useForm } from "react-hook-form";
import PharmacyFields from "../components/PharmacyFields";
import CancelButton from "../../../components/Buttons/CancelButton";
import SaveButton from "../../../components/Buttons/SaveButton";
import {
  createPharmacy,
  resetApiState,
  updatePharmacy,
  viewPharmacy,
} from "../../../slices/pharmacySlice";
import useApiResponseHandler from "../../../hooks/useApiResponseHandler";
import { useDispatch, useSelector } from "react-redux";
import { discountType } from "../../payment/helper";
import { useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const CreateUpdatePharmacy = () => {
  const [searchParams] = useSearchParams();
  const visitId = searchParams.get("visitId") || "";
  const { pharmacyId } = useParams();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isBothPaymentEqual, setIsBothPaymentsEqual] = useState(false);
  const { createPharmacyApi, viewPharmacyApi, updatePharmacyApi } = useSelector(
    (state) => state.pharmacy
  );
  const dispatch = useDispatch();
  const methods = useForm({
    defaultValues: defaultValueForPhramacy,
  });
  // eslint-disable-next-line no-unused-vars
  const { handleSubmit, watch, setError, reset, formState } = methods;
  const totalPayment = (watch("pharmacies") || []).reduce(
    (acc, p) =>
      p.status !== paymentInvoiceType.completed ? acc + p.total : acc,
    0
  );

  const onSubmit = (data) => {
    if (!data.patientId) {
      toast.error("Select patient to create pharmacy");
    } else {
      const pharmacies = data.pharmacies
        .filter((s) => s.continue)
        .map((s) => {
          return {
            ...s,
            discount: s?.discount
              ? s.discount.unit === discountType.i
                ? s.discount.value
                : (s.amount * s.discount.value) / 100
              : 0,
            status: s.continue
              ? paymentInvoiceType.completed
              : paymentInvoiceType.pending,
          };
        });
      const pureData = {
        patientId: data.patientId,
        pharmacies,
        paymodes: (viewPharmacyApi?.data?.response?.paymodes || []).concat(
          data?.payMode
        ),
        ...(visitId && { visitId }),
      };

      // console.log({ pureData });
      if (pharmacyId) {
        dispatch(updatePharmacy({ id: pharmacyId, data: pureData }));
      } else {
        dispatch(createPharmacy(pureData));
      }
    }
  };

  const viewPharmacyById = () => {
    if (pharmacyId) {
      dispatch(
        viewPharmacy({
          pharmacyId,
        })
      );
    }
  };

  useApiResponseHandler({
    status: createPharmacyApi.status,
    data: createPharmacyApi.data,
    error: createPharmacyApi.error,
    resetForm: () => reset(defaultValueForPhramacy),
    resetReduxStatus: () => dispatch(resetApiState("createPharmacyApi")),
    setFormError: setError,
  });

  useApiResponseHandler({
    status: updatePharmacyApi.status,
    data: updatePharmacyApi.data,
    error: updatePharmacyApi.error,
    resetForm: () => reset(defaultValueForPhramacy),
    setFormError: setError,
    sideAction: viewPharmacyById,
  });

  useEffect(() => {
    viewPharmacyById();
  }, [pharmacyId]);

  useEffect(() => {
    return () => {
      reset(defaultValueForPhramacy);
      dispatch(resetApiState("createPharmacyApi"));
      dispatch(resetApiState("viewPharmacyApi"));
      dispatch(resetApiState("updatePharmacyApi"));
    };
  }, []);

  return (
    <div className="page w-full">
      <TabSwitcher tabs={tabs} selected={1} />
      {!(visitId || pharmacyId) && (
        <SearchBoxForPatient
          setSelectPatientDetails={setSelectedPatient}
          showDataOnDropDown
        />
      )}

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <PharmacyFields
            selectedPatient={selectedPatient}
            methods={methods}
            setIsBothPaymentsEqual={setIsBothPaymentsEqual}
            pharmaciesDetails={viewPharmacyApi.data?.response}
            pharmacyDataLoading={viewPharmacyApi.isLoading}
            visitId={visitId}
          />
          <div className="flex items-center w-full gap-2 justify-end mt-4">
            <CancelButton />
            <SaveButton
              type="submit"
              disabled={!isBothPaymentEqual || totalPayment === 0}
              isLoading={
                createPharmacyApi?.isLoading || updatePharmacyApi?.isLoading
              }
              name={"Create Receipt"}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateUpdatePharmacy;

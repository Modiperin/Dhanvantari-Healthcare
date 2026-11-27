import { useEffect, useState } from "react";
import TabSwitcher from "../../../components/TabSwitcher";
import { defaultValueForPayment, discountType, tabs } from "../helper";
import SearchBoxForPatient from "../../patient-register/components/SearchBoxForPatient";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  createPayment,
  resetApiState,
  updatePayment,
  viewPayment,
} from "../../../slices/paymentSlice";
import useApiResponseHandler from "../../../hooks/useApiResponseHandler";
import toast from "react-hot-toast";
import PaymentsFields from "../components/PaymentsFields";
import CancelButton from "../../../components/Buttons/CancelButton";
import SaveButton from "../../../components/Buttons/SaveButton";
import { useParams, useSearchParams } from "react-router-dom";
import ClockIcon from "../../../assets/svg/clock.svg?react";
import PaymentLogsModal from "../components/PaymentLogsModal";
import { paymentInvoiceType } from "../../pharmacy/helper";

const CreateUpdatePayment = () => {
  const [searchParams] = useSearchParams();
  const visitId = searchParams.get("visitId") || "";
  const patientId = searchParams.get("patientId") || "";
  const { paymentId } = useParams();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [paymentLogPopupOpen, setPaymentLogPopupOpen] = useState(false);
  const dispatch = useDispatch();
  const methods = useForm({
    defaultValues: defaultValueForPayment,
  });
  const { setError, reset, handleSubmit, resetField, watch } = methods;
  const { createPaymentApi, viewPaymentApi, updatePaymentApi } = useSelector(
    (state) => state.payment
  );
  const [isBothPaymentEqual, setIsBothPaymentsEqual] = useState(false);
  const totalPayment = (watch("payments") || []).reduce(
    (acc, p) =>
      p.status !== paymentInvoiceType.completed ? acc + p.total : acc,
    0
  );

  const onSubmit = (data) => {
    if (!data.patientId) {
      toast.error("Select patient to create payment receipt");
    } else {
      const payments = data.payments.map((s) => {
        return {
          ...s,
          discount: s?.discount
            ? s.discount.unit === discountType.i
              ? s.discount.value
              : (s.amount * s.discount.value) / 100
            : 0,
          status: paymentInvoiceType.completed,
        };
      });
      const pureData = {
        patientId: data.patientId,
        payments,
        paymodes: (viewPaymentApi?.data?.response?.paymodes || []).concat(
          data?.payMode
        ),
        ...(visitId && { visitId }),
      };
      if (paymentId) {
        dispatch(updatePayment({ id: paymentId, data: pureData }));
      } else {
        dispatch(createPayment(pureData));
      }
    }
  };

  const viewPaymentById = () => {
    if (paymentId) {
      dispatch(
        viewPayment({
          paymentId,
        })
      );
    }
  };

  const handleClosePopup = () => {
    dispatch(resetApiState("paymentLogsApi"));
    setPaymentLogPopupOpen(false);
  };

  useApiResponseHandler({
    status: createPaymentApi.status,
    data: createPaymentApi.data,
    error: createPaymentApi.error,
    resetForm: () => reset(defaultValueForPayment),
    resetReduxStatus: () => dispatch(resetApiState("createPaymentApi")),
    setFormError: setError,
  });

  useApiResponseHandler({
    status: updatePaymentApi.status,
    data: updatePaymentApi.data,
    error: updatePaymentApi.error,
    resetForm: () => reset(defaultValueForPayment),
    setFormError: setError,
    sideAction: viewPaymentById,
  });

  useEffect(() => {
    viewPaymentById();
  }, [paymentId]);

  useEffect(() => {
    return () => {
      reset(defaultValueForPayment);
      resetField("payments");
      dispatch(resetApiState("createPaymentApi"));
      dispatch(resetApiState("viewPaymentApi"));
      dispatch(resetApiState("updatePaymentApi"));
    };
  }, []);

  return (
    <div className="page">
      <TabSwitcher tabs={tabs} selected={1} />
      {!(visitId || paymentId) && (
        <SearchBoxForPatient
          setSelectPatientDetails={setSelectedPatient}
          showDataOnDropDown
        />
      )}

      {paymentId ? (
        <div className="flex items-center justify-end">
          <button
            onClick={() => setPaymentLogPopupOpen(true)}
            className="flex items-center gap-1 text-xs text-blue border border-blue-200 px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <ClockIcon className="w-3 h-3" />
            Payment History
          </button>
        </div>
      ) : null}

      <>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-4"
          >
            <PaymentsFields
              selectedPatient={selectedPatient}
              methods={methods}
              setIsBothPaymentsEqual={setIsBothPaymentsEqual}
              paymentsDetails={viewPaymentApi.data?.response}
              paymentDataLoading={viewPaymentApi.isLoading}
              visitId={visitId}
              patientId={patientId}
              afterDueSettlement={viewPaymentById}
            />
            <div className="flex items-center w-full gap-2 justify-end mt-4">
              <CancelButton />
              <SaveButton
                type="submit"
                disabled={!isBothPaymentEqual || totalPayment === 0}
                isLoading={
                  createPaymentApi?.isLoading || updatePaymentApi?.isLoading
                }
                name={"Create Receipt"}
              />
            </div>
          </form>
        </FormProvider>
      </>

      {paymentLogPopupOpen && paymentId && (
        <PaymentLogsModal paymentId={paymentId} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default CreateUpdatePayment;

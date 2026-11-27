import React, { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import PaymentsFields from "../../payment/components/PaymentsFields";
import { FormProvider, useForm } from "react-hook-form";
import CancelButton from "../../../components/Buttons/CancelButton";
import SaveButton from "../../../components/Buttons/SaveButton";
import { useDispatch, useSelector } from "react-redux";
import { discountType } from "../../payment/helper";
import {
  createPayment,
  resetApiState,
  updatePayment,
} from "../../../slices/paymentSlice";
import { apiResponseType } from "../../../utils/types";
import toast from "react-hot-toast";
import useApiResponseHandler from "../../../hooks/useApiResponseHandler";

const BillPatientModal = ({
  open = false,
  onClose,
  patientData = {},
  visitId,
}) => {
  const methods = useForm({
    defaultValues: {
      patientId: patientData?._id,
      serialId: patientData?.serialId,
      patientName: patientData?.name,
      phoneNo: patientData?.phoneNo,
      payments: [],
      payMode: [
        {
          type: "cash",
          amount: 0,
        },
      ],
    },
  });
  const { setError, reset, handleSubmit, resetField } = methods;
  const { createPaymentApi, viewPaymentApi, updatePaymentApi } = useSelector(
    (state) => state.payment
  );
  // console.log(viewPaymentApi)
  const [isBothPaymentEqual, setIsBothPaymentsEqual] = useState(false);
  const dispatch = useDispatch();
  const onSubmit = (data) => {
    // console.log(data);
    if (!isBothPaymentEqual) {
      toast.error("Please add amount equal to the grandtotal");
    } else {
      let isPaymodeAvailable = data?.payMode?.filter(
        (mode) => mode?.amount > 0
      );
      data = {
        ...data,
        payMode: data?.payMode?.filter((mode) => mode?.amount > 0),
        payments: data.payments.map((s) => {
          return {
            ...s,
            discount:
              s.discount.unit === discountType.i
                ? s.discount.value
                : (s.amount * s.discount.value) / 100,
            status:
              isPaymodeAvailable.length > 0 || s.status === "completed"
                ? "completed"
                : "pending",
            payId: s.payId,
          };
        }),
      };
      const pureData = {
        patientId: data?.patientId,
        payments: data?.payments,
        paymodes: (viewPaymentApi?.data?.response?.paymodes || []).concat(
          data?.payMode
        ),
        from: "doctor-opd",
        visitId,
      };
      // console.log(pureData);
      if (viewPaymentApi?.status === apiResponseType.failed) {
        dispatch(createPayment(pureData));
      } else if (
        viewPaymentApi?.status === apiResponseType.success &&
        viewPaymentApi?.data?.response?._id
      ) {
        //update
        dispatch(
          updatePayment({
            id: viewPaymentApi?.data?.response?._id,
            data: pureData,
          })
        );
      } else {
        toast.error("Something Went wrong");
      }
    }
  };

  const handleClose = () => {
    onClose();
    resetField("payments");
    resetField("payMode");
  };

  useEffect(() => {
    return () => {
      reset();
      resetField("payments");
      resetField("payMode");
      dispatch(resetApiState("createPaymentApi"));
      // dispatch(resetApiState("viewPaymentApi"));
      dispatch(resetApiState("updatePaymentApi"));
      dispatch(resetApiState("getDueDetailsApi"));
    };
  }, []);

  useApiResponseHandler({
    status: createPaymentApi.status,
    data: createPaymentApi.data,
    error: createPaymentApi.error,
    resetForm: reset,
    resetReduxStatus: () => dispatch(resetApiState("createPaymentApi")),
    setFormError: setError,
    sideAction: () => onClose(),
  });

  useApiResponseHandler({
    status: updatePaymentApi.status,
    data: updatePaymentApi.data,
    error: updatePaymentApi.error,
    resetForm: reset,
    setFormError: setError,
    sideAction: () => onClose(),
  });

  return (
    <>
      <Modal
        open={open}
        onOpenChange={handleClose}
        title={"Patient Billing"}
        contentClassName="min-w-[90%] lg:min-w-[1000px] xl:min-w-[1100px] max-h-[85vh] min-h-[20vh] overflow-y-auto bg-white pb-4"
      >
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-4"
          >
            {/* {console.log(viewPaymentApi)} */}
            <PaymentsFields
              selectedPatient={patientData}
              methods={methods}
              setIsBothPaymentsEqual={setIsBothPaymentsEqual}
              paymentsDetails={viewPaymentApi?.data?.response}
              paymentDataLoading={viewPaymentApi?.isLoading}
            />
            <div className="flex items-center w-full gap-2 justify-end mt-2">
              <CancelButton onClick={handleClose} />
              <SaveButton
                type="submit"
                isLoading={
                  createPaymentApi.isLoading || updatePaymentApi?.isLoading
                }
                name={"Create Receipt"}
              />
            </div>
          </form>
        </FormProvider>
      </Modal>
    </>
  );
};

export default BillPatientModal;

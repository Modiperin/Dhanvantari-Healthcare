import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  alertType,
  discountOptions,
  discountType,
  paymentOptions,
  taxOptions,
  totalAmountCalculation,
} from "../helper";
import { useKeyboardNavigation } from "../../../hooks/useKeyboardNavigation";
import { getPricingList } from "../../../slices/pricingSlice";
import useDebounce from "../../../hooks/useDebounce";
import CommonInput from "../../../components/CommonInput";
import TableHeader from "../../../components/table/TableHeader";
import TooltipWrapper from "../../../components/ReactTooltip";
import SearchBox from "../../../components/Searchbox";
import AntSearchableSelector from "../../../components/AntDesign/AntSearchableSelector";
import PlusIcon from "../../../assets/svg/plus.svg?react";
import TrashIcon from "../../../assets/svg/trash.svg?react";
import ControlledInputWithDropdown from "../../../components/ControlledInputWithDropdown";
import Skeleton from "../../../components/Skeleton";
import { cn } from "../../../lib/utils";
import Alert from "../../../components/Alert";
import PaymentSkeleton from "./PaymentSkeleton";
import DisabledWrapper from "../../../components/DisabledWrapper";
import TickCircle from "../../../components/svgs/TickCircle";
import { getDuesDetails, resetApiState } from "../../../slices/paymentSlice";
import { resetApiState as resetApiStateFromPatient } from "../../../slices/patientSlice";
import { paymentInvoiceType } from "../../pharmacy/helper";
import DueSettlementModal from "./DueSettlementModal";
import { callAPI } from "../../../services/callAPI";
import {
  errorToastMessage,
  successToastMessage,
} from "../../../utils/toastMessage";
import CheckBox from "../../../components/Checkbox";
import { viewPatientById } from "../../../slices/patientSlice";

const headerData = [
  {
    name: "Payment Name",
    value: "paymentName",
    _class: "col-span-1 lg:col-span-2",
  },
  {
    name: "Unit",
    value: "unit",
    _class: "col-span-1",
  },
  {
    name: "Amount (₹)",
    value: "amount",
    _class: "col-span-2",
  },
  {
    name: "Discount",
    value: "discount",
    _class: "col-span-2 lg:col-span-1",
  },
  {
    name: "Tax (%)",
    value: "tax",
    _class: "col-span-1",
  },
  {
    name: "Due Amount (₹)",
    value: "dueAmount",
    _class: "col-span-2",
  },
  {
    name: "Total Amount (₹)",
    value: "total",
    _class: "col-span-2",
  },
  {
    name: "",
    value: "Remove",
    // _class: "col-span-2",
  },
];

const PaymentsFields = ({
  selectedPatient,
  methods,
  setIsBothPaymentsEqual,
  paymentsDetails = null,
  paymentDataLoading = false,
  patientId,
  afterDueSettlement = () => {}, // used for refreshing payment details after due settlement
}) => {
  const [duePopupOpen, setDuePopupOpen] = useState(false);
  const [isDueSettlementLoading, setIsDueSettlementLoading] = useState(false);
  const { getPricingListApi } = useSelector((state) => state.pricingManagement);
  const { getDuesDetailsApi } = useSelector((state) => state.payment);
  const { data: getPriceData, isLoading: getPriceLoading } = getPricingListApi;
  const { viewPatientByIdApi } = useSelector(
    (state) => state.patientManagement
  );

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500, true);
  const [prevPatientId, setPrevPatientId] = useState(null);
  const dispatch = useDispatch();
  const { register, control, formState, getValues, setValue, watch } = methods;
  const PaymentsMethods = useFieldArray({
    control,
    name: "payments",
  });
  const payModeMethods = useFieldArray({
    control,
    name: "payMode",
  });
  const { fields, append, remove, update } = PaymentsMethods;
  const {
    fields: payModeFields,
    append: payModeAppend,
    remove: payModeRemove,
  } = payModeMethods;
  const { errors } = formState;

  const dueVisit = getDuesDetailsApi?.data?.response[0] || {};

  const payModeOptions = [
    ...new Set((watch("payMode") || [])?.map((p) => p.type).filter(Boolean)),
  ];

  const remainingPayModeOptions = paymentOptions.filter(
    (p) => !payModeOptions.includes(p.value)
  );

  const payments = useMemo(() => {
    const oldPayments = getPriceData?.response?.list || [];

    // Only add the "add new" option if we have a search term and results
    if (debouncedSearch.trim()) {
      return [
        ...oldPayments,
        {
          name: debouncedSearch,
          new: true,
          _id: `new-${debouncedSearch}`,
        },
      ];
    }
    return oldPayments;
  }, [getPriceData, debouncedSearch]);

  const totalPaymodeAmount = (getValues("payMode") || []).reduce(
    (ac, p) => ac + (parseFloat(p.amount) || 0),
    0
  );

  const paymentsList = watch("payments") || [];

  const {
    totalAmount,
    taxValue,
    discountValue,
    originalAmount,
    previousPayments,
    totalDues,
  } = paymentsList.reduce(
    (acc, p) => {
      if (p?.status === paymentInvoiceType.pending) {
        acc.totalAmount += p.total || 0;
        acc.taxValue += p.taxedValue || 0;
        acc.discountValue += p.discountedValue || 0;
        acc.totalDues += p.dueAmount || 0;
        acc.originalAmount += p.unit * p.amount || 0;
      } else {
        acc.previousPayments += p.total;
      }
      return acc;
    },
    {
      totalAmount: 0,
      taxValue: 0,
      discountValue: 0,
      totalDues: 0,
      originalAmount: 0,
      previousPayments: 0,
    }
  );

  useEffect(() => {
    setIsBothPaymentsEqual(
      totalPaymodeAmount === totalAmount ||
        (totalPaymodeAmount === 0 &&
          window.location.pathname.split("/")[1] === "doctor-opd")
    );
  }, [totalPaymodeAmount, totalAmount]);

  const handleSelectPayment = useCallback(
    (payment) => {
      append({
        name: payment.name,
        unit: 1,
        amount: payment.cost || 0,
        discount: {
          value: 0,
          unit: "inr",
        },
        tax: 0,
        taxedValue: 0,
        discountedValue: 0,
        status: paymentInvoiceType.pending,
        isDue: false,
        total: totalAmountCalculation(payment.cost, 0, 0),
      });
      setSearch("");
    },
    [append]
  );

  const { cursor, setCursor, handleKeyDown } = useKeyboardNavigation(
    payments,
    handleSelectPayment
  );

  const registerUnit = (index) => {
    const registration = register(`payments.${index}.unit`, {
      valueAsNumber: true,
      onChange: (e) => {
        const value = parseInt(e?.target?.value ?? e);
        const discountObj = getValues(`payments.${index}.discount`);
        const amount = getValues(`payments.${index}.amount`);
        const discount =
          discountObj?.unit === discountType.i
            ? discountObj?.value
            : Number(
                ((amount * parseInt(value) * discountObj?.value) / 100).toFixed(
                  2
                )
              );

        const tax = getValues(`payments.${index}.tax`);
        // const
        const total = totalAmountCalculation(value * amount, discount, tax);
        setValue(
          `payments.${index}.total`,
          total - (getValues(`payments.${index}.dueAmount`) || 0)
        );
        setValue(`payments.${index}.discountedValue`, discount);
        setValue(
          `payments.${index}.taxedValue`,
          Number((total - (value * amount - discount)).toFixed(2))
        );
      },
    });

    return {
      ...registration,
      name: `payments.${index}.unit`,
      type: "number",
    };
  };

  const registerAmount = (index) => {
    const registration = register(`payments.${index}.amount`, {
      valueAsNumber: true,
      onChange: (e) => {
        const value = e?.target?.value ?? e;
        const unit = parseInt(getValues(`payments.${index}.unit`));
        const discountObj = getValues(`payments.${index}.discount`);
        const discount =
          discountObj?.unit === discountType.i
            ? discountObj?.value
            : Number(((unit * value * discountObj?.value) / 100).toFixed(2));

        const tax = getValues(`payments.${index}.tax`);
        const total = totalAmountCalculation(unit * value, discount, tax);
        setValue(
          `payments.${index}.total`,
          total - (getValues(`payments.${index}.dueAmount`) || 0)
        );
        setValue(`payments.${index}.discountedValue`, discount);
        setValue(
          `payments.${index}.taxedValue`,
          Number((total - (value * unit - discount)).toFixed(2))
        );
      },
    });

    return {
      ...registration,
      name: `payments.${index}.amount`,
      type: "number",
    };
  };

  const onChangeDue = (index, value) => {
    const amount = getValues(`payments.${index}.amount`);
    const unit = parseInt(getValues(`payments.${index}.unit`));
    const discountObj = getValues(`payments.${index}.discount`);
    const discount =
      discountObj?.unit === discountType.i
        ? discountObj?.value
        : Number(((unit * amount * discountObj?.value) / 100).toFixed(2));

    const tax = getValues(`payments.${index}.tax`);
    const total = totalAmountCalculation(unit * amount, discount, tax);
    setValue(`payments.${index}.total`, total - (+value || 0));
    setValue(`payments.${index}.discountedValue`, discount);
    setValue(
      `payments.${index}.taxedValue`,
      Number((total - (amount * unit - discount)).toFixed(2))
    );
  };

  const registerDues = (index) => {
    const registration = register(`payments.${index}.dueAmount`, {
      valueAsNumber: true,
      onChange: (e) => {
        const value = e?.target?.value ?? e;
        onChangeDue(index, value);
      },
    });

    return {
      ...registration,
      name: `payments.${index}.dueAmount`,
      type: "number",
    };
  };

  const onChangeTax = (val, index) => {
    const discountObj = getValues(`payments.${index}.discount`);
    const unit = parseInt(getValues(`payments.${index}.unit`));
    const amount = getValues(`payments.${index}.amount`);
    const discount =
      discountObj?.unit === discountType.i
        ? discountObj?.value
        : Number(((amount * unit * discountObj?.value) / 100).toFixed(2));

    const total = totalAmountCalculation(amount * unit, discount, val);
    setValue(
      `payments.${index}.taxedValue`,
      Number((total - (amount * unit - discount)).toFixed(2))
    );
    setValue(
      `payments.${index}.total`,
      total - (getValues(`payments.${index}.dueAmount`) || 0)
    );
  };

  const onChangeDiscount = (val, index) => {
    const discountValue = val.value;
    const discountUnit = val.unit;
    const unit = parseInt(getValues(`payments.${index}.unit`));
    const amount = getValues(`payments.${index}.amount`);
    const tax = getValues(`payments.${index}.tax`);
    const discount =
      discountUnit === discountType.i
        ? discountValue
        : (amount * unit * discountValue) / 100;
    const total = totalAmountCalculation(amount * unit, discount, tax);
    setValue(`payments.${index}.discountedValue`, discount);
    setValue(
      `payments.${index}.taxedValue`,
      Number((total - (amount * unit - discount)).toFixed(2))
    );
    setValue(
      `payments.${index}.total`,
      total - (getValues(`payments.${index}.dueAmount`) || 0)
    );
  };

  const renderResults = () => {
    if (getPriceLoading) {
      return (
        <div className="cursor-pointer flex flex-col gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-10" />
          ))}
        </div>
      );
    } else {
      return payments.map((payment, i) => (
        <div
          key={payment?._id || i}
          className={cn(
            "px-2 py-1 cursor-pointer hover:bg-extra-light-blue rounded-sm flex justify-between items-center",
            i === cursor && "bg-light-blue"
          )}
          onClick={() => handleSelectPayment(payment)}
          onMouseEnter={() => setCursor(i)}
        >
          <div className="font-medium">
            {payment.new && <span className="text-blue/50">Add new:</span>}
            {payment.name}
          </div>
          <div className="font-medium p-1 bg-green-50 rounded-lg text-xs lg:text-sm w-20 flex justify-center">
            {payment.cost}Rs
          </div>
        </div>
      ));
    }
  };

  const fetchDuesDetails = () => {
    dispatch(getDuesDetails(patientData?._id));
  };

  useEffect(() => {
    if (debouncedSearch.length > 0) {
      dispatch(getPricingList({ query: debouncedSearch.trim() }));
      setCursor(0);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    // payment details is available (update mode)
    if (paymentsDetails) {
      setValue("patientId", paymentsDetails.patientData._id);

      // Reset payments array with transformed data
      const transformedPayments =
        paymentsDetails.payments.map((p, idx) => {
          if (p.dueAmount > 0) {
            handleCheckboxChange(idx);
          }
          return {
            ...p,
            discount: { unit: "inr", value: p.discount },
          };
        }) || [];

      setValue("payments", transformedPayments);

      // Reset payMode array
      setValue("payMode", [
        {
          type: "cash",
          amount: 0,
        },
      ]);
    }
  }, [paymentsDetails]);

  const patientData =
    viewPatientByIdApi.data?.response ||
    selectedPatient ||
    paymentsDetails?.patientData ||
    {};

  useEffect(() => {
    // this will work when from OPD queue first calls the API with patient Id
    if (patientId) {
      dispatch(viewPatientById({ id: patientId }));
    }
  }, [patientId]);

  useEffect(() => {
    if (patientData?._id && patientData._id !== prevPatientId) {
      fetchDuesDetails();
      setValue("patientId", patientData._id);
      setValue("serialId", `P-${patientData.serialId}`);
      setValue("patientName", patientData.name);
      setValue("phoneNo", patientData.phoneNo);
      setPrevPatientId(patientData._id);
    }
  }, [patientData]);

  useEffect(() => {
    return () => {
      dispatch(resetApiState("getDuesDetailsApi"));
      dispatch(resetApiStateFromPatient("viewPatientByIdApi"));
    };
  }, []);

  const handleCloseDueSettlementPopup = () => {
    // dispatch(resetApiState("paymentLogsApi"));
    setDuePopupOpen(false);
  };

  const handleDueSettlement = async (selectedInvoices) => {
    if (!selectedInvoices.length) return;
    setIsDueSettlementLoading(true);
    try {
      const res = await callAPI(`/payment/settleupdue`, {
        method: "POST",
        data: {
          invoiceIds: selectedInvoices,
        },
      });
      if (res?.data?.response?.paymentIds) {
        successToastMessage("Dues settled successfully");
        fetchDuesDetails();
        afterDueSettlement();
        setDuePopupOpen(false);
      } else {
        errorToastMessage("Failed to settle dues");
      }
    } catch (errors) {
      console.log({ errors });
      errorToastMessage("Failed to settle dues");
    } finally {
      setIsDueSettlementLoading(false);
    }
  };

  const handleCheckboxChange = (index = -1) => {
    const currentFieldValue = getValues("payments")[index];
    update(index, {
      ...currentFieldValue,
      isDue: !currentFieldValue?.isDue,
      dueAmount: currentFieldValue?.isDue ? 0 : currentFieldValue?.dueAmount,
    });
    onChangeDue(index, 0);
  };

  return (
    <div className="flex flex-col gap-2">
      {dueVisit?.grandTotal > 0 && (
        <Alert
          title={`Amount Due from Previous Visit: ${dueVisit?.grandTotal}`}
          type={alertType.danger}
          addFn={() => setDuePopupOpen(true)}
          showAdd
          showClear
        />
      )}
      {paymentDataLoading || viewPatientByIdApi.isLoading ? (
        <div className="grid grid-cols-3 gap-4 rounded-lg">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 rounded-lg">
          <CommonInput
            id={`serialId`}
            name={`serialId`}
            title="Patient Id"
            type="text"
            register={register}
            errors={errors}
            inputAsValue
          />
          <CommonInput
            id={`patientName`}
            name={`patientName`}
            title="Patient Name"
            type="text"
            register={register}
            errors={errors}
            inputAsValue
          />
          <CommonInput
            id={`phoneNo`}
            name={`phoneNo`}
            title="Contact No"
            type="text"
            register={register}
            errors={errors}
            inputAsValue
          />
        </div>
      )}

      <div className="border border-light-blue rounded-lg border-b-0">
        <TableHeader data={headerData} extraClass="gap-2" isSticky={false} />
        {paymentDataLoading ? (
          <PaymentSkeleton />
        ) : (
          <>
            {fields.map((field, index) => (
              <DisabledWrapper
                where={field?.status === paymentInvoiceType.completed}
                key={field.id}
              >
                {" "}
                <div
                  className={cn(
                    field?.status === paymentInvoiceType.completed
                      ? "py-0"
                      : "py-4",
                    "grid grid-cols-12 gap-2 px-4 border-b border-light-blue items-center"
                  )}
                >
                  <span className="text-blue text-xs lg:text-sm block font-medium col-span-1 lg:col-span-2">
                    {field.name}
                  </span>
                  <div className="col-span-1">
                    <CommonInput
                      register={registerUnit(index)}
                      errors={errors}
                      placeholder="unit"
                      type="number"
                      inputAsValue={
                        field?.status === paymentInvoiceType.completed
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <CommonInput
                      register={registerAmount(index)}
                      errors={errors}
                      extraClass="col-span-2"
                      placeholder="Amount"
                      type="number"
                      inputAsValue={
                        field?.status === paymentInvoiceType.completed
                      }
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1 text-blue">
                    {field?.status === paymentInvoiceType.completed ? (
                      <span className="px-2">
                        {getValues(`payments.${index}.discountedValue`)} ₹
                      </span>
                    ) : (
                      <ControlledInputWithDropdown
                        name={`payments.${index}.discount`}
                        control={control}
                        inputType="number"
                        placeholder="Discount"
                        options={discountOptions}
                        onChange={(val) => onChangeDiscount(val, index)}
                        inputAsValue={
                          field?.status === paymentInvoiceType.completed
                        }
                        showPlusIcon={false}
                      />
                    )}
                  </div>
                  <div className="col-span-1 text-blue">
                    {field?.status === paymentInvoiceType.completed ? (
                      <span className="px-2">
                        {getValues(`payments.${index}.tax`)} %
                      </span>
                    ) : (
                      <AntSearchableSelector
                        // isCompressed={true}
                        filterSort={false}
                        id={`payments.${index}.tax`}
                        name={`payments.${index}.tax`}
                        control={control}
                        errors={errors}
                        options={taxOptions}
                        onChange={(val) => {
                          onChangeTax(val, index);
                        }}
                        required
                      />
                    )}
                  </div>

                  <div className="col-span-2 flex flex-col">
                    <div className="flex gap-1">
                      <div className="flex items-center">
                        <CheckBox
                          handleChecked={() => handleCheckboxChange(index)}
                          name={`payments.${index}.isDue`}
                          checked={!!getValues("payments")?.[index]?.isDue}
                        />
                      </div>

                      {field.isDue > 0 && (
                        <CommonInput
                          register={registerDues(index)}
                          errors={errors}
                          placeholder="Amount"
                          type="number"
                          inputAsValue={
                            field?.status === paymentInvoiceType.completed
                          }
                        />
                      )}
                    </div>
                    <div>
                      {/* {console.log(
                        !!field.dueAmount,
                        getValues(`payments.${index}.dueAmount`),
                        getValues(`payments.${index}.total`)
                      )} */}
                      {!!field.dueAmount &&
                        getValues(`payments.${index}.dueAmount`) > 0 &&
                        getValues(`payments.${index}.dueAmount`) >
                          getValues(`payments.${index}.total`) && (
                          <p className="text-red-500 text-[10px] lg:text-xs">
                            Due exceeds total amount
                          </p>
                        )}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <CommonInput
                      // title="₹"
                      inputAsValue
                      name={`payments.${index}.total`}
                      labelName="Total"
                      type="number"
                      register={register}
                      value={getValues(`payments.${index}.total`)}
                      errors={errors}
                      // extraClass="text-center"
                    />
                  </div>
                  {field?.status === paymentInvoiceType.pending ? (
                    <div className="flex gap-1 col-span-1 items-center">
                      <div>
                        <TooltipWrapper
                          id={`payments.${index}.remove-payment`}
                          content="Remove Payment"
                          className="p-2 rounded-full hover:bg-red-100 cursor-pointer w-fit"
                        >
                          <TrashIcon onClick={() => remove(index)} />
                        </TooltipWrapper>
                      </div>
                    </div>
                  ) : (
                    <TickCircle
                      color="#008000"
                      className="p-2 rounded-full cursor-pointer w-10 h-10"
                    />
                  )}
                </div>
              </DisabledWrapper>
            ))}
          </>
        )}

        <div className="grid grid-cols-12 gap-4 items-center p-4 border-b border-light-blue">
          <span className="text-blue underline block col-span-2 text-xs lg:text-sm">
            Add Payments
          </span>
          <SearchBox
            search={search}
            setSearch={setSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter" && search.trim() && payments.length === 0) {
                e.preventDefault();
                handleSelectPayment({ name: search, cost: 0 });
              } else {
                handleKeyDown(e);
              }
            }}
            showData={!!search.trim()}
            dataJSX={renderResults()}
            extraClass="col-span-10"
            placeholder="Search & Add Payment"
            isCompressed
          />
        </div>
      </div>

      <div className="grid mt-4 grid-cols-2 gap-4 min-h-[200px] overflow-y-scroll w-full scrollbar-hide text-xs lg:text-sm">
        <div className="p-4 h-full border border-light-blue rounded-lg text-blue text-xs lg:text-lg flex flex-col gap-4">
          <h2 className="text-sm lg:text-base text-blue border-b pb-2 border-light-blue">
            Paymode
          </h2>
          <div className="flex flex-col gap-4">
            {payModeFields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-7 items-center gap-2 border-light-blue"
              >
                <div className="col-span-2">
                  <AntSearchableSelector
                    id={`payMode.${index}.type`}
                    name={`payMode.${index}.type`}
                    labelName="Pay Mode"
                    control={control}
                    errors={errors}
                    options={remainingPayModeOptions}
                    required
                  />
                </div>
                <div className="col-span-4">
                  <CommonInput
                    id={`payMode.${index}.amount`}
                    name={`payMode.${index}.amount`}
                    register={register}
                    errors={errors}
                    extraClass="col-span-2"
                    placeholder="Amount"
                    type="number"
                  />
                </div>
                <div className="flex items-center">
                  {index === payModeFields.length - 1 && (
                    <TooltipWrapper
                      id={`payMode.${index}.add-payMode`}
                      content="Add Paymode"
                      className="p-1 rounded-lg hover:bg-blue-100 cursor-pointer w-fit"
                    >
                      <PlusIcon
                        onClick={() => payModeAppend({ type: "", amount: "" })}
                      />
                    </TooltipWrapper>
                  )}

                  {index !== 0 && (
                    <TooltipWrapper
                      id={`payMode.${index}.remove-payMode`}
                      content="Remove Paymode"
                      className="p-2 rounded-lg hover:bg-red-100 cursor-pointer w-fit"
                    >
                      <TrashIcon
                        className="h-4 w-4"
                        onClick={() => payModeRemove(index)}
                      />
                    </TooltipWrapper>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full max-w mx-auto bg-white rounded-xl p-4 flex flex-col space-y-2 border border-light-blue scrollbar-hide text-xs lg:text-sm">
          <h2 className="text-sm lg:text-base text-blue border-b pb-2 border-light-blue">
            Patient Payment Summary
          </h2>
          <div className="flex items-center justify-between text-light-blue-text">
            <p>Previous Payments</p>
            <p className="font-medium">
              {(Number(previousPayments) || 0).toFixed(2)} ₹
            </p>
          </div>
          <div className="flex items-center justify-between text-blue">
            <p>Total Amount</p>
            <p className="font-medium">
              {(Number(originalAmount) || 0).toFixed(2)} ₹
            </p>
          </div>

          <div className="flex items-center justify-between text-blue">
            <p>Pay Later(Dues)</p>
            <p className="text-red-500">
              - {(totalDues >= 0 ? Number(totalDues) : 0).toFixed(2)} ₹
            </p>
          </div>

          <div className="flex items-center justify-between text-blue">
            <p>Discount</p>
            <p className="text-red-500">
              - {(discountValue >= 0 ? Number(discountValue) : 0).toFixed(2)} ₹
            </p>
          </div>

          <div className="flex items-center justify-between text-blue">
            <p>Taxes</p>
            <p className="text-green-600">
              + {(Number(taxValue) || 0).toFixed(2)} ₹
            </p>
          </div>

          <div className="flex items-center justify-between font-semibold text-blue border-t border-light-blue pt-2 text-sm lg:text-base">
            <p>Grand Total</p>
            <p className="text-blue">
              {(Number(totalAmount) || 0).toFixed(2)} ₹
            </p>
          </div>
        </div>
      </div>

      {duePopupOpen && (
        <DueSettlementModal
          dueVisitList={dueVisit?.visits || []}
          onClose={handleCloseDueSettlementPopup}
          handleSubmit={handleDueSettlement}
          isDueSettlementLoading={isDueSettlementLoading}
        />
      )}
    </div>
  );
};

export default PaymentsFields;

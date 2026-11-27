import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  discountOptions,
  discountType,
  taxOptions,
  totalAmountCalculation,
} from "../../payment/helper";
import { useKeyboardNavigation } from "../../../hooks/useKeyboardNavigation";
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
import DisabledWrapper from "../../../components/DisabledWrapper";
import TickCircle from "../../../components/svgs/TickCircle";
import {
  getMedicationsList,
  viewConsultationByVisitId,
} from "../../../slices/consultationSlice";
import PaymentSkeleton from "../../payment/components/PaymentSkeleton";
import { resetApiState } from "../../../slices/consultationSlice";
import { apiResponseType } from "../../../utils/types";
import { paymentInvoiceType, paymentOptions } from "../helper";
import CheckBox from "../../../components/Checkbox";
import useNavigateTo from "../../../hooks/useNavigateTo";
import toast from "react-hot-toast";

const headerData = [
  {
    name: "Pharmacy Name",
    value: "pharmacyName",
    _class: "col-span-2",
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
    _class: "col-span-2",
  },
  {
    name: "Tax (%)",
    value: "tax",
    _class: "col-span-1",
  },
  {
    name: "Total (₹)",
    value: "total",
    _class: "col-span-2 text-center",
  },
  {
    name: "",
    value: "Remove",
    // _class: "col-span-2",
  },
];

const PharmacyFields = ({
  selectedPatient,
  methods,
  setIsBothPaymentsEqual,
  pharmaciesDetails = null,
  pharmacyDataLoading = false,
  visitId,
}) => {
  const { getMedicationsListApi, viewConsultationApi } = useSelector(
    (state) => state.consultation
  );
  const { data: getMedicationsData, isLoading: getMedicationsLoading } =
    getMedicationsListApi;
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500, true);
  const [selectAll, setSelectAll] = useState(false);
  const dispatch = useDispatch();
  const goTo = useNavigateTo();
  const { register, control, formState, getValues, setValue, watch } = methods;
  const PharmaciesMethods = useFieldArray({
    control,
    name: "pharmacies",
  });
  const payModeMethods = useFieldArray({
    control,
    name: "payMode",
  });
  const { fields, append, remove, update } = PharmaciesMethods;
  const {
    fields: payModeFields,
    append: payModeAppend,
    remove: payModeRemove,
  } = payModeMethods;
  const { errors } = formState;

  const payModeOptions = [
    ...new Set((watch("payMode") || [])?.map((p) => p.type).filter(Boolean)),
  ];

  const remainingPayModeOptions = paymentOptions.filter(
    (p) => !payModeOptions.includes(p.value)
  );

  const pharmacies = useMemo(() => {
    const oldPharmacies = getMedicationsData?.response || [];

    // Only add the "add new" option if we have a search term and results
    if (debouncedSearch.trim()) {
      return [
        ...oldPharmacies,
        {
          name: debouncedSearch,
          new: true,
          _id: `new-${debouncedSearch}`,
        },
      ];
    }
    return oldPharmacies;
  }, [getMedicationsData, debouncedSearch]);

  const totalPaymodeAmount = (getValues("payMode") || []).reduce(
    (ac, p) => ac + (parseFloat(p.amount) || 0),
    0
  );

  const pharmaciesList = watch("pharmacies") || [];

  const {
    totalAmount,
    taxValue,
    discountValue,
    originalAmount,
    previousPharmacies,
  } = pharmaciesList.reduce(
    (acc, p) => {
      if (p?.status === paymentInvoiceType.pending) {
        if (p?.continue) {
          acc.totalAmount += p.total || 0;
          acc.taxValue += p.taxedValue || 0;
          acc.discountValue += p.discountedValue || 0;
          acc.originalAmount += p.unit * p.amount || 0;
        }
      } else {
        acc.previousPharmacies += p.total;
      }
      return acc;
    },
    {
      totalAmount: 0,
      taxValue: 0,
      discountValue: 0,
      originalAmount: 0,
      previousPharmacies: 0,
    }
  );

  const consultationPharmacies =
    viewConsultationApi.data?.response?.consultationData?.medications?.map(
      (m) => ({
        _id: m.id,
        name: m.name,
        unit: m.totalQuantity,
        amount: m.amount || 0,
        discount: {
          value: 0,
          unit: "inr",
        },
        tax: 0,
        taxedValue: 0,
        discountedValue: 0,
        status: paymentInvoiceType.pending,
        continue: true,
        total: totalAmountCalculation(m.price * m.totalQuantity || 0, 0, 0),
      })
    );

  const handleSelectPharmacy = useCallback(
    (pharmacy) => {
      append({
        name: pharmacy.name,
        unit: 1,
        amount: pharmacy?.price || 0,
        discount: {
          value: 0,
          unit: "inr",
        },
        tax: 0,
        taxedValue: 0,
        discountedValue: 0,
        status: paymentInvoiceType.pending,
        continue: true,
        total: totalAmountCalculation(pharmacy?.price, 0, 0),
      });
      setSearch("");
    },
    [append]
  );

  const handleCheckboxChange = (index = -1) => {
    if (index === -1) {
      setSelectAll((prev) => !prev);
    } else {
      const currentFieldValue = getValues("pharmacies")[index];
      update(index, {
        ...currentFieldValue,
        continue: !currentFieldValue.continue,
      });
    }
  };

  const { cursor, setCursor, handleKeyDown } = useKeyboardNavigation(
    pharmacies,
    handleSelectPharmacy
  );

  const registerUnit = (index) => {
    const registration = register(`pharmacies.${index}.unit`, {
      valueAsNumber: true,
      onChange: (e) => {
        const value = parseInt(e?.target?.value ?? e);
        const discountObj = getValues(`pharmacies.${index}.discount`);
        const amount = getValues(`pharmacies.${index}.amount`);
        const discount =
          discountObj?.unit === discountType.i
            ? discountObj?.value
            : Number(
                ((amount * parseInt(value) * discountObj?.value) / 100).toFixed(
                  2
                )
              );

        const tax = getValues(`pharmacies.${index}.tax`);
        const total = totalAmountCalculation(value * amount, discount, tax);
        setValue(`pharmacies.${index}.total`, total);
        setValue(`pharmacies.${index}.discountedValue`, discount);
        setValue(
          `pharmacies.${index}.taxedValue`,
          Number((total - (value * amount - discount)).toFixed(2))
        );
      },
    });

    return {
      ...registration,
      name: `pharmacies.${index}.unit`,
      type: "number",
    };
  };
  const registerAmount = (index) => {
    const registration = register(`pharmacies.${index}.amount`, {
      valueAsNumber: true,
      onChange: (e) => {
        const value = e?.target?.value ?? e;
        const unit = parseInt(getValues(`pharmacies.${index}.unit`));
        const discountObj = getValues(`pharmacies.${index}.discount`);
        const discount =
          discountObj?.unit === discountType.i
            ? discountObj?.value
            : Number(((unit * value * discountObj?.value) / 100).toFixed(2));

        const tax = getValues(`pharmacies.${index}.tax`);
        const total = totalAmountCalculation(unit * value, discount, tax);
        setValue(`pharmacies.${index}.total`, total);
        setValue(`pharmacies.${index}.discountedValue`, discount);
        setValue(
          `pharmacies.${index}.taxedValue`,
          Number((total - (value * unit - discount)).toFixed(2))
        );
      },
    });

    return {
      ...registration,
      name: `pharmacies.${index}.amount`,
      type: "number",
    };
  };

  const onChangeTax = (val, index) => {
    const discountObj = getValues(`pharmacies.${index}.discount`);
    const unit = parseInt(getValues(`pharmacies.${index}.unit`));
    const amount = getValues(`pharmacies.${index}.amount`);
    const discount =
      discountObj?.unit === discountType.i
        ? discountObj?.value
        : Number(((amount * unit * discountObj?.value) / 100).toFixed(2));

    const total = totalAmountCalculation(amount * unit, discount, val);
    setValue(
      `pharmacies.${index}.taxedValue`,
      Number((total - (amount * unit - discount)).toFixed(2))
    );
    setValue(`pharmacies.${index}.total`, total);
  };

  const onChangeDiscount = (val, index) => {
    const discountValue = val.value;
    const discountUnit = val.unit;
    const unit = parseInt(getValues(`pharmacies.${index}.unit`));
    const amount = getValues(`pharmacies.${index}.amount`);
    const tax = getValues(`pharmacies.${index}.tax`);
    const discount =
      discountUnit === discountType.i
        ? discountValue
        : (amount * unit * discountValue) / 100;
    const total = totalAmountCalculation(amount * unit, discount, tax);
    console.log({ total });
    setValue(`pharmacies.${index}.discountedValue`, discount);
    setValue(
      `pharmacies.${index}.taxedValue`,
      Number((total - (amount * unit - discount)).toFixed(2))
    );
    setValue(`pharmacies.${index}.total`, total);
  };

  const renderResults = () => {
    if (getMedicationsLoading) {
      return (
        <div className="cursor-pointer flex flex-col gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-10" />
          ))}
        </div>
      );
    } else {
      return pharmacies.map((pharmacy, i) => (
        <div
          key={pharmacy?._id || i}
          className={cn(
            "px-2 py-1 cursor-pointer hover:bg-extra-light-blue rounded-sm flex justify-between items-center",
            i === cursor && "bg-light-blue"
          )}
          onClick={() => handleSelectPharmacy(pharmacy)}
          onMouseEnter={() => setCursor(i)}
        >
          <div className="font-medium">
            {" "}
            {pharmacy.new && <span className="text-blue/50">Add new:</span>}
            {pharmacy.name}
          </div>
          {pharmacy?.price && (
            <div className="font-medium p-1 bg-green-50 rounded-lg text-sm w-20 flex justify-center">
              {pharmacy?.price + " ₹"}
            </div>
          )}
        </div>
      ));
    }
  };

  useEffect(() => {
    if (debouncedSearch.length > 0) {
      dispatch(getMedicationsList({ query: debouncedSearch.trim() }));
      setCursor(0);
    }
  }, [debouncedSearch]);

  const patientData =
    viewConsultationApi.data?.response?.patientData ||
    pharmaciesDetails?.patientData ||
    selectedPatient;
  const prevPatientId = useRef();

  useEffect(() => {
    if (patientData?._id && patientData._id !== prevPatientId.current) {
      setValue("patientId", patientData._id);
      setValue("serialId", `P-${patientData.serialId}`);
      setValue("patientName", patientData.name);
      setValue("phoneNo", patientData.phoneNo);
      prevPatientId.current = patientData._id;
    }
  }, [patientData]);

  useEffect(() => {
    if (viewConsultationApi.status === apiResponseType.success) {
      setValue("pharmacies", consultationPharmacies);
    } else if (viewConsultationApi.status === apiResponseType.failed) {
      toast.error("Visit Not Found");
      goTo("/pharmacy");
    }
  }, [viewConsultationApi.status]);

  useEffect(() => {
    setIsBothPaymentsEqual(
      totalPaymodeAmount === totalAmount ||
        (totalPaymodeAmount === 0 &&
          window.location.pathname.split("/")[1] === "doctor-opd")
    );
  }, [totalPaymodeAmount, totalAmount]);

  useEffect(() => {
    if (visitId) {
      dispatch(viewConsultationByVisitId(visitId));
    }
  }, [visitId]);

  useEffect(() => {
    return () => {
      dispatch(resetApiState("viewConsultationApi"));
    };
  }, []);

  useEffect(() => {
    const newPharmacies = pharmaciesList.map((p) => ({
      ...p,
      continue:
        p.status !== paymentInvoiceType.completed ? selectAll : p.continue,
    }));
    setValue("pharmacies", newPharmacies);
  }, [selectAll]);

  return (
    <div className="flex flex-col gap-2">
      {pharmacyDataLoading || viewConsultationApi.isLoading ? (
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
        <div className="relative w-full flex items-center px-4 bg-extra-light-blue justify-between">
          <TableHeader
            data={headerData}
            extraClass="w-full gap-4 px-0"
            isSticky={false}
          />
          <div className="w-[16.5%] absolute right-0">
            <CheckBox
              handleChecked={handleCheckboxChange}
              checked={selectAll}
            />
          </div>
        </div>

        {pharmacyDataLoading || viewConsultationApi.isLoading ? (
          <PaymentSkeleton />
        ) : (
          <>
            {fields.map((field, index) => (
              <DisabledWrapper
                where={field?.status === paymentInvoiceType.completed}
                key={field.id}
                childrenClassName="w-full flex items-center px-4 justify-between"
              >
                {" "}
                <div
                  className={cn(
                    field?.status === paymentInvoiceType.completed
                      ? "py-0"
                      : "py-4",
                    "grid grid-cols-12 gap-4 border-b border-light-blue items-center"
                  )}
                >
                  <span className="text-blue text-sm block font-medium col-span-2">
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
                  <div className="col-span-2 text-blue">
                    {field?.status === paymentInvoiceType.completed ? (
                      <span className="px-2">
                        {getValues(`pharmacies.${index}.discountedValue`)} ₹
                      </span>
                    ) : (
                      <ControlledInputWithDropdown
                        name={`pharmacies.${index}.discount`}
                        control={control}
                        inputType="number"
                        placeholder="Discount"
                        options={discountOptions}
                        onChange={(val) => {
                          onChangeDiscount(val, index);
                        }}
                        inputAsValue={
                          field?.status === paymentInvoiceType.completed
                        }
                      />
                    )}
                  </div>
                  <div className="col-span-1 text-blue">
                    {field?.status === paymentInvoiceType.completed ? (
                      <span className="px-2">
                        {getValues(`pharmacies.${index}.tax`)} %
                      </span>
                    ) : (
                      <AntSearchableSelector
                        // isCompressed={true}
                        filterSort={false}
                        id={`pharmacies.${index}.tax`}
                        name={`pharmacies.${index}.tax`}
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
                  <div className="col-span-2">
                    <CommonInput
                      // title="₹"
                      inputAsValue
                      name={`pharmacies.${index}.total`}
                      labelName="Total"
                      type="number"
                      register={register}
                      value={getValues(`pharmacies.${index}.total`)}
                      errors={errors}
                      extraClass="text-center"
                    />
                  </div>
                  <div>
                    <CheckBox
                      handleChecked={() => handleCheckboxChange(index)}
                      name={`pharmacies.${index}.continue`}
                      checked={!!getValues("pharmacies")?.[index]?.continue}
                      disabled={field?.status === paymentInvoiceType.completed}
                    />
                  </div>
                  {field?.status === paymentInvoiceType.pending ? (
                    <>
                      <TooltipWrapper
                        id={`pharmacies.${index}.remove-pharmacy`}
                        content="Remove Pharmacy"
                        className="p-2 rounded-full hover:bg-red-100 cursor-pointer w-fit"
                      >
                        <TrashIcon onClick={() => remove(index)} />
                      </TooltipWrapper>
                    </>
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
          <span className="text-blue underline block col-span-2 text-sm">
            Add Pharmacies
          </span>
          <SearchBox
            search={search}
            setSearch={setSearch}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                search.trim() &&
                pharmacies.length === 0
              ) {
                e.preventDefault();
                handleSelectPharmacy({ name: search, cost: 0 });
              } else {
                handleKeyDown(e);
              }
            }}
            showData={!!search.trim()}
            dataJSX={renderResults()}
            extraClass="col-span-10"
            placeholder="Search & Add Pharmacy"
            isCompressed
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 min-h-[200px] overflow-y-scroll w-full scrollbar-hide text-sm">
        <div className="p-4 h-full border border-light-blue rounded-lg text-blue text-lg flex flex-col gap-4">
          <h2 className="text-base text-blue border-b pb-2 border-light-blue">
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
        <div className="w-full max-w mx-auto bg-white rounded-xl p-4 flex flex-col space-y-2 border border-light-blue scrollbar-hide text-sm">
          <h2 className="text-base text-blue border-b pb-2 border-light-blue">
            Patient Pharmacy Summary
          </h2>
          <div className="flex items-center justify-between text-light-blue-text">
            <p>Previous Pharmacies</p>
            <p className="font-medium">
              {(Number(previousPharmacies) || 0).toFixed(2)} ₹
            </p>
          </div>
          <div className="flex items-center justify-between text-blue">
            <p>Total Amount</p>
            <p className="font-medium">
              {(Number(originalAmount) || 0).toFixed(2)} ₹
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

          <div className="flex items-center justify-between font-semibold text-blue border-t border-light-blue pt-2 text-base">
            <p>Grand Total</p>
            <p className="text-blue">
              {(Number(totalAmount) || 0).toFixed(2)} ₹
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyFields;

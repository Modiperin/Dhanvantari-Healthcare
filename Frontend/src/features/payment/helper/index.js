import { ROUTES } from "../../../routes/helper";

export const tabs = [
  {
    id: 1,
    name: "Payment OPD",
    to: ROUTES.PAYMENTS,
  },
  {
    id: 2,
    name: "Payment Invoices",
    to: ROUTES.PAYMENT_INVOICE_MANAGEMENT,
  },
];

export const alertType = {
  dark: "dark",
  secondary: "secondary",
  info: "info",
  success: "success",
  danger: "danger",
  warning: "warning",
  light: "light",
};

export const paymentOptions = [
  { label: "Cash", value: "cash" },
  { label: "UPI", value: "upi" },
  { label: "cheque", value: "cheque" },
  { label: "Net Banking", value: "net-banking" },
  // { label: "Due", value: "due" },
];

export const paymentType = {
  c: "cash",
  u: "upi",
  ch: "cheque",
  n: "net-banking",
  d: "due",
};

export const discountOptions = [
  { value: "inr", label: "₹" },
  { value: "percentage", label: "%" },
];

export const discountType = {
  p: "percentage",
  i: "inr",
};

export const taxOptions = [
  { value: 0, label: "0 %" },
  { value: 5, label: "5 %" },
  { value: 18, label: "18 %" },
];

export const totalAmountCalculation = (amount = 0, discount = 0, tax = 0) => {
  const totalAmountWithDiscount =
    (parseFloat(amount) || 0) - (parseFloat(discount) || 0);
  const taxInRs =
    (parseFloat(totalAmountWithDiscount) * (parseFloat(tax) || 0)) / 100;
  const totalAmount = totalAmountWithDiscount + taxInRs;
  return isNaN(totalAmount) ? 0 : +totalAmount.toFixed(2);
};

export const filterConfig = [
  {
    type: "slider",
    label: "Patient's Age Range",
    key: "age",
    min: 0,
    max: 100,
    step: 5,
  },
  {
    type: "slider",
    label: "Total Amount Range",
    key: "grandTotal",
    min: 0,
    max: 100000,
    step: 50,
  },
  {
    type: "checkbox",
    label: "Gender",
    key: "gender",
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Others", value: "others" },
    ],
  },
  {
    type: "checkbox",
    label: "Paid",
    key: "isAmountPaid",
    options: [
      { label: "Paid", value: true },
      { label: "Un-Paid", value: false },
    ],
  },
];

export const defaultValueForPayment = {
  patientId: "",
  serialId: "",
  patientName: "",
  phoneNo: "",
  payments: [],
  payMode: [
    {
      type: "cash",
      amount: 0,
    },
  ],
};

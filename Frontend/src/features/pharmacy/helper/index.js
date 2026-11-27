import { ROUTES } from "../../../routes/helper";

export const tabs = [
  {
    id: 1,
    name: "Pharmacy OPD",
    to: ROUTES.PHARMACY,
  },
  {
    id: 2,
    name: "Pharmacy Invoices",
    to: ROUTES.PHARMACY_INVOICE_MANAGEMENT,
  },
];

export const paymentInvoiceType = {
  cancelled: "cancelled",
  pending: "pending",
  completed: "completed",
};

export const paymentType = {
  paid: "paid",
  unpaid: "unpaid",
};

export const paymentOptions = [
  { label: "Cash", value: "cash" },
  { label: "UPI", value: "upi" },
  { label: "Cheque", value: "cheque" },
  { label: "Net Banking", value: "net-banking" },
];

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
export const defaultValueForPhramacy = {
  patientId: "",
  serialId: "",
  patientName: "",
  phoneNo: "",
  pharmacies: [],
  payMode: [
    {
      type: "cash",
      amount: 0,
    },
  ],
};

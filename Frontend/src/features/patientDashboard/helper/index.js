import { ROUTES } from "../../../routes/helper";

export const tabs = [
  {
    id: 1,
    name: "Basic Details",
    to: ROUTES.PATIENT_BASIC_DETAIL,
  },
  {
    id: 2,
    name: "Past Prescriptions",
    to: ROUTES.PATIENT_PRESCRIPTION,
  },
  {
    id: 3,
    name: "Vital Trends",
    to: ROUTES.PATIENT_VITAL_TRENDS,
  },
  {
    id: 4,
    name: "Payments",
    to: ROUTES.PATIENTS_PAYMENTS,
  },
];

export const filterConfig = [
  {
    type: "slider",
    label: "Age Range",
    key: "age",
    min: 1,
    max: 110,
    step: 5,
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
    label: "Blood Groups",
    key: "bloodGroup",
    options: [
      { label: "A+", value: "A+" },
      { label: "A-", value: "A-" },
      { label: "B+", value: "B+" },
      { label: "B-", value: "B-" },
      { label: "AB+", value: "AB+" },
      { label: "AB-", value: "AB-" },
      { label: "O+", value: "O+" },
      { label: "O-", value: "O-" },
    ],
  },
];

export const medicalTimingOptions = [
  { label: "After Food", value: "A" },
  { label: "Before Food", value: "B" },
];

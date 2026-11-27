import { ROUTES } from "../../../routes/helper";

export const tabs = [
  {
    id: 1,
    name: "Register Patient",
    to: ROUTES.REGISTRATION_CREATE,
  },
  {
    id: 2,
    name: "Search Patients",
    to: ROUTES.REGISTRATION_SEARCH,
  },
  {
    id: 3,
    name: "All Registrations",
    to: ROUTES.REGISTRATIONS,
  },
  {
    id: 4,
    name: "All Appointments",
    to: ROUTES.REGISTRATION_APPOINTMENT_LIST,
  },
];

export const searchTypeOptions = [
  { label: "Email", value: "email" },
  { label: "Name", value: "name" },
  { label: "Phone No", value: "phoneNo" },
];

export const bloodGroupOptions = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
  { label: "N/A", value: "N/A" },
];

export const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Others", value: "others" },
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
    label: "Priority",
    key: "priority",
    options: [
      { label: "Normal", value: 3 },
      { label: "VIP", value: 2 },
      { label: "Emergency", value: 1 },
    ],
  },
  {
    type: "checkbox",
    label: "Appointment Type",
    key: "appointmentType",
    options: [
      { label: "Appointment", value: "Appointment" },
      { label: "Walk-In", value: "Walkin" },
    ],
  },
  {
    type: "checkbox",
    label: "Completed Status",
    key: "status",
    options: [
      { label: "Checked-in", value: "Checked-in" },
      { label: "Completed", value: "Completed" },
    ],
  },
];

export const priorityOptions = [
  { label: "Normal", value: 3 },
  { label: "Emergency", value: 1 },
  { label: "VIP", value: 2 },
];

export const patientTypeOptions = [
  { label: "New Patient", value: "newPatient" },
  { label: "Old Patient", value: "oldPatient" },
];

export const countryOptions = [
  { label: "India", value: "india" },
  { label: "United States", value: "usa" },
  { label: "Canada", value: "canada" },
  { label: "United Kingdom", value: "uk" },
  { label: "Australia", value: "australia" },
  { label: "Germany", value: "germany" },
  { label: "France", value: "france" },
  { label: "Japan", value: "japan" },
  { label: "China", value: "china" },
  { label: "Brazil", value: "brazil" },
];

export const stateOptions = [
  { label: "Maharashtra", value: "maharashtra" },
  { label: "Gujarat", value: "gujarat" },
  { label: "Karnataka", value: "karnataka" },
  { label: "Tamil Nadu", value: "tamil_nadu" },
  { label: "Uttar Pradesh", value: "uttar_pradesh" },
  { label: "Madhya Pradesh", value: "madhya_pradesh" },
  { label: "Rajasthan", value: "rajasthan" },
  { label: "Bihar", value: "bihar" },
  { label: "West Bengal", value: "west_bengal" },
  { label: "Punjab", value: "punjab" },
];

export const relationOptions = [
  { label: "Father", value: "father" },
  { label: "Mother", value: "mother" },
  { label: "Wife", value: "wife" },
  { label: "Husband", value: "husband" },
  { label: "Son", value: "son" },
  { label: "Daughter", value: "daughter" },
  { label: "Brother", value: "brother" },
  { label: "Sister", value: "sister" },
  { label: "Guardian", value: "guardian" },
];

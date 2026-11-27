export const tabs = [
  {
    id: 1,
    name: "Appointments",
    to: "/appointmentlist",
  },
  {
    id: 2,
    name: "Create App.",
    to: "/createappointment",
  },
];

export const searchTypeOptions = [
  { label: "Email", value: "email" },
  { label: "Name", value: "name" },
  { label: "Phone No", value: "phoneNo" },
];

export const filterConfig = [
  {
    type: "slider",
    label: "Age Range",
    key: "age",
    min: 1,
    max: 100,
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
    label: "Appointment Status",
    key: "status",
    options: [
      { label: "Booked", value: "booked" },
      { label: "Completed", value: "completed" },
      { label: "Rescheduled", value: "rescheduled" },
      { label: "Cancelled", value: "cancelled" },
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

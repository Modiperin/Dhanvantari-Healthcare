export const filterConfig = [
  {
    type: "slider",
    label: "Age Range",
    key: "age",
    min: 10,
    max: 60,
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
      { label: "Appointment", value: "appointment" },
      { label: "Walk-In", value: "walkin" },
    ],
  },
];

export const timeUnits = [
  { value: "hours", label: "hours" },
  { value: "days", label: "days" },
  { value: "weeks", label: "weeks" },
  { value: "months", label: "months" },
  { value: "years", label: "years" },
];

export const diagnosisStatusOptions = [
  { value: "confirm", label: "Confirm" },
  { value: "suspected", label: "Suspected" },
  { value: "ruled-out", label: "Ruled Out" },
];

export const timingOptions = [
  { label: "Before Food", value: "B" },
  { label: "After Food", value: "A" },
];

export const timeSlotOptions = [
  { label: "M", value: "M" },
  { label: "A", value: "A" },
  { label: "E", value: "E" },
  { label: "N", value: "N" },
];

export const vitalFields = [
  {
    key: "height",
    label: "Height",
    type: "number",
    unitKey: "heightUnit",
    unitOptions: [
      { label: "Centimeter (cm)", value: "cm" },
      { label: "Meter (m)", value: "m" },
      { label: "Feet (ft)", value: "ft" },
      { label: "Inch (in)", value: "in" },
      // { label: "cm", value: "cm" },
      // { label: "m", value: "m" },
      // { label: "ft", value: "ft" },
      // { label: "in", value: "in" },
    ],
    placeholder: "Height",
  },
  {
    key: "weight",
    label: "Weight",
    type: "number",
    unitKey: "weightUnit",
    unitOptions: [
      { label: "Kilogram (kg)", value: "kg" },
      { label: "Pound (lb)", value: "lb" },
      // { label: "kg", value: "kg" },
      // { label: "lb", value: "lb" },
    ],
    placeholder: "Weight",
  },
  {
    key: "respirationRate",
    label: "Respiration Rate",
    type: "number",
    unitKey: "respirationRateUnit",
    unitOptions: [
      // { label: "bpm", value: "bpm" }
      { label: "Breaths per minute (bpm)", value: "bpm" },
    ],
    placeholder: "Respiration Rate",
  },
  // {
  //   key: "bmi",
  //   label: "BMI",
  //   type: "number",
  //   unitKey: "bmiUnit",
  //   // unitOptions: [{ label: "kg/m²", value: "kg/m²" }],
  //   unitOptions: [
  //     { label: "Kilogram per meter squared (kg/m²)", value: "kg/m²" },
  //   ],
  //   placeholder: "BMI",
  // },
  {
    key: "temperature",
    label: "Temperature",
    type: "number",
    unitKey: "temperatureUnit",
    // unitOptions: [
    //   { label: "°F", value: "°F" },
    //   { label: "°C", value: "°C" },
    // ],
    unitOptions: [
      { label: "Fahrenheit (°F)", value: "°F" },
      { label: "Celsius (°C)", value: "°C" },
    ],
    placeholder: "Temperature",
  },
  {
    key: "pulse",
    label: "Pulse",
    type: "number",
    unitKey: "pulseUnit",
    // unitOptions: [{ label: "/min", value: "/min" }],
    unitOptions: [{ label: "Per minute (/min)", value: "/min" }],
    placeholder: "Pulse",
  },
  {
    key: "bp",
    label: "BP",
    type: "string",
    unitKey: "bpUnit",
    // unitOptions: [{ label: "mmHg", value: "mmHg" }],
    unitOptions: [{ label: "Millimeter of mercury (mmHg)", value: "mmHg" }],
    placeholder: "Systolic",
    extra: {
      diastolicKey: "bpDiastolic",
      diastolicPlaceholder: "Diastolic",
    },
  },
  {
    key: "spo2",
    label: "SPO2",
    type: "number",
    unitKey: "spo2Unit",
    // unitOptions: [{ label: "%", value: "%" }],
    unitOptions: [{ label: "Percentage (%)", value: "%" }],
    placeholder: "SPO2",
  },
  {
    key: "bsf",
    label: "BSF",
    type: "number",
    unitKey: "bsfUnit",
    // unitOptions: [{ label: "mg/dl", value: "mg/dl" }],
    unitOptions: [{ label: "Milligram per deciliter (mg/dl)", value: "mg/dl" }],
    placeholder: "BSF",
  },
  {
    key: "rbs",
    label: "RBS",
    type: "number",
    unitKey: "rbsUnit",
    // unitOptions: [{ label: "mg/dl", value: "mg/dl" }],
    unitOptions: [{ label: "Milligram per deciliter (mg/dl)", value: "mg/dl" }],
    placeholder: "RBS",
  },
  {
    key: "bspp",
    label: "BS PP",
    type: "number",
    unitKey: "bsppUnit",
    // unitOptions: [{ label: "mg/dl", value: "mg/dl" }],
    unitOptions: [{ label: "Milligram per deciliter (mg/dl)", value: "mg/dl" }],
    placeholder: "BS PP",
  },
];

export const SeverityOptions = [
  { name: "None", value: "none" },
  { name: "Severe", value: "severe" },
  { name: "Moderate", value: "moderate" },
  { name: "Mild", value: "mild" },
];

export const initialVitalsState = {
  height: null,
  heightUnit: "cm",
  respirationRate: null,
  respirationRateUnit: "bpm",
  weight: null,
  weightUnit: "kg",
  bmi: null,
  bmiUnit: "kg/m²",
  temperature: null,
  temperatureUnit: "°F",
  pulse: null,
  pulseUnit: "/min",
  bp: null,
  bpUnit: "mmHg",
  spo2: null,
  spo2Unit: "%",
  bsf: null,
  bsfUnit: "mg/dl",
  rbs: null,
  rbsUnit: "mg/dl",
  bspp: null,
  bsppUnit: "mg/dl",
};

export const initialComplaintsState = [
  // { chief: null, severity: null, region: null, days: null },
];

export const unitToMeter = {
  cm: 0.01,
  m: 1,
  in: 0.0254,
  ft: 0.3048,
};

export const unitToKg = {
  kg: 1,
  lb: 0.453592, // 1 lb = 0.453592 kg
};

export const convertTemperature = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value;

  if (fromUnit === "°C" && toUnit === "°F") {
    return Number((value * 9) / 5 + 32).toFixed(1);
  } else if (fromUnit === "°F" && toUnit === "°C") {
    return Number(((value - 32) * 5) / 9).toFixed(1);
  }
};

export const convertHeight = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value;

  return Number(value * (unitToMeter[fromUnit] / unitToMeter[toUnit])).toFixed(
    1
  );
};

export const convertWeight = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value;

  return Number(value * (unitToKg[fromUnit] / unitToKg[toUnit])).toFixed(1);
};

export const calculateBMI = (vitals) => {
  const weight = convertWeight(vitals.weight, vitals.weightUnit, "kg");
  const height = convertHeight(vitals.height, vitals.heightUnit, "m");
  if (!weight || !height || height <= 0) return 0;
  const bmi = weight / (height * height);
  return bmi === Infinity ? 0 : bmi > 0 ? Number(bmi.toFixed(2)) : 0;
};

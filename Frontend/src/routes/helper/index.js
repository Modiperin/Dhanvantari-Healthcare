export const ROUTES = {
  LOGIN: "/login",

  ONBOARD: "/admin/onboard",

  SETUP_PASSWORD: "/setup-password",

  PRESCRIPTION_PREVIEW: "/consultation/preview/:token",

  DASHBOARD: "/dashboard",

  PROFILES: "/profiles",
  PROFILE_CREATE: "/profile/create",
  PROFILE_UPDATE_BY_ID: "/profile/update/:id",
  PROFILE_UPDATE: "/profile/update",

  STAFF_MANAGEMENT: "/staff",
  STAFF_UPDATE: "/staff/update/:id",
  STAFF_CREATE: "/staff/create",

  DEPARTMENTS: "/departments",
  DEPARTMENT_CREATE: "/department/create",
  DEPARTMENT_UPDATE: "/department/update/:id",
  DEPARTMENT_UPDATE_BY_ID: "/department/update",

  DOCTORS: "/doctors",
  DOCTOR_CREATE: "/doctor/create",
  DOCTOR_UPDATE_BY_ID: "/doctor/update/:id",
  DOCTOR_UPDATE: "/doctor/update",

  PRICINGCATALOG: "/pricings",
  PRICING_CREATE: "/pricing/create",
  PRICING_UPDATE_BY_ID: "/pricing/update/:id",
  PRICING_UPDATE: "/pricing/update",

  PATIENTS: "/patients",
  PATIENT_BASIC_DETAIL_BY_ID: "/patient/basic-details/:patientId",
  PATIENT_BASIC_DETAIL: "/patient/basic-details",
  PATIENT_PRESCRIPTION_BY_ID: "/patient/prescriptions/:patientId",
  PATIENT_PRESCRIPTION: "/patient/prescriptions",
  PATIENT_VITAL_TRENDS_BY_ID: "/patient/vital-trends/:patientId",
  PATIENT_VITAL_TRENDS: "/patient/vital-trends",
  PATIENTS_APPOINTMENTS: "/patients/appointments",
  PATIENTS_PAYMENTS: "/patients/payments",
  PATIENTS_PAYMENTS_BY_ID: "/patients/payments/:patientId",
  PATIENTS_PAYMENTS_UPDATE: "/payment/update",

  REGISTRATIONS: "/registrations",
  REGISTRATION_CREATE: "/registration/create",
  REGISTRATION_SEARCH: "/registration/search",
  REGISTRATION_UPDATE_BY_ID: "/registration/update/:id",
  REGISTRATION_UPDATE: "/registration/update",
  REGISTRATION_APPOINTMENT_LIST: "/registrations/appointments",

  APPOINTMENTS: "/appointments",
  APPOINTMENT_CREATE: "/appointment/create",
  APPOINTMENT_UPDATE_BY_ID: "/appointment/update/:id",
  APPOINTMENT_UPDATE: "/appointment/update",

  NURSE_OPD: "/nurse-opd",
  NURSE_OPD_VITAL_BY_ID: "/nurse-opd/vital/:id",
  NURSE_OPD_VITAL: "/nurse-opd/vital",
  DOCTOR_OPD: "/doctor-opd",
  DOCTOR_OPD_CONSULTATION_BY_ID: "/doctor-opd/consultation/:id",
  DOCTOR_OPD_CONSULTATION: "/doctor-opd/consultation",
  PHARMACY: "/pharmacy",
  PAYMENTS: "/payments",

  ROSTER_MANAGEMENT: "/roster",

  CREATE_PAYMENT: "/payment/create",
  UPDATE_PAYMENT: "/payment/update",
  UPDATE_PAYMENT_BY_ID: "/payment/update/:paymentId",
  PAYMENT_INVOICE_MANAGEMENT: "/payment/invoice-mangement",

  CREATE_PHARMACY: "/pharmacy/create",
  UPDATE_PHARMACY: "/pharmacy/update",
  UPDATE_PHARMACY_BY_ID: "/pharmacy/update/:pharmacyId",
  PHARMACY_INVOICE_MANAGEMENT: "/pharmacy/invoice-mangement",

  UNAUTHORIZED: "/unauthorized",
  NOT_FOUND: "*",
};

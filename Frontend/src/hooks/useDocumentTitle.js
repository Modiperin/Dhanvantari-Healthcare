// hooks/useDocumentTitle.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const TITLE_MAP = {
  // Dashboard
  dashboard: "Dashboard",

  // Administration
  profiles: "Profiles Management",
  departments: "Departments Management",
  staff: "Staff Management",
  pricings: "Pricing Catalog Management",
  doctors: "Doctors Management",
  "doctor/create": "Add New Doctor",

  // Patient Registration
  "registration/create": "Patient Registration",
  registrations: "All Patients Registrations",
  "registrations/appointments": "All Patients Appointments",
  "registration/search": "Search Patient",

  // Roaster Management
  roster: "Roster Management",

  // Appointments
  appointments: "Appointments",
  appointment: "Appointment Details",

  // OPD
  "nurse-opd": "Nurse OPD",
  "nurse-opd/vital": "Nurse OPD Vital Collections",
  "doctor-opd": "Doctor OPD",
  "doctor-opd/consultation": "Patient Consultation",

  // Patients
  patients: "Patients",
  "patient/basic-details": "Patient Basic Details",
  "patient/prescriptions": "Patient Past Prescription",
  "patient/vital-trends": "Patient Vital Trends",
  "patients/payments": "Patient Payments",

  // Payment
  payments: "Payments",
  payment: "Payment Details",
  "payment/invoice-mangement": "Payment Invoice Management",
  "payment/create": "Payment Create",

  // Pharmacy
  pharmacy: "Pharmacy Management",
  "pharmacy/create": "Create Pharmacy",
  "pharmacy/invoice-mangement": "Pharmacy Invoice Management",
};

// Fallback title
const DEFAULT_TITLE = "Alligedge Healthcare";

export const useDocumentTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const pathParts = location.pathname
      .split("/")
      .filter((part) => part !== "");

    // Try to match the most specific path first
    let title = DEFAULT_TITLE;

    // Check full path first (for nested routes)
    const fullPath = pathParts.join("/");
    if (TITLE_MAP[fullPath]) {
      title = TITLE_MAP[fullPath];
    } else {
      // Check each segment from most to least specific
      for (let i = pathParts.length; i > 0; i--) {
        const testPath = pathParts.slice(0, i).join("/");
        if (TITLE_MAP[testPath]) {
          title = TITLE_MAP[testPath];
          break;
        }
      }
    }

    document.title = title;
  }, [location.pathname]);
};

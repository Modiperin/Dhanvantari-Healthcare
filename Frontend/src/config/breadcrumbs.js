// config/breadcrumbs.js
export const BREADCRUMB_CONFIG = {
  // Dashboard
  dashboard: {
    moduleName: "Dashboard",
    subModules: {},
  },

  // Administration
  profiles: {
    moduleName: "Administration",
    subModules: {
      "": "Profiles Management",
      create: "Create Profile",
      edit: "Edit Profile",
    },
  },
  departments: {
    moduleName: "Administration",
    subModules: {
      "": "Departments Management",
      create: "Create Department",
      edit: "Edit Department",
    },
  },
  staff: {
    moduleName: "Administration",
    subModules: {
      "": "Staff Management",
      create: "Create Staff",
      edit: "Edit Staff",
    },
  },
  pricings: {
    moduleName: "Administration",
    subModules: {
      "": "Pricing Catalog Management",
      create: "Create Pricing",
      edit: "Edit Pricing",
    },
  },
  doctors: {
    moduleName: "Administration",
    subModules: {
      "": "Doctors Management",
      create: "Add New Doctor",
      edit: "Edit Doctor",
    },
  },

  // Patient Registration
  registration: {
    moduleName: "Patient Registration",
    subModules: {
      "": "Patient Registration",
      create: "New Registration",
      search: "Search Patient",
      appointments: "Appointments",
    },
  },
  registrations: {
    moduleName: "Patient Registration",
    subModules: {
      "": "All Registrations",
      appointments: "All Appointments",
    },
  },

  // Add more routes as needed...
};

// Helper to humanize path segments
export const humanizeText = (text) => {
  return text
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

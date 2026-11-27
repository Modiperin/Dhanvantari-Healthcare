import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import HospitalLoader from "../components/loader/HospitalLoader";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTES } from "./helper";

const Login = lazy(() => import("../features/auth/pages/login"));
const NotFound = lazy(() => import("../features/common/NotFound"));
const Unauthorized = lazy(() => import("../features/common/Unauthorized"));
const SetUpPassword = lazy(() =>
  import("../features/dashboard/pages/SetUpPassword")
);

const AdminDashboard = lazy(() =>
  import("../features/dashboard/pages/AdminDashboard")
);

const Staff = lazy(() => import("../features/administration/pages/UserList"));

const CreateUpdateUser = lazy(() =>
  import("../features/administration/pages/CreateUpdateUser")
);

const ProfileAllocation = lazy(() =>
  import("../features/administration/pages/ProfileAllocation")
);

const CreateUpdateProfile = lazy(() =>
  import("../features/administration/pages/CreateUpdateProfile")
);

const Departments = lazy(() =>
  import("../features/administration/pages/Departments")
);

const DepartmentForms = lazy(() =>
  import("../features/administration/pages/DepartmentForms")
);

const PatientRegister = lazy(() =>
  import("../features/patient-register/pages/PatientRegister")
);

const PatientSearch = lazy(() =>
  import("../features/patient-register/pages/PatientSearch")
);

const AllRegistrations = lazy(() =>
  import("../features/patient-register/pages/AllRegistrations")
);

const PricingCatalog = lazy(() =>
  import("../features/administration/pages/PricingCatalog")
);

const PricingForms = lazy(() =>
  import("../features/administration/pages/PricingForms")
);

const Roaster = lazy(() => import("../features/roaster/pages/roaster"));
const NurseOPD = lazy(() => import("../features/OPD/pages/nurse"));

const VitalCollection = lazy(() =>
  import("../features/OPD/pages/vitalCollection")
);

const Appointments = lazy(() =>
  import("../features/appointment/pages/Appointments")
);

const CreateAppointment = lazy(() =>
  import("../features/appointment/pages/CreateAppointment")
);

const CreateUpdateDoctor = lazy(() =>
  import("../features/administration/pages/CreateUpdateDoctor")
);

const Doctors = lazy(() => import("../features/administration/pages/Doctors"));
const DoctorOPD = lazy(() => import("../features/OPD/pages/doctor"));

const AllPatientList = lazy(() =>
  import("../features/patientDashboard/pages/AllPatientList")
);

const Consultation = lazy(() => import("../features/OPD/pages/Consultation"));

const PatientPrescriptions = lazy(() =>
  import("../features/patientDashboard/pages/Prescriptions")
);

const VitalTrends = lazy(() =>
  import("../features/patientDashboard/pages/VitalTrends")
);

const PatientPayments = lazy(() =>
  import("../features/patientDashboard/pages/Payments")
);

const Dashboard = lazy(() => import("../features/dashboard"));

const PaymentOPD = lazy(() => import("../features/payment/pages/PaymentOPD"));
const CreateUpdatePayment = lazy(() =>
  import("../features/payment/pages/CreateUpdatePayment")
);
const PaymentInvoiceManagement = lazy(() =>
  import("../features/payment/pages/PaymentInvoiceManagement")
);

const PharmacyOPD = lazy(() =>
  import("../features/pharmacy/pages/PharmacyOPD")
);
const CreateUpdatePharmacy = lazy(() =>
  import("../features/pharmacy/pages/CreateUpdatePharmacy")
);

const PharmacyInvoiceManagement = lazy(() =>
  import("../features/pharmacy/pages/PharmacyInvoiceManagement")
);

const PatientDetails = lazy(() =>
  import("../features/patientDashboard/pages/PatientDetails")
);

const PrescriptionPreview = lazy(() =>
  import("../features/patientDashboard/pages/PrescriptionPreview")
);

const Voice = lazy(() => import("../features/TextToVoice/voice"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<HospitalLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/voice" element={<Voice />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />

        <Route path={ROUTES.SETUP_PASSWORD} element={<SetUpPassword />} />

        <Route
          path={ROUTES.PRESCRIPTION_PREVIEW}
          element={<PrescriptionPreview />}
        />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="onboard" element={<AdminDashboard />} />
        </Route>

        {/* User Routes */}
        <Route element={<UserLayout />}>
          {[ROUTES.DASHBOARD, "/launchpad", "/"].map((path) => (
            <Route
              key={path}
              path={path}
              element={
                // <ProtectedRoute module={"admin"} action={"view"}>
                <Dashboard />
                // </ProtectedRoute>
              }
            />
          ))}

          <Route
            path={ROUTES.STAFF_MANAGEMENT}
            element={
              <ProtectedRoute module={"admin"} action={"view"}>
                <Staff />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.STAFF_CREATE}
            element={
              <ProtectedRoute module={"admin"} action={"modify"}>
                <CreateUpdateUser />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.STAFF_UPDATE}
            element={
              <ProtectedRoute module={"admin"} action={"modify"}>
                <CreateUpdateUser />
              </ProtectedRoute>
            }
          />

          {/* PROFILE */}
          <Route
            path={ROUTES.PROFILES}
            element={
              <ProtectedRoute module={"admin"} action={"view"}>
                <ProfileAllocation />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PROFILE_CREATE}
            element={
              <ProtectedRoute module={"admin"} action={"modify"}>
                <CreateUpdateProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PROFILE_UPDATE_BY_ID}
            element={
              <ProtectedRoute module={"admin"} action={"view"}>
                <CreateUpdateProfile />
              </ProtectedRoute>
            }
          />

          {/* DEPARTMENT */}
          <Route
            path={ROUTES.DEPARTMENTS}
            element={
              <ProtectedRoute module={"admin"} action={"view"}>
                <Departments />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.DEPARTMENT_CREATE}
            element={
              <ProtectedRoute module={"admin"} action={"modify"}>
                <DepartmentForms />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.DEPARTMENT_UPDATE}
            element={
              <ProtectedRoute module={"admin"} action={"view"}>
                <DepartmentForms />
              </ProtectedRoute>
            }
          />

          {/* Pricing */}
          <Route
            path={ROUTES.PRICINGCATALOG}
            element={
              <ProtectedRoute module={"admin"} action={"view"}>
                <PricingCatalog />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PRICING_CREATE}
            element={
              <ProtectedRoute module={"admin"} action={"modify"}>
                <PricingForms />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PRICING_UPDATE_BY_ID}
            element={
              <ProtectedRoute module={"admin"} action={"view"}>
                <PricingForms />
              </ProtectedRoute>
            }
          />

          {/* DOCTOR */}
          <Route
            path={ROUTES.DOCTORS}
            element={
              <ProtectedRoute module={"admin"} action={"view"}>
                <Doctors />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.DOCTOR_CREATE}
            element={
              <ProtectedRoute module={"admin"} action={"view"}>
                <CreateUpdateDoctor />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.DOCTOR_UPDATE_BY_ID}
            element={
              <ProtectedRoute module={"admin"} action={"view"}>
                <CreateUpdateDoctor />
              </ProtectedRoute>
            }
          />

          {/* ROASTER */}
          <Route
            path={ROUTES.ROSTER_MANAGEMENT}
            element={
              <ProtectedRoute module={"patient"} action={"view"}>
                <Roaster />
              </ProtectedRoute>
            }
          />

          {/* REGISTRATION */}
          <Route
            path={ROUTES.REGISTRATION_CREATE}
            element={
              <ProtectedRoute module={"patient"} action={"modify"}>
                <PatientRegister />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.REGISTRATION_SEARCH}
            element={
              <ProtectedRoute module={"patient"} action={"modify"}>
                <PatientSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.REGISTRATIONS}
            element={
              <ProtectedRoute module={"patient"} action={"modify"}>
                <AllRegistrations />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.NURSE_OPD}
            element={
              <ProtectedRoute module={"nurse"} action={"view"}>
                <NurseOPD />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.NURSE_OPD_VITAL_BY_ID}
            element={
              <ProtectedRoute module={"nurse"} action={"view"}>
                <VitalCollection />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.DOCTOR_OPD}
            element={
              <ProtectedRoute module={"doctor"} action={"view"}>
                <DoctorOPD />
              </ProtectedRoute>
            }
          />

          {/* APPOINTMENTS */}
          <Route
            path={ROUTES.APPOINTMENTS}
            element={
              <ProtectedRoute module={"appointment"} action={"view"}>
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.APPOINTMENT_CREATE}
            element={
              <ProtectedRoute module={"appointment"} action={"modify"}>
                <CreateAppointment />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.REGISTRATION_APPOINTMENT_LIST}
            element={
              <ProtectedRoute module={"patient"} action={"view"}>
                <Appointments />
              </ProtectedRoute>
            }
          />

          {/* PATIENTS */}
          <Route
            path={ROUTES.PATIENTS}
            element={
              <ProtectedRoute module={"patient"} action={"view"}>
                <AllPatientList />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PATIENT_BASIC_DETAIL_BY_ID}
            element={
              <ProtectedRoute module={"patient"} action={"view"}>
                <PatientDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PATIENT_PRESCRIPTION_BY_ID}
            element={
              <ProtectedRoute module={"patient"} action={"view"}>
                <PatientPrescriptions />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PATIENT_VITAL_TRENDS_BY_ID}
            element={
              <ProtectedRoute module={"patient"} action={"view"}>
                <VitalTrends />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.PATIENTS_PAYMENTS_BY_ID}
            element={
              <ProtectedRoute module={"patient"} action={"view"}>
                <PatientPayments />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.DOCTOR_OPD_CONSULTATION_BY_ID}
            element={
              <ProtectedRoute module={"doctor"} action={"view"}>
                <Consultation />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.PAYMENTS}
            element={
              <ProtectedRoute module={"cashier"} action={"view"}>
                <PaymentOPD />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.CREATE_PAYMENT}
            element={
              <ProtectedRoute module={"cashier"} action={"view"}>
                <CreateUpdatePayment />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.UPDATE_PAYMENT_BY_ID}
            element={
              <ProtectedRoute module={"cashier"} action={"view"}>
                <CreateUpdatePayment />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PAYMENT_INVOICE_MANAGEMENT}
            element={
              <ProtectedRoute module={"cashier"} action={"view"}>
                <PaymentInvoiceManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PHARMACY}
            element={
              <ProtectedRoute module={"pharmacy"} action={"view"}>
                <PharmacyOPD />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.CREATE_PHARMACY}
            element={
              <ProtectedRoute module={"pharmacy"} action={"view"}>
                <CreateUpdatePharmacy />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PHARMACY_INVOICE_MANAGEMENT}
            element={
              <ProtectedRoute module={"pharmacy"} action={"view"}>
                <PharmacyInvoiceManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.UPDATE_PHARMACY_BY_ID}
            element={
              <ProtectedRoute module={"cashier"} action={"view"}>
                <CreateUpdatePharmacy />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

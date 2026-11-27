import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import hospitalOnboardingReducer from "../slices/hospitalOnboardingSlice";
import profileManagementReducer from "../slices/profileSlice";
import staffManagementReducer from "../slices/staffSlice";
import departmentManagementReducer from "../slices/departmentSlice";
import doctorManagementReducer from "../slices/doctorSlice";
import patientManagementReducer from "../slices/patientSlice";
import pricingManagementReducer from "../slices/pricingSlice";
import roasterReducer from "../slices/roasterSlice";
import patientVisit from "../slices/patientVisitSlice";
import appointment from "../slices/appointmentSlice";
import nurseOPDSlice from "../slices/nurseOPD";
import consultationSlice from "../slices/consultationSlice";
import paymentSlice from "../slices/paymentSlice";
import pharmacySlice from "../slices/pharmacySlice";
import chatbotSlice from "../slices/chatbotSlice";
import dashboardSlice from "../slices/dashboardSlice";
import topBarReducer from "../slices/topBarSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    hospitalOnboarding: hospitalOnboardingReducer,
    profileManagement: profileManagementReducer,
    staffManagement: staffManagementReducer,
    departmentManagement: departmentManagementReducer,
    doctorManagement: doctorManagementReducer,
    patientManagement: patientManagementReducer,
    pricingManagement: pricingManagementReducer,
    roaster: roasterReducer,
    appointmentManagement: appointment,
    patientVisit: patientVisit,
    nurseOPD: nurseOPDSlice,
    consultation: consultationSlice,
    payment: paymentSlice,
    pharmacy: pharmacySlice,
    chatbot: chatbotSlice,
    dashboard: dashboardSlice,
    topBar: topBarReducer,
  },
});

export default store;

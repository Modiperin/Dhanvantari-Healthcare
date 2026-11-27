import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { getDataFromCookies } from "../services/cookies";
import {
  getSessionData,
  setDataInSessionStorage,
} from "../services/sessionStorage";
import extraReducersFromHospitalOnboarding from "./hospitalOnboardingExtraReducer";
import { callAPI } from "../services/callAPI";
import { Roles } from "../utils/roles";

const initialState = {
  currentStep: parseInt(getSessionData("cs") || "1"),
  steps: [
    {
      id: 1,
      title: "Basic Details",
    },
    {
      id: 2,
      title: "Department Setup",
    },
    {
      id: 3,
      title: "Doctors Details",
    },
    {
      id: 4,
      title: "Review & Submit",
    },
  ],
  completedSteps: JSON.parse(getSessionData("state") || "[]"), // Stores IDs of steps that have been successfully completed/validated
  formData: {
    basicDetails: {
      name: "",
      pincode: "",
      digiPin: "",
      address: "",
      email: "",
      optionalEmail: "",
      phoneNo: "",
      optionalPhoneNo: "",
      file: "", // Assuming this is for file upload, might store a URL or filename
    },
    departments: [], // Array of { name: string, code: string, active: boolean }
    doctors: [], // Array of doctor objects
  },
  fetchBasicDetailApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
  signUpHospitalApi: {
    status: null,
    isLoading: false,
    error: null,
    data: null,
  },
  createDeptApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
  deleteDeptApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
  createDoctorApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
  deleteDoctorApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
  // 🏥 Hospital Setup
  welcomeToHospitalApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
  verifyTokenApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
  setUpPasswordApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },

  departmentsStatus: null,
  departmentsIsLoading: false,
  doctorsStatus: null,
  doctorsIsLoading: false,
};

export const fetchBasicDetails = createAsyncThunk(
  "/auth/fetchHospitalBasicDetails",
  async () => {
    const res = await callAPI("/hospital/profile", {
      token: getDataFromCookies("hospitalToken"),
    });
    return res.data;
  }
);

export const signUpHospital = createAsyncThunk(
  "auth/signUpHospital",
  async (data) => {
    const res = await callAPI("/auth/signup", {
      method: "POST",
      data: {
        ...data,
        from: "onboarding",
      },
    });
    return res.data;
  }
);

export const fetchDepartments = createAsyncThunk(
  "department/fetchDepartments",
  async () => {
    const res = await callAPI("department/list", {
      token: getDataFromCookies("hospitalToken"),
    });
    return res.data;
  }
);
export const fetchDoctors = createAsyncThunk(
  "doctor/fetchDoctors",
  async () => {
    const res = await callAPI(`/staff/list?role=${Roles.doctor}`, {
      token: getDataFromCookies("hospitalToken"),
    });
    return res.data;
  }
);

export const createDepartment = createAsyncThunk(
  "department/createDepartment",
  async (data) => {
    const res = await callAPI("department/create", {
      method: "POST",
      data,
      token: getDataFromCookies("hospitalToken"),
    });
    return res.data;
  }
);

export const deleteDepartment = createAsyncThunk(
  "department/deleteDepartment",
  async (id) => {
    const res = await callAPI(`/department/delete/${id}`, {
      method: "DELETE",
      token: getDataFromCookies("hospitalToken"),
    });
    return res.data;
  }
);

export const createDoctor = createAsyncThunk(
  "doctor/createDoctor",
  async (data) => {
    const res = await callAPI("/staff/create", {
      method: "POST",
      data,
      token: getDataFromCookies("hospitalToken"),
    });
    return res.data;
  }
);

export const deleteDoctor = createAsyncThunk(
  "doctor/deleteDoctor",
  async (id) => {
    const res = await callAPI(`/staff/delete/${id}`, {
      method: "DELETE",
      token: getDataFromCookies("hospitalToken"),
    });
    return res.data;
  }
);

export const welcomeToHospital = createAsyncThunk(
  "hospital/welcomeToHospital",
  async (id) => {
    const res = await callAPI(`/hospital/welcome/${id}`, {
      method: "POST",
      token: getDataFromCookies("hospitalToken"),
    });
    return res.data;
  }
);

export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (token) => {
    const res = await callAPI(`/hospital/verify-setup-token?token=${token}`);
    return res.data;
  }
);

export const setUpPassword = createAsyncThunk(
  "auth/setUpPassword",
  async (data) => {
    const res = await callAPI(`/hospital/setup-password?ref=admin`, {
      method: "POST",
      data,
      token: getDataFromCookies("hospitalToken"),
    });
    return res.data;
  }
);

export const hospitalOnboardingSlice = createSlice({
  name: "hospitalOnboarding",
  initialState,
  reducers: {
    // --- Step Navigation Reducers ---
    goToNextStep: (state) => {
      // Add the current step to completedSteps before moving forward
      if (!state.completedSteps.includes(state.currentStep)) {
        state.completedSteps.push(state.currentStep);
        state.completedSteps.sort((a, b) => a - b); // Keep it sorted
      }
      state.currentStep += 1;
      setDataInSessionStorage("cs", state.currentStep);
    },
    goToPreviousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
        setDataInSessionStorage("cs", state.currentStep);
      }
    },
    goToSpecificStep: (state, action) => {
      const targetStep = action.payload;
      // console.log({targetStep});
      // Allow navigating back freely, or navigating forward only to completed steps
      // You might want to refine this logic based on your exact validation requirements
      if (
        targetStep < state.currentStep ||
        state.completedSteps.includes(targetStep - 1)
      ) {
        state.currentStep = targetStep;
        setDataInSessionStorage("cs", state.currentStep);
      } else {
        toast.error(
          `Please fill up ${
            state.steps.find((step) => step.id === state.currentStep).title
          } first.`
        );
      }
    },
    markStepCompleted: (state, action) => {
      const stepId = action.payload;
      if (!state.completedSteps.includes(stepId)) {
        state.completedSteps.push(stepId);
        state.completedSteps.sort((a, b) => a - b);
        setDataInSessionStorage("state", JSON.stringify(state.completedSteps));
      }
    },
    resetCreateDeptStatus(state) {
      state.createDeptApi = {
        status: null,
        isLoading: false,
        data: null,
        error: null,
      };
    },
    resetDeleteDeptStatus(state) {
      state.deleteDeptApi = {
        status: null,
        isLoading: false,
        data: null,
        error: null,
      };
    },
    resetCreateDoctorStatus(state) {
      state.createDoctorApi = {
        status: null,
        isLoading: false,
        data: null,
        error: null,
      };
    },
    resetDeleteDoctorStatus(state) {
      state.deleteDoctorApi = {
        status: null,
        isLoading: false,
        data: null,
        error: null,
      };
    },
    resetSignupHospitalStatus(state) {
      state.signUpHospitalApi = {
        status: null,
        isLoading: false,
        data: null,
        error: null,
      };
    },
    resetApiState(state, action) {
      const key = action.payload;
      if (state[key]) {
        state[key] = {
          status: null,
          isLoading: false,
          data: null,
          error: null,
        };
      }
    },
  },
  extraReducers: extraReducersFromHospitalOnboarding,
});

export const {
  goToNextStep,
  goToPreviousStep,
  goToSpecificStep,
  markStepCompleted,
  resetCreateDeptStatus,
  resetCreateDoctorStatus,
  resetDeleteDeptStatus,
  resetDeleteDoctorStatus,
  resetSignupHospitalStatus,
  resetApiState,
} = hospitalOnboardingSlice.actions;

export default hospitalOnboardingSlice.reducer;

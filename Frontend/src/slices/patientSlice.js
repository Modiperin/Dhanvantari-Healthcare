import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callAPI } from "../services/callAPI";
import { getDefaultApiState, handleApiState } from "./helper";

const initialState = {
  getPatientListApi: getDefaultApiState(),
  viewPatientByIdApi: getDefaultApiState(),
  createPatientApi: getDefaultApiState(),
  updatePatientApi: getDefaultApiState(),
  deletePatientApi: getDefaultApiState(),
  getPatientMedicalHistoryApi: getDefaultApiState(),
  getPatientPrescriptionsApi: getDefaultApiState(),
  viewPrescriptionsApi: getDefaultApiState(),
  patientVitalsListApi: getDefaultApiState(),
};

export const getPatientList = createAsyncThunk(
  "patient/list",
  async ({ query = "", page = 1, searchBy = "" } = {}) => {
    const q = query ? `&q=${query}` : "";
    const s = searchBy && searchBy !== "all" ? `&searchBy=${searchBy}` : "";
    const res = await callAPI(`/patient/list?page=${page}${q}${s}`);
    return res.data;
  }
);

export const viewPatientById = createAsyncThunk(
  `patient/get`,
  async ({ id, from = "reg" } = {}) => {
    const res = await callAPI(`/patient/view/${id}?from=${from}`);
    return res.data;
  }
);

export const createPatient = createAsyncThunk(
  `patient/create`,
  async (data) => {
    const res = await callAPI(`/patient/create`, {
      method: "POST",
      data,
    });
    return res.data;
  }
);

export const updatePatient = createAsyncThunk(
  `patient/update`,
  async ({ id, data }) => {
    // console.log({ id, data });
    const res = await callAPI(`/patient/update/${id}`, {
      method: "PUT",
      data,
    });
    return res.data;
  }
);
export const deletePatient = createAsyncThunk(`patient/delete`, async (id) => {
  const res = await callAPI(`/patient/delete/${id}`, {
    method: "DELETE",
  });
  return res.data;
});

export const getPatientMedicalHistory = createAsyncThunk(
  `patient/view/medicalHistory`,
  async (id) => {
    const res = await callAPI(`/patient/view/medicalHistory/${id}`);
    return res.data;
  }
);

export const getPatientPrescriptions = createAsyncThunk(
  "patient/prescriptions/list",
  async ({ patientId }) => {
    const res = await callAPI(
      `/patient/prescriptions/list?patientId=${patientId}`
    );
    return res.data;
  }
);

export const viewPrescriptions = createAsyncThunk(
  "patient/prescriptions/view",
  async ({ visitId }) => {
    const res = await callAPI(
      `/visit/prescription/view/${visitId}?from=preview`
    );
    return res.data;
  }
);

export const getPatientVitalsList = createAsyncThunk(
  "patient/vitals/list",
  async ({ patientId, page }) => {
    const res = await callAPI(`/vital/list/${patientId}?page=${page}`);
    return res.data;
  }
);

export const patientSlice = createSlice({
  name: "patientManagement",
  initialState,
  reducers: {
    resetCreatePatientStatus(state) {
      state.createPatientApi = getDefaultApiState();
    },
    resetUpdatePatientStatus(state) {
      state.updatePatientApi = getDefaultApiState();
    },
    resetViewPatientByIdStatus(state) {
      state.viewPatientByIdApi = getDefaultApiState();
    },
    resetViewMedicalHistryById(state) {
      state.getPatientMedicalHistoryApi = getDefaultApiState();
    },
    resetDeletePatientStatus(state) {
      state.deletePatientApi = {
        status: null,
        isLoading: false,
        data: null,
        error: null,
      };
    },
    resetPatientPrescriptionsStatus(state) {
      state.getPatientPrescriptionsApi = getDefaultApiState();
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
  extraReducers: (builder) => {
    handleApiState(builder, getPatientList, "getPatientListApi");
    handleApiState(
      builder,
      getPatientMedicalHistory,
      "getPatientMedicalHistoryApi"
    );
    handleApiState(builder, createPatient, "createPatientApi");
    handleApiState(builder, viewPatientById, "viewPatientByIdApi");
    handleApiState(builder, updatePatient, "updatePatientApi");
    handleApiState(builder, deletePatient, "deletePatientApi");

    //get patient prescriptions
    handleApiState(
      builder,
      getPatientPrescriptions,
      "getPatientPrescriptionsApi"
    );
    //view prescriptions
    handleApiState(builder, viewPrescriptions, "viewPrescriptionsApi");
    //get patient vitals list
    handleApiState(builder, getPatientVitalsList, "patientVitalsListApi");
  },
});

export const {
  resetCreatePatientStatus,
  resetUpdatePatientStatus,
  resetDeletePatientStatus,
  resetViewPatientByIdStatus,
  resetPatientPrescriptionsStatus,
  resetApiState,
} = patientSlice.actions;
export default patientSlice.reducer;

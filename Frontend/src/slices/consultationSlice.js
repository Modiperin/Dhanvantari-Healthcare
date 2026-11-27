import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callAPI } from "../services/callAPI";
import { getDefaultApiState, handleApiState } from "./helper";
import { HEALTHCARE_BASE_API_KEY } from "../utils/config";

const initialState = {
  createConsultationApi: getDefaultApiState(),
  updateConsultationApi: getDefaultApiState(),
  getDiagnosisListApi: getDefaultApiState(),
  getMedicationsListApi: getDefaultApiState(),
  getLabTestListApi: getDefaultApiState(),
  createDiagnosisApi: getDefaultApiState(),
  createMedicationApi: getDefaultApiState(),
  createLabTestApi: getDefaultApiState(),
  viewConsultationApi: getDefaultApiState(),
  getSymptomsListApi: getDefaultApiState(),
};

export const createConsultation = createAsyncThunk(
  `consultation/create`,
  async (data) => {
    const res = await callAPI(`/consultation/create`, {
      method: "POST",
      data,
    });
    return res.data;
  }
);
export const updateConsultation = createAsyncThunk(
  `consultation/update`,
  async ({ id, data }) => {
    const res = await callAPI(`/consultation/update/${id}`, {
      method: "PUT",
      data,
    });
    return res.data;
  }
);

export const getDiagnosisList = createAsyncThunk(
  `diagnosis/search`,
  async ({ query = "" } = {}) => {
    const q = query ? `?q=${query}` : "";
    const res = await callAPI(`/diagnosis/search${q}`, {
      headers: {
        "x-api-key": HEALTHCARE_BASE_API_KEY,
      },
    });
    return res.data;
  }
);
export const getMedicationsList = createAsyncThunk(
  `medicine/search`,
  async ({ query = "" } = {}) => {
    const q = query ? `?q=${query}` : "";
    const res = await callAPI(`/medicine/search${q}`, {
      headers: {
        "x-api-key": HEALTHCARE_BASE_API_KEY,
      },
    });
    return res.data;
  }
);
export const getLabTestList = createAsyncThunk(
  `labtest/search`,
  async ({ query = "" } = {}) => {
    const q = query ? `?q=${query}` : "";
    const res = await callAPI(`/labtest/search${q}`, {
      headers: {
        "x-api-key": HEALTHCARE_BASE_API_KEY,
      },
    });
    return res.data;
  }
);

export const createDiagnosis = createAsyncThunk(
  `consultation/diagnosis/create`,
  async ({ hospitalId, data }) => {
    const res = await callAPI(`/consultation/diagnosis/create/${hospitalId}`, {
      method: "POST",
      data,
    });
    return res.data;
  }
);

export const createMedication = createAsyncThunk(
  `consultation/medication/create`,
  async ({ hospitalId, data }) => {
    const res = await callAPI(`/consultation/medication/create/${hospitalId}`, {
      method: "POST",
      data,
    });
    return res.data;
  }
);

export const createLabTest = createAsyncThunk(
  `consultation/lab/create`,
  async ({ hospitalId, data }) => {
    const res = await callAPI(`/consultation/lab/create/${hospitalId}`, {
      method: "POST",
      data,
    });
    return res.data;
  }
);

export const viewConsultationByVisitId = createAsyncThunk(
  `consultation/view`,
  async (visitId) => {
    const res = await callAPI(`/consultation/view?visitId=${visitId}`);
    return res.data;
  }
);

export const getSymptomsList = createAsyncThunk(
  `symptoms/search`,
  async ({ query = "" } = {}) => {
    const q = query ? `?q=${query}` : "";
    const res = await callAPI(`/symptoms/search${q}`, {
      headers: {
        "x-api-key": HEALTHCARE_BASE_API_KEY,
      },
    });
    return res.data;
  }
);

export const consultationSlice = createSlice({
  name: "consultation",
  initialState,
  reducers: {
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
    handleApiState(builder, createConsultation, "createConsultationApi");
    handleApiState(builder, updateConsultation, "updateConsultationApi");
    handleApiState(builder, getDiagnosisList, "getDiagnosisListApi");
    handleApiState(builder, getMedicationsList, "getMedicationsListApi");
    handleApiState(builder, getLabTestList, "getLabTestListApi");
    handleApiState(builder, createDiagnosis, "createDiagnosisApi");
    handleApiState(builder, createMedication, "createMedicationApi");
    handleApiState(builder, createLabTest, "createLabTestApi");
    handleApiState(builder, viewConsultationByVisitId, "viewConsultationApi");
    handleApiState(builder, getSymptomsList, "getSymptomsListApi");
  },
});

export const { resetApiState } = consultationSlice.actions;

export default consultationSlice.reducer;

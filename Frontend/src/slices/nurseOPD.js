import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callAPI } from "../services/callAPI";
import { splitDate } from "../utils/dateAndTime";
import { getDefaultApiState, handleApiState } from "./helper";
import { successToastMessage } from "../utils/toastMessage";
import { buildQueryString } from "../utils/common";

const initialState = {
  opdListApi: getDefaultApiState(),
  viewPatientVisitApi: getDefaultApiState(),
  updateVisitApi: getDefaultApiState(),
  updateVitalDetailsApi: getDefaultApiState(),
  createVitalApi: getDefaultApiState(),
  addMedicalHistoryApi: getDefaultApiState(),
  sendPrescriptionWhatsappApi: getDefaultApiState(),
};

export const getPatientQ = createAsyncThunk(
  "nurseOPD/list",
  async ({
    from = "",
    query = "",
    page = 1,
    startDate,
    endDate,
    vitalStatus,
    contStatus,
    searchBy,
  } = {}) => {
    let q = buildQueryString({
      q: query,
      page,
      vitalStatus,
      contStatus,
      from,
    });

    let s = searchBy ? `&searchBy=${searchBy}` : "";

    if (startDate && endDate) {
      q += `&startDate=${splitDate(startDate)}&endDate=${splitDate(endDate)}`;
    }

    const res = await callAPI(`/opd/list?${q}${s}`);
    return res.data;
  }
);

export const getPatientVisitDetails = createAsyncThunk(
  "nurseOPD/visit/view",
  async ({ id }) => {
    const res = await callAPI(`/visit/view/${id}`);
    return res.data;
  }
);

export const updatePatientVitalDetails = createAsyncThunk(
  "nurseOPD/vital/update",
  async ({ id, data }) => {
    const res = await callAPI(`/vital/update/${id}`, { method: "PUT", data });
    return res.data;
  }
);

export const createPatientVital = createAsyncThunk(
  "nurseOPD/vital/create",
  async ({ data }) => {
    const res = await callAPI(`/vital/create`, { method: "POST", data });
    return res.data;
  }
);

export const addPatientMedicalHistory = createAsyncThunk(
  "nurseOPD/patient/add/history",
  async ({ id, data }) => {
    const res = await callAPI(`/patient/add/history/${id}`, {
      method: "POST",
      data,
    });
    return res.data;
  }
);

export const updateVisitDetails = createAsyncThunk(
  "nurseOPD/visit/update",
  async ({ id, data }) => {
    const res = await callAPI(`/visit/update/${id}`, { method: "PUT", data });
    return res.data;
  }
);

export const sendPrescriptionWhatsapp = createAsyncThunk(
  "nurseOPD/prescription/sendWhatsapp",
  async ({ id, patientId }) => {
    const res = await callAPI(
      `/consultation/send/${id}?patientId=${patientId}`,
      {
        method: "POST",
      }
    );
    return res.data;
  }
);

export const nurseOPDSlice = createSlice({
  name: "patientVisitManagement",
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
    addNewPatient(state, action) {
      const newPatient = action.payload;

      const responseData = state.opdListApi?.data?.response;

      // Guard clause: if response or pagination not available, skip
      if (!responseData || responseData.currentPage !== 1) return;

      const pageLimit = responseData.limit || 10;
      const existingList = responseData.list || [];

      // Create a new list with the new patient added
      const updatedList = [...existingList, newPatient].sort((a, b) => {
        // Sort by priority descending
        if (b.priority !== a.priority) return a.priority - b.priority;
        // If same priority, sort by createdAt descending
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

      const newTopList = updatedList.slice(0, pageLimit);

      // Compare current vs new top list to detect change
      const isChanged =
        JSON.stringify(newTopList) !== JSON.stringify(existingList);

      if (isChanged) {
        responseData.list = newTopList;
        responseData.totalRecords = (responseData.totalRecords || 0) + 1;
        successToastMessage("New patient added to the queue.");
      }
    },

    endVisit(state, action) {
      const removedVisit = action.payload;
      const responseData = state.opdListApi?.data?.response;
      const oldList = responseData?.list || [];
      const isExist = oldList.find((data) => removedVisit === data?.visitId);
      if (isExist) {
        const newList = oldList.filter(
          (data) => data?.visitId !== removedVisit
        );
        responseData.list = newList;
        responseData.totalRecords = (responseData.totalRecords || 0) - 1;
        successToastMessage("New patient added to the queue.");
      }
    },
  },
  extraReducers: (builder) => {
    handleApiState(builder, getPatientQ, "opdListApi");

    handleApiState(builder, getPatientVisitDetails, "viewPatientVisitApi");

    handleApiState(builder, updatePatientVitalDetails, "updateVitalDetailsApi");

    handleApiState(builder, createPatientVital, "createVitalApi");

    handleApiState(builder, addPatientMedicalHistory, "addMedicalHistoryApi");

    handleApiState(builder, updateVisitDetails, "updateVisitApi");

    handleApiState(
      builder,
      sendPrescriptionWhatsapp,
      "sendPrescriptionWhatsappApi"
    );
  },
});

export const { resetApiState, addNewPatient, endVisit } = nurseOPDSlice.actions;

export default nurseOPDSlice.reducer;

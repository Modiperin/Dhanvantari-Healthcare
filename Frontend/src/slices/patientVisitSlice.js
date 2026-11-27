import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callAPI } from "../services/callAPI";
import { splitDate } from "../utils/dateAndTime";
import { getDefaultApiState, handleApiState } from "./helper";

const initialState = {
  getPatientVisitListApi: getDefaultApiState(),
  viewPatientVisitApi: getDefaultApiState(),
  createPatientVisitApi: getDefaultApiState(),
  updatePatientVisitApi: getDefaultApiState(),
  deletePatientVisitApi: getDefaultApiState(),
};

export const getPatientVisitList = createAsyncThunk(
  "patientVisit/list",
  async ({ query = "", page = 1, searchBy = "", startDate, endDate } = {}) => {
    let q = query ? `&q=${query}` : "";
    let s = searchBy && searchBy !== "all" ? `&searchBy=${searchBy}` : "";
    if (startDate && endDate) {
      q += `&startDate=${splitDate(startDate)}&endDate=${splitDate(endDate)}`;
    }
    const res = await callAPI(`/visit/list?page=${page}${q}${s}`);
    return res.data;
  }
);

export const getPatientVisitById = createAsyncThunk(
  `patientVisit/get`,
  async (id) => {
    const res = await callAPI(`/visit/view/${id}`);
    return res.data;
  }
);

export const createPatientVisit = createAsyncThunk(
  `patientVisit/create`,
  async (data) => {
    const res = await callAPI(`/visit/create`, {
      method: "POST",
      data,
    });
    return res.data;
  }
);

export const updatePatientVisit = createAsyncThunk(
  `patientVisit/update`,
  async ({ id, data }) => {
    // console.log({ id, data });
    const res = await callAPI(`/visit/update/${id}`, {
      method: "PUT",
      data,
    });
    return res.data;
  }
);
export const deletePatientVisit = createAsyncThunk(
  `patientVisit/delete`,
  async (id) => {
    const res = await callAPI(`/visit/delete/${id}`, {
      method: "DELETE",
    });
    return res.data;
  }
);

export const patientVisitSlice = createSlice({
  name: "patientVisit",
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
    handleApiState(builder, getPatientVisitList, "getPatientVisitListApi");
    handleApiState(builder, createPatientVisit, "createPatientVisitApi");
    handleApiState(builder, getPatientVisitById, "viewPatientVisitApi");
    handleApiState(builder, updatePatientVisit, "updatePatientVisitApi");
    handleApiState(builder, deletePatientVisit, "deletePatientVisitApi");
  },
});

export const { resetApiState } = patientVisitSlice.actions;
export default patientVisitSlice.reducer;

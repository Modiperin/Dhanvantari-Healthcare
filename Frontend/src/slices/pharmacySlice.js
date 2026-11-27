import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callAPI } from "../services/callAPI";
import { getDefaultApiState, handleApiState } from "./helper";
import { splitDate } from "../utils/dateAndTime";
import { buildQueryString } from "../utils/common";

const initialState = {
  createPharmacyApi: getDefaultApiState(),
  updatePharmacyApi: getDefaultApiState(),
  getPharmaciesApi: getDefaultApiState(),
  viewPharmacyApi: getDefaultApiState(),
  patientPharmaciesApi: getDefaultApiState(),
  patientPharmaciesCardApi: getDefaultApiState(),
  pharmacyLogsApi: getDefaultApiState(),
  getDuesDetailsApi: getDefaultApiState(),
  pharmacyInvoiceCardApi: getDefaultApiState(),
  pharmacyInvoiceListApi: getDefaultApiState(),
};

export const createPharmacy = createAsyncThunk(
  `pharmacy/create`,
  async (data) => {
    const res = await callAPI(`/pharmacy/create`, {
      method: "POST",
      data,
    });
    return res.data;
  }
);

export const updatePharmacy = createAsyncThunk(
  `pharmacy/update`,
  async ({ id, data }) => {
    const res = await callAPI(`/pharmacy/update/${id}`, {
      method: "PUT",
      data,
    });
    return res.data;
  }
);

export const getPharmacies = createAsyncThunk(
  `pharmacy/list`,
  async ({ query = "", page = 1, startDate, endDate, searchBy = "" } = {}) => {
    let q = query ? `&q=${query}` : "";
    let s = searchBy ? `&searchBy=${searchBy}` : "";
    if (startDate && endDate) {
      q += `&startDate=${splitDate(startDate)}&endDate=${splitDate(endDate)}`;
    }
    const res = await callAPI(`/pharmacy/list?page=${page}${q}${s}`);
    return res.data;
  }
);

export const viewPharmacy = createAsyncThunk(
  `pharmacy/viewPharmacy`,
  async ({ pharmacyId, visitId, patientId }) => {
    const q = pharmacyId
      ? `pharmacyId=${pharmacyId}`
      : `visitId=${visitId}&patientId=${patientId}`;
    const res = await callAPI(`/pharmacy/view?${q}`);
    return res.data;
  }
);

export const getInvoiceCards = createAsyncThunk(
  `pharmacy/card/invoice`,
  async ({ query = "", page = 1, startDate, endDate, searchBy = "" } = {}) => {
    let q = buildQueryString({
      q: query,
      page,
    });
    if (startDate && endDate) {
      q += `&startDate=${splitDate(startDate)}&endDate=${splitDate(endDate)}`;
    }
    if (searchBy.trim()) {
      q += `&searchBy=${searchBy}`;
    }
    const res = await callAPI(`/pharmacy/card/invoice?${q}`);
    return res.data;
  }
);

export const getInvoiceLists = createAsyncThunk(
  `pharmacy/list/invoice`,
  async ({ query = "", page = 1, startDate, endDate, searchBy = "" } = {}) => {
    let q = buildQueryString({
      q: query,
      page,
    });
    if (startDate && endDate) {
      q += `&startDate=${splitDate(startDate)}&endDate=${splitDate(endDate)}`;
    }
    if (searchBy.trim()) {
      q += `&searchBy=${searchBy}`;
    }

    const res = await callAPI(`/pharmacy/list/invoice?${q}`);
    return res.data;
  }
);

export const pharmacySlice = createSlice({
  name: "pharmacy",
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
    handleApiState(builder, createPharmacy, "createPharmacyApi");
    handleApiState(builder, updatePharmacy, "updatePharmacyApi");
    handleApiState(builder, getPharmacies, "getPharmaciesApi");
    handleApiState(builder, viewPharmacy, "viewPharmacyApi");
    handleApiState(builder, getInvoiceLists, "pharmacyInvoiceListApi");
    handleApiState(builder, getInvoiceCards, "pharmacyInvoiceCardApi");
  },
});

export const { resetApiState } = pharmacySlice.actions;

export default pharmacySlice.reducer;

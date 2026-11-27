import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callAPI } from "../services/callAPI";
import { getDefaultApiState, handleApiState } from "./helper";
import { splitDate } from "../utils/dateAndTime";
import { buildQueryString } from "../utils/common";

const initialState = {
  createPaymentApi: getDefaultApiState(),
  updatePaymentApi: getDefaultApiState(),
  getPaymentApi: getDefaultApiState(),
  viewPaymentApi: getDefaultApiState(),
  patientPaymentsApi: getDefaultApiState(),
  patientPaymentsCardApi: getDefaultApiState(),
  paymentLogsApi: getDefaultApiState(),
  getDuesDetailsApi: getDefaultApiState(),
  paymentInvoiceCardApi: getDefaultApiState(),
  paymentInvoiceListApi: getDefaultApiState(),
};

export const createPayment = createAsyncThunk(
  `payment/create`,
  async (data) => {
    const res = await callAPI(`/payment/create`, {
      method: "POST",
      data,
    });
    return res.data;
  }
);

export const updatePayment = createAsyncThunk(
  `payment/update`,
  async ({ id, data }) => {
    const res = await callAPI(`/payment/update/${id}`, {
      method: "PUT",
      data,
    });
    return res.data;
  }
);

export const getPayments = createAsyncThunk(
  `payment/list`,
  async ({ query = "", page = 1, startDate, endDate, searchBy = "" } = {}) => {
    let q = query ? `&q=${query}` : "";
    let s = searchBy ? `&searchBy=${searchBy}` : "";
    if (startDate && endDate) {
      q += `&startDate=${splitDate(startDate)}&endDate=${splitDate(endDate)}`;
    }
    const res = await callAPI(`/payment/list?page=${page}${q}${s}`);
    return res.data;
  }
);

export const viewPayment = createAsyncThunk(
  `payment/viewPayment`,
  async ({ paymentId, visitId, patientId }) => {
    const q = paymentId
      ? `paymentId=${paymentId}`
      : `visitId=${visitId}&patientId=${patientId}`;
    const res = await callAPI(`/payment/view?${q}`);
    return res.data;
  }
);

export const getPatientPayments = createAsyncThunk(
  `payment/patient/get`,
  async ({ patientId, query, page, startDate, endDate }) => {
    let q = buildQueryString({
      q: query,
      page,
    });

    if (startDate && endDate) {
      q += `&startDate=${splitDate(startDate)}&endDate=${splitDate(endDate)}`;
    }

    const res = await callAPI(`/payment/list/${patientId}?${q}`);
    return res.data;
  }
);

export const getPatientPaymentsCard = createAsyncThunk(
  `payment/patient/card`,
  async ({ patientId }) => {
    const res = await callAPI(`/payment/card/${patientId}`);
    return res.data;
  }
);

export const getPaymentLogs = createAsyncThunk(
  `payment/logs`,
  async ({ paymentId }) => {
    const res = await callAPI(`/payment/logs/${paymentId}`);
    return res.data;
  }
);

export const getDuesDetails = createAsyncThunk(
  `view/dues`,
  async (patientId) => {
    const res = await callAPI(`payment/view/dues/${patientId}`);
    return res.data;
  }
);
export const getInvoiceCards = createAsyncThunk(
  `payment/card/invoice`,
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
    const res = await callAPI(`/payment/card/invoice?${q}`);
    return res.data;
  }
);

export const getInvoiceLists = createAsyncThunk(
  `payment/list/invoice`,
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

    const res = await callAPI(`/payment/list/invoice?${q}`);
    return res.data;
  }
);

export const paymentSlice = createSlice({
  name: "payment",
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
    handleApiState(builder, createPayment, "createPaymentApi");
    handleApiState(builder, updatePayment, "updatePaymentApi");
    handleApiState(builder, getPayments, "getPaymentApi");
    handleApiState(builder, viewPayment, "viewPaymentApi");
    handleApiState(builder, getPatientPayments, "patientPaymentsApi");
    handleApiState(builder, getPatientPaymentsCard, "patientPaymentsCardApi");
    handleApiState(builder, getPaymentLogs, "paymentLogsApi");
    handleApiState(builder, getDuesDetails, "getDuesDetailsApi");
    handleApiState(builder, getInvoiceLists, "paymentInvoiceListApi");
    handleApiState(builder, getInvoiceCards, "paymentInvoiceCardApi");
  },
});

export const { resetApiState } = paymentSlice.actions;

export default paymentSlice.reducer;

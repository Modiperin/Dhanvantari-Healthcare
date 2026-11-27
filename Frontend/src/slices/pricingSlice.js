import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callAPI } from "../services/callAPI";
import { getDefaultApiState, handleApiState } from "./helper";

const initialState = {
  getPricingListApi: getDefaultApiState(),
  getPricingByIdApi: getDefaultApiState(),
  createPricingApi: getDefaultApiState(),
  deletePricingApi: getDefaultApiState(),
  updatePricingApi: getDefaultApiState(),
};

export const getPricingList = createAsyncThunk(
  "pricing/list",
  async ({ query = "", page = 1 } = {}) => {
    const q = query ? `&q=${query}` : "";
    const res = await callAPI(`/pricing/list?page=${page}${q}`, {
      method: "GET",
    });
    return res.data;
  }
);

export const getPricingById = createAsyncThunk(
  "pricing/listById",
  async (id) => {
    const res = await callAPI(`/pricing/view/${id}`);
    return res.data;
  }
);

export const createPricing = createAsyncThunk(
  `pricing/create`,
  async (data) => {
    const res = await callAPI(`/pricing/create`, {
      method: "POST",
      data,
    });
    return res.data;
  }
);

export const deletePricing = createAsyncThunk(`pricing/delete`, async (id) => {
  const res = await callAPI(`/pricing/delete/${id}`, {
    method: "DELETE",
  });
  return res.data;
});

export const updatePricing = createAsyncThunk(
  `pricing/update`,
  async ({ id, data }) => {
    const res = await callAPI(`/pricing/update/${id}`, { method: "PUT", data });
    return res.data;
  }
);

export const pricingSlice = createSlice({
  name: "pricingManagement",
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
    handleApiState(builder, getPricingList, "getPricingListApi");
    handleApiState(builder, getPricingById, "getPricingByIdApi");
    handleApiState(builder, createPricing, "createPricingApi");
    handleApiState(builder, deletePricing, "deletePricingApi");
    handleApiState(builder, updatePricing, "updatePricingApi");
  },
});

export const { resetApiState } = pricingSlice.actions;
export default pricingSlice.reducer;

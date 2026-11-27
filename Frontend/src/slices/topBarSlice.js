import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callAPI } from "../services/callAPI";
import { getDefaultApiState, handleApiState } from "./helper";

const initialState = {
  createFeatureRequestApi: getDefaultApiState(),
  getFeatureRequestsApi: getDefaultApiState(),
};

export const getFeatureRequestsList = createAsyncThunk(
  "topBar/getFeatureRequests",
  async ({ page }) => {
    const res = await callAPI(`/feature-req/list?page=${page}&limit=5`);
    return res.data;
  }
);

export const createFeatureRequest = createAsyncThunk(
  "topBar/createFeatureRequest",
  async (data) => {
    const res = await callAPI(`/feature-req/create`, { method: "POST", data });
    return res.data;
  }
);

const topBarSlice = createSlice({
  name: "topBar",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    handleApiState(builder, getFeatureRequestsList, "getFeatureRequestsApi");
    handleApiState(builder, createFeatureRequest, "createFeatureRequestApi");
  },
});

export default topBarSlice.reducer;

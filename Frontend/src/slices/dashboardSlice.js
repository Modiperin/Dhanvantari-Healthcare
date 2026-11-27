import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callAPI } from "../services/callAPI";
import { getDefaultApiState, handleApiState } from "./helper";
import { splitDate } from "../utils/dateAndTime";

const initialState = {
  dashboardCart: getDefaultApiState(),
  recentPatientsApi: getDefaultApiState(),
};

export const getDashboardCard = createAsyncThunk(
  `dashboard/getCard`,
  async ({ startDate = "", endDate = "" }) => {
    let q = ""
    if (startDate && endDate) {
      q += `?startDate=${splitDate(startDate)}&endDate=${splitDate(endDate)}`;
    }
    const res = await callAPI(
      `/dashboard/card${q}`,
      {
        method: "GET",
      }
    );
    return res.data;
  }
);

export const getRecentPatientList = createAsyncThunk(
  `dashboard/getRecentPatientList`,
  async () => {
    const res = await callAPI(`/dashboard/recent-patients`, {
      method: "GET",
    });
    return res.data;
  }
);

export const dashboardSlice = createSlice({
  name: "dashboard",
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
    handleApiState(builder, getDashboardCard, "dashboardCart");
    handleApiState(builder, getRecentPatientList, "recentPatientsApi");
  },
});

export const { resetApiState } = dashboardSlice.actions;

export default dashboardSlice.reducer;

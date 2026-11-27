import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { callAPI } from "../services/callAPI";
import { API_BASE_URL } from "../utils/config";
import { convetToObject } from "../utils/common";
import { formatDate } from "../utils/dateAndTime";

const initialState = {
  listResponse: null,
  listStatus: null,
  isListLoading: false,
  addRoasterTimingApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
  scheduleBreakApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
  addResponse: null,
  addStatus: null,
  isAddLoading: false,
  doctorAvailabilityApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  }
};

export const fetchRoasterList = createAsyncThunk(
  "roaster/fetchRoasterList",
  async ({ query, page }) => {
    let q = query ? `&q=${query}` : "";
    const res = await callAPI(`/roaster/list?page=${page}${q}`);
    return res.data;
  }
);

export const addRoasterTiming = createAsyncThunk(
  "roaster/addRoasterTiming",
  async (data) => {
    const response = await callAPI(`${API_BASE_URL}/roaster/create`, {
      method: "POST",
      data,
    });
    return response.data;
  }
);

export const scheduleBreak = createAsyncThunk(
  "roaster/scheduleBreak",
  async (data) => {
    const response = await callAPI(`${API_BASE_URL}/roaster/schedule-break`, {
      method: "POST",
      data,
    });
    return response.data;
  }
);

export const doctorAvailability = createAsyncThunk("roaster/available-doctors", async ({ date }) => {
  const dateQuery = date ? `?date=${date}` : `?date=${formatDate(new Date())}`;
  const response = await callAPI(`${API_BASE_URL}/roaster/available-doctors${dateQuery}`);
  return response.data
})

const roasterSlice = createSlice({
  name: "roaster",
  initialState,
  reducers: {
    resetLeaveCreation(state) {
      state.scheduleBreakApi = {
        status: null,
        isLoading: false,
        data: null,
        error: null,
      };
    },
    resetScheduleCreation(state) {
      state.addRoasterTimingApi = {
        status: null,
        isLoading: false,
        data: null,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    // LIST
    builder.addCase(fetchRoasterList.pending, (state) => {
      state.isListLoading = true;
      state.listStatus = "pending";
    });
    builder.addCase(fetchRoasterList.fulfilled, (state, action) => {
      state.isListLoading = false;
      state.listStatus = "success";
      state.listResponse = action.payload.response;
    });
    builder.addCase(fetchRoasterList.rejected, (state, action) => {
      state.isListLoading = false;
      state.listStatus = "failed";
      console.error("Failed:", action.error.message);
    });
    //Docotr Availability
    builder.addCase(doctorAvailability.pending, (state) => {
      state.doctorAvailabilityApi = {
        isListLoading: true,
        status: "pending"
      }
    });
    builder.addCase(doctorAvailability.fulfilled, (state, action) => {
      state.doctorAvailabilityApi = {
        isListLoading: false,
        status: "success",
        data: action.payload.response,
        error: null
      }
    });
    builder.addCase(doctorAvailability.rejected, (state, action) => {
      const error = JSON.parse(action.error.message)
      state.doctorAvailabilityApi = {
        isListLoading: false,
        status: "failed",
        error: error
      }
    });
    // UPDATE:
    builder.addCase(addRoasterTiming.pending, (state) => {
      Object.assign(state.addRoasterTimingApi, {
        isLoading: true,
        status: "pending",
      });
    });
    builder.addCase(addRoasterTiming.fulfilled, (state, action) => {
      Object.assign(state.addRoasterTimingApi, {
        isLoading: false,
        status: "success",
        data: action.payload,
        error: null,
      });
    });
    builder.addCase(addRoasterTiming.rejected, (state, action) => {
      Object.assign(state.addRoasterTimingApi, {
        isLoading: false,
        status: "failed",
        data: null,
        error: convetToObject(action.error.message),
      });
    });

    // SCHEDULE BREAK
    builder.addCase(scheduleBreak.pending, (state) => {
      Object.assign(state.scheduleBreakApi, {
        isLoading: true,
        status: "pending",
      });
    });
    builder.addCase(scheduleBreak.fulfilled, (state, action) => {
      Object.assign(state.scheduleBreakApi, {
        isLoading: false,
        status: "success",
        data: action.payload,
        error: null,
      });
    });
    builder.addCase(scheduleBreak.rejected, (state, action) => {
      Object.assign(state.scheduleBreakApi, {
        isLoading: false,
        status: "failed",
        data: null,
        error: convetToObject(action.error.message),
      });
    });
  },
});

export const { resetLeaveCreation, resetScheduleCreation } =
  roasterSlice.actions;
export default roasterSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callAPI } from "../services/callAPI";
import { splitDate } from "../utils/dateAndTime";

const initialState = {
  getAppointmentListApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
  deleteAppointmentApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
  getAppointmentByIdApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
  updateAppointmentByIdApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
  createAppointmentApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
  createNewAppointmentApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
};

export const getAppointmentList = createAsyncThunk(
  "appointment/list",
  async ({ query = "", page = 1, searchBy = "", startDate, endDate } = {}) => {
    let q = query ? `&q=${query}` : "";
    let s = searchBy && searchBy !== "all" ? `&searchBy=${searchBy}` : "";
    if (startDate && endDate) {
      q += `&startDate=${splitDate(startDate)}&endDate=${splitDate(endDate)}`;
    }
    const res = await callAPI(`/appointment/list?page=${page}${q}${s}`);
    return res.data;
  }
);

export const createAppointmentNew = createAsyncThunk(
  "/appointment/create/new",
  async (data) => {
    const res = await callAPI("/appointment/create/new", {
      method: "POST",
      data,
    });
    return res.data;
  }
);
export const createAppointmentOld = createAsyncThunk(
  "/appointment/create/old",
  async (data) => {
    const res = await callAPI("/appointment/create/old", {
      method: "POST",
      data,
    });
    return res.data;
  }
);

export const getAppointmentById = createAsyncThunk(
  `appointment/get`,
  async (id) => {
    const res = await callAPI(`/appointment/view/${id}`);
    return res.data;
  }
);

export const updateAppointmentById = createAsyncThunk(
  `appointment/update`,
  async ({ id, data }) => {
    // console.log({ id, data });
    const res = await callAPI(`/appointment/update/${id}`, {
      method: "PUT",
      data,
    });
    return res.data;
  }
);

export const deleteAppointmentByID = createAsyncThunk(
  "appointment/delete",
  async (id) => {
    const res = await callAPI(`/appointment/delete/${id}`, {
      method: "DELETE",
    });
    return res.data;
  }
);

export const appointmentSlice = createSlice({
  name: "appointmentManagement",
  initialState,
  reducers: {
    resetCreateAppointmentStatus(state) {
      state.createAppointmentApi = {
        status: null,
        isLoading: false,
        data: null,
        error: null,
      };
    },
    resetCreateNewAppointmentStatus(state) {
      state.createNewAppointmentApi = {
        status: null,
        isLoading: false,
        data: null,
        error: null,
      };
    },
    resetUpdateAppointmentStatus(state) {
      state.updateAppointmentByIdApi = {
        status: null,
        isLoading: false,
        data: null,
        error: null,
      };
    },
    resetDeleteAppointmentStatus(state) {
      state.deleteAppointmentApi = {
        status: null,
        isLoading: false,
        data: null,
        error: null,
      };
    },
    resetGetAppointmentByIdStatus(state) {
      state.getAppointmentByIdApi = {
        status: null,
        isLoading: false,
        data: null,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    //get appointment list
    builder.addCase(getAppointmentList.pending, (state) => {
      // console.log("📡 getAppointmentList → pending...");
      state.getAppointmentListApi = {
        isLoading: true,
        status: "pending",
      };
    });
    builder.addCase(getAppointmentList.fulfilled, (state, action) => {
      console.log("✅ getAppointmentList:", action.payload);
      state.getAppointmentListApi = {
        isLoading: false,
        status: "success",
        data: action.payload,
      };
    });
    builder.addCase(getAppointmentList.rejected, (state, action) => {
      const error = JSON.parse(action.error.message);
      // console.log("❌ getAppointmentList → rejected:", error);
      state.getAppointmentListApi = {
        isLoading: false,
        status: "failed",
        error: error,
      };
    });

    //delete appointment by id
    builder.addCase(deleteAppointmentByID.pending, (state) => {
      // console.log("📡 deleteAppointmentByID → pending...");
      state.deleteAppointmentApi = {
        isLoading: true,
        status: "pending",
      };
    });
    builder.addCase(deleteAppointmentByID.fulfilled, (state, action) => {
      // console.log("✅ deleteAppointmentByID:", action.payload.message);
      state.deleteAppointmentApi = {
        isLoading: false,
        status: "success",
        data: action.payload,
      };
    });
    builder.addCase(deleteAppointmentByID.rejected, (state, action) => {
      const error = JSON.parse(action.error.message);
      // console.log("❌ deleteAppointmentByID → rejected:", error);

      state.deleteAppointmentApi = {
        isLoading: false,
        status: "failed",
        error: error,
      };
    });

    //get appointment by id
    builder.addCase(getAppointmentById.pending, (state) => {
      // console.log("📡 getAppointmentById → pending...");
      state.getAppointmentByIdApi = {
        isLoading: true,
        status: "pending",
      };
    });
    builder.addCase(getAppointmentById.fulfilled, (state, action) => {
      console.log("✅ getAppointmentById:", action.payload);
      state.getAppointmentByIdApi = {
        isLoading: false,
        status: "success",
        data: action?.payload?.response,
      };
    });
    builder.addCase(getAppointmentById.rejected, (state, action) => {
      const error = JSON.parse(action.error.message);
      // console.log("❌ getAppointmentById → rejected:", error);

      state.getAppointmentByIdApi = {
        isLoading: false,
        status: "failed",
        error: error,
      };
    });

    //create Appointment
    builder.addCase(createAppointmentNew.pending, (state) => {
      // console.log("📡 createAppointment → pending...");
      state.createNewAppointmentApi = {
        isLoading: true,
        status: "pending",
      };
    });
    builder.addCase(createAppointmentNew.fulfilled, (state, action) => {
      // console.log("✅ createAppointment:", action.payload);
      state.createNewAppointmentApi = {
        isLoading: false,
        status: "success",
        data: action.payload,
      };
    });
    builder.addCase(createAppointmentNew.rejected, (state, action) => {
      const error = JSON.parse(action.error.message);
      // console.log("❌ createAppointment → rejected:", error);
      state.createNewAppointmentApi = {
        isLoading: false,
        status: "failed",
        error: error,
      };
    });

    //create Appointment old
    builder.addCase(createAppointmentOld.pending, (state) => {
      // console.log("📡 createAppointment → pending...");
      state.createAppointmentApi = {
        isLoading: true,
        status: "pending",
      };
    });
    builder.addCase(createAppointmentOld.fulfilled, (state, action) => {
      // console.log("✅ createAppointment:", action.payload);
      state.createAppointmentApi = {
        isLoading: false,
        status: "success",
        data: action.payload,
      };
    });
    builder.addCase(createAppointmentOld.rejected, (state, action) => {
      const error = JSON.parse(action.error.message);
      // console.log("❌ createAppointment → rejected:", error);
      state.createAppointmentApi = {
        isLoading: false,
        status: "failed",
        error: error,
      };
    });

    //update appointment by id
    builder.addCase(updateAppointmentById.pending, (state) => {
      // console.log("📡 updateAppointmentId → pending...");
      state.updateAppointmentByIdApi = {
        isLoading: true,
        status: "pending",
      };
    });
    builder.addCase(updateAppointmentById.fulfilled, (state, action) => {
      // console.log("✅ updateAppointmentId:", action.payload.message);
      state.updateAppointmentByIdApi = {
        isLoading: false,
        status: "success",
        data: action.payload,
      };
    });
    builder.addCase(updateAppointmentById.rejected, (state, action) => {
      const error = JSON.parse(action.error.message);
      // console.log("❌ updateAppointmentId → rejected:", error);
      state.updateAppointmentByIdApi = {
        isLoading: false,
        status: "failed",
        error: error,
      };
    });
  },
});

export const {
  resetCreateAppointmentStatus,
  resetUpdateAppointmentStatus,
  resetDeleteAppointmentStatus,
  resetCreateNewAppointmentStatus,
  resetGetAppointmentByIdStatus,
} = appointmentSlice.actions;
export default appointmentSlice.reducer;

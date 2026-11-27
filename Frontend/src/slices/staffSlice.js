import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callAPI } from "../services/callAPI";
import { Roles } from "../utils/roles";

const initialState = {
  getStaffListApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
  getStaffByIdApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
  createStaffApi: {
    status: null,
    isLoading: false,
    error: null,
    data: null,
  },
  updateStaffApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
  updateStaffBasicDetailsApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
  deleteStaffApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
};

export const getStaffList = createAsyncThunk(
  "staff/list",
  async ({ query = "", page = 1 } = {}) => {
    const role = `${Roles.team},${Roles.admin}`;
    const q = query ? `&q=${query}` : "";
    const res = await callAPI(`/staff/list?page=${page}&role=${role}${q}`);
    return res.data;
  }
);

export const getStaffById = createAsyncThunk(`staff/get`, async (id) => {
  const res = await callAPI(`/staff/view/${id}`);
  return res.data;
});

export const createStaff = createAsyncThunk(`staff/create`, async (data) => {
  const res = await callAPI(`/staff/create`, {
    method: "POST",
    data,
  });
  return res.data;
});

export const updateStaff = createAsyncThunk(
  `staff/update`,
  async ({ id, data }) => {
    // console.log({ id, data });
    const res = await callAPI(`/staff/update/${id}`, {
      method: "PUT",
      data,
    });
    return res.data;
  }
);

export const updateStaffBasicDetails = createAsyncThunk(
  `staff/updateBasicDetails`,
  async ({ id, data }) => {
    const res = await callAPI(`/staff/update/basic-details/${id}`, {
      method: "PUT",
      data,
    });
    return res.data;
  }
);
export const deleteStaff = createAsyncThunk(`staff/delete`, async (id) => {
  const res = await callAPI(`/staff/delete/${id}`, {
    method: "DELETE",
  });
  return res.data;
});

export const staffSlice = createSlice({
  name: "staffManagement",
  initialState,
  reducers: {
    resetCreateStaffStatus(state) {
      state.createStaffApi = {
        status: null,
        isLoading: false,
        data: null,
        error: null,
      };
    },
    resetUpdateStaffStatus(state) {
      state.updateStaffApi = {
        status: null,
        isLoading: false,
        data: null,
        error: null,
      };
    },
    resetUpdateStaffBasicDetailsStatus(state) {
      state.updateStaffBasicDetailsApi = {
        status: null,
        isLoading: false,
        data: null,
        error: null,
      };
    },
    resetDeleteStaffStatus(state) {
      state.deleteStaffApi = {
        status: null,
        isLoading: false,
        data: null,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    //get staff list
    builder.addCase(getStaffList.pending, (state) => {
      console.log("📡 getStaffList → pending...");
      state.getStaffListApi = {
        isLoading: true,
        status: "pending",
      };
    });
    builder.addCase(getStaffList.fulfilled, (state, action) => {
      console.log("✅ getStaffList:", action.payload);
      state.getStaffListApi = {
        isLoading: false,
        status: "success",
        data: action.payload,
      };
    });
    builder.addCase(getStaffList.rejected, (state, action) => {
      const error = JSON.parse(action.error.message);
      console.log("❌ createStaff → rejected:", error);
      state.getStaffListApi = {
        isLoading: false,
        status: "failed",
        error: error,
      };
    });

    //create staff
    builder.addCase(createStaff.pending, (state) => {
      console.log("📡 createStaff → pending...");
      state.createStaffApi = {
        isLoading: true,
        status: "pending",
      };
    });
    builder.addCase(createStaff.fulfilled, (state, action) => {
      console.log("✅ createStaff:", action.payload);
      state.createStaffApi = {
        isLoading: false,
        status: "success",
        data: action.payload,
      };
    });
    builder.addCase(createStaff.rejected, (state, action) => {
      const error = JSON.parse(action.error.message);
      console.log("❌ createStaff → rejected:", error);

      state.createStaffApi = {
        isLoading: false,
        status: "failed",
        error: error,
      };
    });

    //get staff by id
    builder.addCase(getStaffById.pending, (state) => {
      console.log("📡 getStaffById → pending...");
      state.getStaffByIdApi = {
        isLoading: true,
        status: "pending",
      };
    });
    builder.addCase(getStaffById.fulfilled, (state, action) => {
      console.log("✅ getStaffById:", action.payload);
      const {
        userId,
        name,
        departmentId,
        userName,
        active,
        gender,
        profileId,
        dateOfBirth,
        accessType,
        accessEndTime,
      } = action.payload.response;
      state.getStaffByIdApi = {
        isLoading: false,
        status: "success",
        data: {
          id: userId,
          name,
          departmentId,
          userName,
          active,
          gender,
          profileId,
          dateOfBirth,
          accessType,
          accessEndTime,
        },
      };
    });
    builder.addCase(getStaffById.rejected, (state, action) => {
      const error = JSON.parse(action.error.message);
      console.log("❌ getStaffById → rejected:", error);

      state.getStaffByIdApi = {
        isLoading: false,
        status: "failed",
        error: error,
      };
    });

    //update staff by id
    builder.addCase(updateStaff.pending, (state) => {
      console.log("📡 updateStaffApi → pending...");
      state.updateStaffApi = {
        isLoading: true,
        status: "pending",
      };
    });
    builder.addCase(updateStaff.fulfilled, (state, action) => {
      console.log("✅ updateStaff:", action.payload.message);
      state.updateStaffApi = {
        isLoading: false,
        status: "success",
        data: action.payload.message,
      };
    });
    builder.addCase(updateStaff.rejected, (state, action) => {
      const error = JSON.parse(action.error.message);
      console.log("❌ updateStaff → rejected:", error);
      state.updateStaffApi = {
        isLoading: false,
        status: "failed",
        error: error,
      };
    });

    // update staff basic details
    builder.addCase(updateStaffBasicDetails.pending, (state) => {
      console.log("📡 updateStaffBasicDetails → pending...");
      state.updateStaffBasicDetailsApi = {
        isLoading: true,
        status: "pending",
      };
    });
    builder.addCase(updateStaffBasicDetails.fulfilled, (state, action) => {
      console.log("✅ updateStaffBasicDetailsApi:", action.payload.message);
      state.updateStaffBasicDetailsApi = {
        isLoading: false,
        status: "success",
        data: action.payload.message,
      };
    });
    builder.addCase(updateStaffBasicDetails.rejected, (state, action) => {
      const error = JSON.parse(action.error.message);
      console.log("❌ updateStaffBasicDetails → rejected:", error);
      state.updateStaffBasicDetailsApi = {
        isLoading: false,
        status: "failed",
        error: error,
      };
    });

    //delete staff by id
    builder.addCase(deleteStaff.pending, (state) => {
      console.log("📡 deleteStaff → pending...");
      state.deleteStaffApi = {
        isLoading: true,
        status: "pending",
      };
    });
    builder.addCase(deleteStaff.fulfilled, (state, action) => {
      console.log("✅ deleteStaff:", action.payload.message);
      state.deleteStaffApi = {
        isLoading: false,
        status: "success",
        data: action.payload.message,
      };
    });
    builder.addCase(deleteStaff.rejected, (state, action) => {
      const error = JSON.parse(action.error.message);
      console.log("❌ deleteStaff → rejected:", error);

      state.deleteStaffApi = {
        isLoading: false,
        status: "failed",
        error: error,
      };
    });
  },
});

export const {
  resetCreateStaffStatus,
  resetUpdateStaffStatus,
  resetDeleteStaffStatus,
  resetUpdateStaffBasicDetailsStatus,
} = staffSlice.actions;
export default staffSlice.reducer;

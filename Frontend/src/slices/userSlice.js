import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { callAPI } from "../services/callAPI";
import { API_BASE_URL } from "../utils/config";
import { getDefaultApiState, handleApiState } from "./helper";

const initialState = {
  userInfo: null,
  status: null,
  isLoading: false,
  resetPasswordApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
  updateHospitalDetailsApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
  updatePadConfigApi: getDefaultApiState(),
};

export const fetchUserSettings = createAsyncThunk(
  "user/fetchUserSettings",
  async () => {
    const response = await callAPI(`${API_BASE_URL}/hospital/setting`);
    return response.data;
  }
);
export const resetPassword = createAsyncThunk(
  "hospital/resetPassword",
  async (data) => {
    const response = await callAPI(`${API_BASE_URL}/hospital/reset-password`, {
      method: "POST",
      data,
    });
    return response.data;
  }
);
export const updateHospitalDetails = createAsyncThunk(
  "hospital/updateHospitalDetails",
  async (data) => {
    const response = await callAPI(`${API_BASE_URL}/hospital/update`, {
      method: "PUT",
      data,
    });
    return response.data;
  }
);

export const updatePadConfig = createAsyncThunk(
  "hospital/updatePadConfig",
  async ({ staffId, data }) => {
    const response = await callAPI(
      `${API_BASE_URL}/hospital/pad-config/${staffId}`,
      {
        method: "PUT",
        data,
      }
    );
    return response.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
    },
    resetResetPasswordStatus(state) {
      state.resetPasswordApi = {
        status: null,
        isLoading: false,
        data: null,
        error: null,
      };
    },
    resetUpdateHospitalDetailsStatus(state) {
      state.updateHospitalDetailsApi = {
        status: null,
        isLoading: false,
        data: null,
        error: null,
      };
    },
    updatePadConfigration(state, action) {
      state.userInfo.response.padConfig = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserSettings.pending, (state) => {
      state.isLoading = true;
      state.status = "pending";
    });
    builder.addCase(fetchUserSettings.fulfilled, (state, action) => {
      state.isLoading = false;
      state.status = "success";
      state.userInfo = action.payload;
    });
    builder.addCase(fetchUserSettings.rejected, (state) => {
      state.isLoading = false;
      state.status = "failed";
    });

    //reset password
    builder.addCase(resetPassword.pending, (state) => {
      console.log("📡 resetPassword → pending...");
      state.resetPasswordApi = {
        isLoading: true,
        status: "pending",
      };
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      console.log("✅ resetPassword:", action.payload);
      state.resetPasswordApi = {
        isLoading: false,
        status: "success",
        data: action.payload,
      };
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      const error = JSON.parse(action.error.message);
      console.log("❌ createStaff → rejected:", error);
      state.resetPasswordApi = {
        isLoading: false,
        status: "failed",
        error,
      };
    });

    //update hospital details
    builder.addCase(updateHospitalDetails.pending, (state) => {
      console.log("📡 updateHospitalDetailsApi → pending...");
      state.updateHospitalDetailsApi = {
        isLoading: true,
        status: "pending",
      };
    });
    builder.addCase(updateHospitalDetails.fulfilled, (state, action) => {
      console.log("✅ updateHospitalDetailsApi:", action.payload);
      state.updateHospitalDetailsApi = {
        isLoading: false,
        status: "success",
        data: action.payload,
      };
    });
    builder.addCase(updateHospitalDetails.rejected, (state, action) => {
      const error = JSON.parse(action.error.message);
      console.log("❌ updateHospitalDetailsApi → rejected:", error);
      state.updateHospitalDetailsApi = {
        isLoading: false,
        status: "failed",
        error,
      };
    });
    handleApiState(builder, updatePadConfig, "updatePadConfigApi");
  },
});

export const {
  setUserInfo,
  clearUserInfo,
  resetResetPasswordStatus,
  resetUpdateHospitalDetailsStatus,
  updatePadConfigration,
} = userSlice.actions;

export default userSlice.reducer;

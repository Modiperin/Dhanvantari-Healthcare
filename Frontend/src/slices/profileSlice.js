import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callAPI } from "../services/callAPI";

const initialState = {
  getProfileListApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
  getProfileByIdApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
  createProfileApi: {
    status: null,
    isLoading: false,
    error: null,
    data: null,
  },
  updateProfileApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
};

export const getProfileList = createAsyncThunk(
  "profile/list",
  async ({ query = "", page = 1 } = {}) => {
    const q = query ? `&q=${query}` : "";
    const res = await callAPI(`/profile/list?page=${page}${q}`);
    return res.data;
  }
);

export const getProfileById = createAsyncThunk(`profile/get`, async (id) => {
  const res = await callAPI(`/profile/view/${id}`);
  return res.data;
});

export const createProfile = createAsyncThunk(
  `profile/create`,
  async (data) => {
    const res = await callAPI(`/profile/create`, {
      method: "POST",
      data,
    });
    return res.data;
  }
);

export const updateProfile = createAsyncThunk(
  `profile/update`,
  async ({ id, data }) => {
    console.log({ id, data });
    const res = await callAPI(`/profile/update/${id}`, {
      method: "PUT",
      data,
    });
    return res.data;
  }
);

export const profileSlice = createSlice({
  name: "profileManagement",
  initialState,
  reducers: {
    resetCreateProfileStatus(state) {
      state.createProfileApi = {
        status: null,
        isLoading: false,
        data: null,
        error: null,
      };
    },
    resetUpdateProfileStatus(state) {
      state.updateProfileApi = {
        status: null,
        isLoading: false,
        data: null,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    //get profile list
    builder.addCase(getProfileList.pending, (state) => {
      console.log("📡 getProfileList → pending...");
      state.getProfileListApi = {
        isLoading: true,
        status: "pending",
      };
    });
    builder.addCase(getProfileList.fulfilled, (state, action) => {
      console.log("✅ getProfileList:", action.payload);
      state.getProfileListApi = {
        isLoading: false,
        status: "success",
        data: action.payload,
      };
    });
    builder.addCase(getProfileList.rejected, (state, action) => {
      const error = JSON.parse(action.error.message);
      console.log("❌ createProfile → rejected:", error);
      state.getProfileListApi = {
        isLoading: false,
        status: "failed",
        data: error,
      };
    });

    //create profile
    builder.addCase(createProfile.pending, (state) => {
      console.log("📡 createProfile → pending...");
      state.createProfileApi = {
        isLoading: true,
        status: "pending",
      };
    });
    builder.addCase(createProfile.fulfilled, (state, action) => {
      console.log("✅ createProfile:", action.payload);
      state.createProfileApi = {
        isLoading: false,
        status: "success",
        data: action.payload.message,
      };
    });
    builder.addCase(createProfile.rejected, (state, action) => {
      const error = JSON.parse(action.error.message);
      console.log("❌ createProfile → rejected:", error);

      state.createProfileApi = {
        isLoading: false,
        status: "failed",
        error: error,
      };
    });

    //get profile by id
    builder.addCase(getProfileById.pending, (state) => {
      console.log("📡 getProfileById → pending...");
      state.getProfileByIdApi = {
        isLoading: true,
        status: "pending",
      };
    });
    builder.addCase(getProfileById.fulfilled, (state, action) => {
      console.log("✅ getProfileById:", action.payload);
      const { name, desc, access, role } = action.payload.response;
      state.getProfileByIdApi = {
        isLoading: false,
        status: "success",
        data: { name, desc, access, role },
      };
    });
    builder.addCase(getProfileById.rejected, (state, action) => {
      const error = JSON.parse(action.error.message);
      console.log("❌ getProfileById → rejected:", error);

      state.getProfileByIdApi = {
        isLoading: false,
        status: "failed",
        error: error,
      };
    });

    //update profile by id
    builder.addCase(updateProfile.pending, (state) => {
      console.log("📡 updateProfileApi → pending...");
      state.updateProfileApi = {
        isLoading: true,
        status: "pending",
      };
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      console.log("✅ updateProfile:", action.payload.message);
      state.updateProfileApi = {
        isLoading: false,
        status: "success",
        data: action.payload.message,
      };
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      const error = JSON.parse(action.error.message);
      console.log("❌ updateProfile → rejected:", error);

      state.updateProfileApi = {
        isLoading: false,
        status: "failed",
        error: error,
      };
    });
  },
});

export const { resetCreateProfileStatus, resetUpdateProfileStatus } =
  profileSlice.actions;
export default profileSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callAPI } from "../services/callAPI";
import { Roles } from "../utils/roles";

const initialState = {
  getDoctorListApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
  getDoctorByIdApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
  createDoctorApi: {
    status: null,
    isLoading: false,
    error: null,
    data: null,
  },
  updateDoctorApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
  deleteDoctorApi: {
    status: null,
    isLoading: false,
    data: null,
    error: null,
  },
};

export const getDoctorList = createAsyncThunk(
  "doctor/list",
  async ({ query = "", page = 1 } = {}) => {
    const role = Roles.doctor;
    const q = query ? `&q=${query}` : "";
    const res = await callAPI(`/staff/list?page=${page}&role=${role}${q}`);
    return res.data;
  }
);

export const getDoctorById = createAsyncThunk(`doctor/get`, async (id) => {
  const res = await callAPI(`/staff/view/${id}`);
  return res.data;
});

export const createDoctor = createAsyncThunk(`doctor/create`, async (data) => {
  const res = await callAPI(`/staff/create-doctor`, {
    method: "POST",
    data,
  });
  return res.data;
});

export const updateDoctor = createAsyncThunk(
  `doctor/update`,
  async ({ id, data }) => {
    // console.log({ id, data });
    const res = await callAPI(`/staff/update-doctor/${id}`, {
      method: "PUT",
      data,
    });
    return res.data;
  }
);
export const deleteDoctor = createAsyncThunk(`doctor/delete`, async (id) => {
  const res = await callAPI(`/staff/delete/${id}`, {
    method: "DELETE",
  });
  return res.data;
});

export const doctorSlice = createSlice({
  name: "doctorManagement",
  initialState,
  reducers: {
    resetCreateDoctorStatus(state) {
      state.createDoctorApi = {
        status: null,
        isLoading: false,
        data: null,
        error: null,
      };
    },
    resetUpdateDoctorStatus(state) {
      state.updateDoctorApi = {
        status: null,
        isLoading: false,
        data: null,
        error: null,
      };
    },
    resetDeleteDoctorStatus(state) {
      state.deleteDoctorApi = {
        status: null,
        isLoading: false,
        data: null,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    //get doctor list
    builder.addCase(getDoctorList.pending, (state) => {
      console.log("📡 getDoctorList → pending...");
      state.getDoctorListApi = {
        isLoading: true,
        status: "pending",
      };
    });
    builder.addCase(getDoctorList.fulfilled, (state, action) => {
      console.log("✅ getDoctorList:", action.payload.response);
      state.getDoctorListApi = {
        isLoading: false,
        status: "success",
        data: action.payload,
      };
    });
    builder.addCase(getDoctorList.rejected, (state, action) => {
      const error = JSON.parse(action.error.message);
      console.log("❌ createDoctor → rejected:", error);
      state.getDoctorListApi = {
        isLoading: false,
        status: "failed",
        error: error,
      };
    });

    //create doctor
    builder.addCase(createDoctor.pending, (state) => {
      console.log("📡 createDoctor → pending...");
      state.createDoctorApi = {
        isLoading: true,
        status: "pending",
      };
    });
    builder.addCase(createDoctor.fulfilled, (state, action) => {
      console.log("✅ createDoctor:", action.payload);
      state.createDoctorApi = {
        isLoading: false,
        status: "success",
        data: action.payload,
      };
    });
    builder.addCase(createDoctor.rejected, (state, action) => {
      const error = JSON.parse(action.error.message);
      console.log("❌ createDoctor → rejected:", error);

      state.createDoctorApi = {
        isLoading: false,
        status: "failed",
        error: error,
      };
    });

    //get doctor by id
    builder.addCase(getDoctorById.pending, (state) => {
      console.log("📡 getDoctorById → pending...");
      state.getDoctorByIdApi = {
        isLoading: true,
        status: "pending",
      };
    });
    builder.addCase(getDoctorById.fulfilled, (state, action) => {
      console.log("✅ getDoctorById:", action.payload);
      state.getDoctorByIdApi = {
        isLoading: false,
        status: "success",
        data: action.payload,
      };
    });
    builder.addCase(getDoctorById.rejected, (state, action) => {
      const error = JSON.parse(action.error.message);
      console.log("❌ getDoctorById → rejected:", error);

      state.getDoctorByIdApi = {
        isLoading: false,
        status: "failed",
        error: error,
      };
    });

    //update doctor by id
    builder.addCase(updateDoctor.pending, (state) => {
      console.log("📡 updateDoctorApi → pending...");
      state.updateDoctorApi = {
        isLoading: true,
        status: "pending",
      };
    });
    builder.addCase(updateDoctor.fulfilled, (state, action) => {
      console.log("✅ updateDoctor:", action.payload.message);
      state.updateDoctorApi = {
        isLoading: false,
        status: "success",
        data: action.payload,
      };
    });
    builder.addCase(updateDoctor.rejected, (state, action) => {
      const error = JSON.parse(action.error.message);
      console.log("❌ updateDoctor → rejected:", error);
      state.updateDoctorApi = {
        isLoading: false,
        status: "failed",
        error: error,
      };
    });

    //delete doctor by id
    builder.addCase(deleteDoctor.pending, (state) => {
      console.log("📡 deleteDoctor → pending...");
      state.deleteDoctorApi = {
        isLoading: true,
        status: "pending",
      };
    });
    builder.addCase(deleteDoctor.fulfilled, (state, action) => {
      console.log("✅ deleteDoctor:", action.payload.message);
      state.deleteDoctorApi = {
        isLoading: false,
        status: "success",
        data: action.payload,
      };
    });
    builder.addCase(deleteDoctor.rejected, (state, action) => {
      const error = JSON.parse(action.error.message);
      console.log("❌ deleteDoctor → rejected:", error);

      state.deleteDoctorApi = {
        isLoading: false,
        status: "failed",
        error: error,
      };
    });
  },
});

export const {
  resetCreateDoctorStatus,
  resetUpdateDoctorStatus,
  resetDeleteDoctorStatus,
} = doctorSlice.actions;
export default doctorSlice.reducer;

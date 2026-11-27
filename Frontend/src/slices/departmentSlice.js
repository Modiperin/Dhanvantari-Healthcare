import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callAPI } from "../services/callAPI";
import { getDefaultApiState, handleApiState } from "./helper";

const initialState = {
  getDepartmentListApi: getDefaultApiState(),
  deleteDepartmentApi: getDefaultApiState(),
  getDepartmentByIdApi: getDefaultApiState(),
  updateDepartmentByIdApi: getDefaultApiState(),
  createDepartmentApi: getDefaultApiState(),
};

export const getDepartmentList = createAsyncThunk(
  "department/list",
  async ({ query = "", page = 1 } = {}) => {
    const q = query ? `&q=${query}` : "";
    const res = await callAPI(`/department/list?page=${page}${q}`);
    return res.data;
  }
);

export const createDepartment = createAsyncThunk(
  "/department/create",
  async (data) => {
    const res = await callAPI("/department/create", { method: "POST", data });
    return res.data;
  }
);

export const getDepartmentById = createAsyncThunk(
  `department/get`,
  async (id) => {
    const res = await callAPI(`/department/view/${id}`);
    return res.data;
  }
);

export const updateDepartmentById = createAsyncThunk(
  `department/update`,
  async ({ id, data }) => {
    // console.log({ id, data });
    const res = await callAPI(`/department/update/${id}`, {
      method: "PUT",
      data,
    });
    return res.data;
  }
);

export const deleteDepartmentByID = createAsyncThunk(
  "department/delete",
  async (id) => {
    const res = await callAPI(`/department/delete/${id}`, {
      method: "DELETE",
    });
    return res.data;
  }
);

export const departmentSlice = createSlice({
  name: "departmentManagement",
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
    handleApiState(builder, getDepartmentList, "getDepartmentListApi");
    handleApiState(builder, deleteDepartmentByID, "deleteDepartmentApi");
    handleApiState(builder, getDepartmentById, "getDepartmentByIdApi");
    handleApiState(builder, createDepartment, "createDepartmentApi");
    handleApiState(builder, updateDepartmentById, "updateDepartmentByIdApi");
  },
});

export const { resetApiState } = departmentSlice.actions;
export default departmentSlice.reducer;

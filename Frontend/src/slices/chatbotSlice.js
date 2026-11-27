import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callAPI } from "../services/callAPI";
import { getDefaultApiState, handleApiState } from "./helper";

const initialState = {
  chatApi: getDefaultApiState(),
};

export const createChat = createAsyncThunk(`chat/create`, async (data) => {
  const res = await callAPI(`chat?include_history=true`, {
    server: "secondary",
    method: "POST",
    data,
  });
  return res.data;
});

export const chatbotSlice = createSlice({
  name: "chatbot",
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
    handleApiState(builder, createChat, "chatApi");
  },
});

export const { resetApiState } = chatbotSlice.actions;

export default chatbotSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

const initialState = {
  order: null,
  addOrder: {
    loading: false,
    error: false,
    success: false,
    message: null,
  },
};

export const addOrder = createAsyncThunk(
  "order/addOrder",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/orders/add", values);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearAddOrder: (state) => {
      state.addOrder.loading = false;
      state.addOrder.error = false;
      state.addOrder.success = false;
      state.addOrder.message = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addOrder.pending, (state) => {
      state.addOrder.loading = true;
      state.addOrder.error = false;
      state.addOrder.success = false;
      state.addOrder.message = null;
    });
    builder.addCase(addOrder.fulfilled, (state, action) => {
      state.addOrder.loading = false;
      state.addOrder.error = false;
      state.addOrder.success = true;
      state.addOrder.message = action.payload.message;
    });
    builder.addCase(addOrder.rejected, (state, action) => {
      state.addOrder.loading = false;
      state.addOrder.error = true;
      state.addOrder.success = false;
      state.addOrder.message = action.payload.message;
    });
  },
});

export const { clearAddOrder } = orderSlice.actions;

export default orderSlice.reducer;

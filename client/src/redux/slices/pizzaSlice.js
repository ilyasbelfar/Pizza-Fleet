import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

const initialState = {
  pizzas: [],
  filters: {
    price: [200, 4000],
    search: "",
  },
  loading: false,
};

export const getPizzas = createAsyncThunk(
  "pizza/getPizzas",
  async (filters, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/pizza/getAll", filters);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const pizzaSlice = createSlice({
  name: "pizza",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters.price = action.payload.price;
      state.filters.search = action.payload.search;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPizzas.pending, (state) => {
        state.loading = true;
        state.pizzas = [];
      })
      .addCase(getPizzas.fulfilled, (state, action) => {
        state.loading = false;
        state.pizzas = action.payload;
      })
      .addCase(getPizzas.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setFilters, clearFilters } = pizzaSlice.actions;

export default pizzaSlice.reducer;

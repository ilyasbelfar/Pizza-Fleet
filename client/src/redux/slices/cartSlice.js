import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

const initialState = {
  cart: {},
  numberOfCartItems: 0,
  isGettingCart: false,
  isGettingCartItemsNumber: false,
  updateCart: {
    loading: false,
    error: false,
    success: false,
    message: null,
  },
  addToCart: {
    loading: false,
    error: false,
    success: false,
    message: null,
  },
  removeFromCart: {
    loading: false,
    error: false,
    success: false,
    message: null,
  },
  applyCoupon: {
    loading: false,
    error: false,
    success: false,
    message: null,
  },
};

export const getCartItems = createAsyncThunk(
  "cart/getCartItems",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/cart/getCartItems");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getCartItemsNumber = createAsyncThunk(
  "cart/getCartItemsNumber",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/cart/getCartItemsNumber");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/cart/addToCart", values);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch("/cart/updateCart", values);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/cart/removeFromCart", values);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const applyCoupon = createAsyncThunk(
  "cart/applyCoupon",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/cart/applyCoupon", values);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearAddToCart: (state) => {
      state.addToCart.loading = false;
      state.addToCart.error = false;
      state.addToCart.success = false;
      state.addToCart.message = null;
    },
    clearUpdateCart: (state) => {
      state.updateCart.loading = false;
      state.updateCart.error = false;
      state.updateCart.success = false;
      state.updateCart.message = null;
    },
    clearRemoveFromCart: (state) => {
      state.removeFromCart.loading = false;
      state.removeFromCart.error = false;
      state.removeFromCart.success = false;
      state.removeFromCart.message = null;
    },
    clearApplyCoupon: (state) => {
      state.applyCoupon.loading = false;
      state.applyCoupon.error = false;
      state.applyCoupon.success = false;
      state.applyCoupon.message = null;
    },
    clearCart: (state) => {
      state.cart = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCartItems.pending, (state) => {
      state.isGettingCart = true;
    });
    builder.addCase(getCartItems.fulfilled, (state, action) => {
      state.isGettingCart = false;
      state.cart = action.payload;
    });
    builder.addCase(getCartItems.rejected, (state) => {
      state.isGettingCart = false;
    });
    builder.addCase(addToCart.pending, (state) => {
      state.addToCart.loading = true;
      state.addToCart.error = false;
      state.addToCart.success = false;
      state.addToCart.message = null;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.addToCart.loading = false;
      state.addToCart.error = false;
      state.addToCart.success = true;
      state.addToCart.message = action.payload.message;
      state.numberOfCartItems = action?.payload?.numberOfCartItems;
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.addToCart.loading = false;
      state.addToCart.error = true;
      state.addToCart.success = false;
      state.addToCart.message = action.payload.message;
      state.numberOfCartItems = 0;
    });
    builder.addCase(updateCart.pending, (state) => {
      state.removeFromCart.error = false;
      state.removeFromCart.success = false;
      state.removeFromCart.message = null;
      state.applyCoupon.error = false;
      state.applyCoupon.success = false;
      state.applyCoupon.message = null;
      state.updateCart.loading = true;
      state.updateCart.error = false;
      state.updateCart.success = false;
      state.updateCart.message = null;
    });
    builder.addCase(updateCart.fulfilled, (state, action) => {
      state.updateCart.loading = false;
      state.updateCart.error = false;
      state.updateCart.success = true;
      state.updateCart.message = action.payload.message;
      state.cart = action.payload.cart;
    });
    builder.addCase(updateCart.rejected, (state, action) => {
      state.updateCart.loading = false;
      state.updateCart.error = true;
      state.updateCart.success = false;
      state.updateCart.message = action.payload.message;
    });
    builder.addCase(removeFromCart.pending, (state) => {
      state.updateCart.error = false;
      state.updateCart.success = false;
      state.updateCart.message = null;
      state.applyCoupon.error = false;
      state.applyCoupon.success = false;
      state.applyCoupon.message = null;
      state.removeFromCart.loading = true;
      state.removeFromCart.error = false;
      state.removeFromCart.success = false;
      state.removeFromCart.message = null;
    });
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.removeFromCart.loading = false;
      state.removeFromCart.error = false;
      state.removeFromCart.success = true;
      state.removeFromCart.message = action.payload.message;
      state.cart = action.payload.cart;
      state.numberOfCartItems = action?.payload?.cart?.cartItems?.length || 0;
    });
    builder.addCase(removeFromCart.rejected, (state, action) => {
      state.removeFromCart.loading = false;
      state.removeFromCart.error = true;
      state.removeFromCart.success = false;
      state.removeFromCart.message = action.payload.message;
    });
    builder.addCase(applyCoupon.pending, (state) => {
      state.updateCart.error = false;
      state.updateCart.success = false;
      state.updateCart.message = null;
      state.removeFromCart.error = false;
      state.removeFromCart.success = false;
      state.removeFromCart.message = null;
      state.applyCoupon.loading = true;
      state.applyCoupon.error = false;
      state.applyCoupon.success = false;
      state.applyCoupon.message = null;
    });
    builder.addCase(applyCoupon.fulfilled, (state, action) => {
      state.applyCoupon.loading = false;
      state.applyCoupon.error = false;
      state.applyCoupon.success = true;
      state.applyCoupon.message = action.payload.message;
      state.cart = action.payload.cart;
    });
    builder.addCase(applyCoupon.rejected, (state, action) => {
      state.applyCoupon.loading = false;
      state.applyCoupon.error = true;
      state.applyCoupon.success = false;
      state.applyCoupon.message = action.payload.message;
    });
    builder.addCase(getCartItemsNumber.pending, (state) => {
      state.isGettingCartItemsNumber = true;
    });
    builder.addCase(getCartItemsNumber.fulfilled, (state, action) => {
      state.isGettingCartItemsNumber = false;
      state.numberOfCartItems = action.payload.numberOfCartItems;
    });
    builder.addCase(getCartItemsNumber.rejected, (state, action) => {
      state.isGettingCartItemsNumber = false;
      state.numberOfCartItems = 0;
    });
  },
});

export const {
  clearAddToCart,
  clearUpdateCart,
  clearRemoveFromCart,
  clearApplyCoupon,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

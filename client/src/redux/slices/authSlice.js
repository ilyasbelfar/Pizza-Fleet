import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

const initialState = {
  token: null,
  user: {},
  loggedIn: false,
  userOrders: [],
  userAddresses: [],
  register: {
    loading: false,
    error: false,
    success: false,
    message: null,
  },
  login: {
    loading: false,
    error: false,
    success: false,
    message: null,
  },
  logout: {
    loading: false,
    error: false,
    success: false,
    message: null,
  },
  updateUser: {
    loading: false,
    error: false,
    success: false,
    message: null,
  },
  getUserOrders: {
    loading: false,
    error: false,
    success: false,
    message: null,
  },
  getUserAddresses: {
    loading: false,
    error: false,
    success: false,
    message: null,
  },
  isRefreshingToken: false,
};

export const register = createAsyncThunk(
  "auth/register",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/auth/register", values);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/auth/login", values);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/auth/refreshToken");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/auth/logout");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/user/${values.id}/update`, values, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getUserOrders = createAsyncThunk(
  "auth/getUserOrders",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/user/${userId}/orders`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getUserAddresses = createAsyncThunk(
  "auth/getUserAddresses",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/user/${userId}/addresses`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearRegister: (state) => {
      state.register.loading = false;
      state.register.error = false;
      state.register.success = false;
      state.register.message = null;
    },
    clearLogin: (state) => {
      state.login.loading = false;
      state.login.error = false;
      state.login.success = false;
      state.login.message = null;
    },
    clearUserOrders: (state) => {
      state.userOrders = [];
    },
    clearUserAddresses: (state) => {
      state.userAddresses = [];
    },
    clearUpdateUser: (state) => {
      state.updateUser.loading = false;
      state.updateUser.error = false;
      state.updateUser.success = false;
      state.updateUser.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.register.loading = true;
        state.register.error = false;
        state.register.success = false;
        state.register.message = "Signing up...";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.register.loading = false;
        state.register.error = false;
        state.register.success = true;
        state.user = action.payload.user;
        state.register.message = action.payload.message;
      })
      .addCase(register.rejected, (state, action) => {
        state.register.loading = false;
        state.register.error = true;
        state.register.success = false;
        state.register.message = action.payload.message;
      })
      .addCase(login.pending, (state) => {
        state.login.loading = true;
        state.login.error = false;
        state.login.success = false;
        state.login.message = "Signing in...";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.login.loading = false;
        state.login.error = false;
        state.login.success = true;
        state.user = action.payload.user;
        state.loggedIn = true;
        state.login.message = action.payload.message;
      })
      .addCase(login.rejected, (state, action) => {
        state.login.loading = false;
        state.login.error = true;
        state.login.success = false;
        state.login.message = action.payload.message;
      })
      .addCase(refreshToken.pending, (state) => {
        state.isRefreshingToken = true;
        state.token = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isRefreshingToken = false;
        state.loggedIn = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("user", JSON.stringify(action?.payload?.user));
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isRefreshingToken = false;
        state.token = null;
        state.user = {};
      })
      .addCase(updateUser.pending, (state) => {
        state.updateUser.loading = true;
        state.updateUser.error = false;
        state.updateUser.success = false;
        state.updateUser.message = "Updating...";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateUser.loading = false;
        state.updateUser.error = false;
        state.updateUser.success = true;
        state.user = action.payload.user;
        state.updateUser.message = action.payload.message;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUser.loading = false;
        state.updateUser.error = true;
        state.updateUser.success = false;
        state.updateUser.message = action.payload.message;
      })
      .addCase(getUserOrders.pending, (state) => {
        state.getUserOrders.loading = true;
        state.getUserOrders.error = false;
        state.getUserOrders.success = false;
        state.getUserOrders.message = "Loading...";
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.getUserOrders.loading = false;
        state.getUserOrders.error = false;
        state.getUserOrders.success = true;
        state.userOrders = action.payload.orders;
        state.getUserOrders.message = action.payload.message;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.getUserOrders.loading = false;
        state.getUserOrders.error = true;
        state.getUserOrders.success = false;
        state.getUserOrders.message = action.payload.message;
      })
      .addCase(logout.pending, (state) => {
        state.logout.loading = true;
        state.logout.error = false;
        state.logout.success = false;
        state.logout.message = "Logging out...";
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.logout.loading = false;
        state.logout.error = false;
        state.logout.success = true;
        state.user = {};
        state.token = null;
        state.loggedIn = false;
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
        state.logout.message = action.payload.message;
      })
      .addCase(logout.rejected, (state, action) => {
        state.logout.loading = false;
        state.logout.error = true;
        state.logout.success = false;
        state.logout.message = action.payload.message;
      })
      .addCase(getUserAddresses.pending, (state) => {
        state.getUserAddresses.loading = true;
        state.getUserAddresses.error = false;
        state.getUserAddresses.success = false;
        state.getUserAddresses.message = "Loading...";
      })
      .addCase(getUserAddresses.fulfilled, (state, action) => {
        state.getUserAddresses.loading = false;
        state.getUserAddresses.error = false;
        state.getUserAddresses.success = true;
        state.userAddresses = action.payload.addresses;
        state.getUserAddresses.message = action.payload.message;
      })
      .addCase(getUserAddresses.rejected, (state, action) => {
        state.getUserAddresses.loading = false;
        state.getUserAddresses.error = true;
        state.getUserAddresses.success = false;
        state.getUserAddresses.message = action.payload.message;
      });
  },
});

export const {
  clearUserAddresses,
  clearRegister,
  clearLogin,
  clearUserOrders,
  clearUpdateUser,
} = authSlice.actions;

export default authSlice.reducer;

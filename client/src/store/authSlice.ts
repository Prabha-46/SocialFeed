import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import authAPI from "../services/authService";

interface User {
  id: number;
  username: string;
  gender: string;
  age: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
  token: localStorage.getItem("access_token"),
  isAuthenticated: !!localStorage.getItem("access_token"),
  loading: false,
  error: null,
};

// Async thunks
export const signup = createAsyncThunk(
  "auth/signup",
  async (userData: {
    username: string;
    password: string;
    gender: string;
    age: string;
  }) => {
    const response = await authAPI.signup(userData);
    return response;
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { username: string; password: string }) => {
    const response = await authAPI.login(credentials);
    return response;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        // Don't set user on signup, just show success
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Signup failed";
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.isAuthenticated = true;
        state.user = action.payload.user; // Set user from backend response
        localStorage.setItem("access_token", action.payload.access_token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;

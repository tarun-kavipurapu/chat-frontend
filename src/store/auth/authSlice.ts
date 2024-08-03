import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { backendURL } from "@/lib/constants";
import { LoginType, SignupType } from "@/lib/types";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
  userInfoFromStorage,
} from "@/lib/helper";

const userToken = getAccessToken() || "";

export interface authState {
  loading: boolean;
  userInfo: any;
  userToken: string;
  error: any;
  success: boolean;
}

const initialState: authState = {
  loading: false,
  userInfo: userInfoFromStorage,
  userToken: userToken,
  error: null,
  success: false,
};

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (data: SignupType, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      await axios.post(
        `${backendURL}/users/signup`,
        {
          user_email: data.email,
          user_name: data.username,
          user_password: data.password,
        },
        config
      );
    } catch (error: any) {
      if (error.response && error.response.data.message && error.error) {
        return (
          rejectWithValue(error.response.data.message) ||
          rejectWithValue(error.error)
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: LoginType, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(
        `${backendURL}/users/login`,
        {
          user_email: data.email,
          user_password: data.password,
        },
        config
      );
      localStorage.setItem(
        "userInfo",
        JSON.stringify(response.data.data.user_details)
      );
      setAccessToken(response.data.data.access_token);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const errorMessage =
          error.response.data.error ||
          error.response.data.message ||
          error.message;
        return rejectWithValue(errorMessage);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetState: (state) => {
      state.userInfo = null;
      state.loading = false;
      state.userToken = "";
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(signupUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = true;
        state.userInfo = action.payload.data.user_details;
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = authSlice.actions;
export const authReducer = authSlice.reducer;

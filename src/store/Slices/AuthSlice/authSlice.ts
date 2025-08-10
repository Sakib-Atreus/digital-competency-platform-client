import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserMeta {
  lastLogin?: string;
  // add more as needed
}

interface UserData {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface AuthState {
  userMeta: UserMeta | null;
  userData: UserData | null;
  approvalToken: string;
  refreshToken: string;
}

const initialState: AuthState = {
  userMeta: null,
  userData: null,
  approvalToken: "",
  refreshToken: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<AuthState>) {
      return { ...state, ...action.payload };
    },
    logout(state) {
      return initialState;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;

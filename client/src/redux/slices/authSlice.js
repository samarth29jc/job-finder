import { createSlice } from '@reduxjs/toolkit';

const TOKEN_EXPIRY_KEY = 'tokenExpiry';
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

const getStoredAuth = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = JSON.parse(localStorage.getItem(USER_KEY));
    const tokenExpiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

    if (!token || !user || !tokenExpiry) {
      return { user: null, token: null };
    }

    // Check if token is expired
    const isExpired = new Date().getTime() > parseInt(tokenExpiry);
    if (isExpired) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      return { user: null, token: null };
    }

    return { user, token };
  } catch (error) {
    console.error('Error reading auth from localStorage:', error);
    return { user: null, token: null };
  }
};

const initialState = {
  ...getStoredAuth(),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;

      // Store in localStorage
      localStorage.setItem(TOKEN_KEY, action.payload.token);
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
      // Set token expiry to 24 hours from now
      localStorage.setItem(
        TOKEN_EXPIRY_KEY,
        (new Date().getTime() + 24 * 60 * 60 * 1000).toString()
      );
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.user = null;
      state.token = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.isLoading = false;

      // Clear localStorage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload));
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer; 
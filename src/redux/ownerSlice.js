import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  myShopData: null, // Shop ka data
  loading: false,   // ✅ loading status
  error: null,      // ✅ error messages
};

const ownerSlice = createSlice({
  name: "owner",
  initialState,
  reducers: {
    // Start loading
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    // Set/update shop data
    setMyShopData: (state, action) => {
      state.myShopData = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Handle error
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Clear shop data
    clearShopData: (state) => {
      state.myShopData = null;
      state.loading = false;
      state.error = null;
    },
  },
});

// Export actions
export const { startLoading, setMyShopData, setError, clearShopData } =
  ownerSlice.actions;

// Export reducer
export default ownerSlice.reducer;

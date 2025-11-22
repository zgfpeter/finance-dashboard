// the slice stores the fetched dashboard data, loading/error states and have reducers to update it

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { DashboardData } from "@/lib/types/dashboard";
interface DashboardState {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState, // the initial state
  reducers: {
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    setDasboardData(state, action: PayloadAction<DashboardData>) {
      state.data = action.payload;
      state.isLoading = false;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { startLoading, setDasboardData, setError } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;

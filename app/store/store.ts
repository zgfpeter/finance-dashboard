import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./dashboardSlice";

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
  },
});

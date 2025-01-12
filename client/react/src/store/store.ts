import {Action, configureStore, ThunkAction} from "@reduxjs/toolkit";
import dashboardReducer from "@/features/dashboard/dashboardSlice.ts";

export const store = configureStore({
    reducer: {
        dashboard: dashboardReducer
    },
});

// See https://redux.js.org/tutorials/typescript-quick-start
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// See https://redux.js.org/tutorials/essentials/part-5-async-logic
export type AppThunk = ThunkAction<void, RootState, unknown, Action>

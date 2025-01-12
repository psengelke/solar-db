import {Action, configureStore, ThunkAction} from "@reduxjs/toolkit";
import allTimeReducer from "@/pages/all-time-page/allTimePageSlice.ts";
import dayPageReducer from "@/pages/day-page/dayPageSlice.ts";

export const store = configureStore({
    reducer: {
        allTimePage: allTimeReducer,
        dayPage: dayPageReducer,
    },
});

// See https://redux.js.org/tutorials/typescript-quick-start
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// See https://redux.js.org/tutorials/essentials/part-5-async-logic
export type AppThunk = ThunkAction<void, RootState, unknown, Action>

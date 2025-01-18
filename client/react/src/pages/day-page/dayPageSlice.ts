import {
    fetchDetailedHistory as _fetchDetailedHistory,
    DetailedHistoryDatum
} from "@/services/api/rest/history.ts";
import { fetchBounds } from "@/store/slices/temporalBoundsSlice";
import { AppThunk } from "@/store/store.ts";
import { AsyncMetaState, AsyncMetaStateUtils } from "@/utils/store.ts";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";
import { DateTime } from "luxon";

interface DayPageState extends AsyncMetaState {
    date?: number,
    detailedHistory: DetailedHistoryDatum[],
}

const initialState: DayPageState = AsyncMetaStateUtils.withAsyncMetaState({
    date: undefined,
    detailedHistory: [],
});

const setDetailedHistory = (state: DayPageState, action: PayloadAction<DetailedHistoryDatum[]>) => {
    state.detailedHistory = action.payload;
};

const _setDate = (state: DayPageState, action: PayloadAction<number>) => {
    state.date = action.payload;
}

const slice = createSlice({
    name: "dayPage",
    initialState,
    reducers: {
        startRequest: AsyncMetaStateUtils.startRequest,
        endRequest: AsyncMetaStateUtils.endRequest,
        setDetailedHistory,
        setDate: _setDate,
    },
});

export default slice.reducer;

const ensureDateIsSet = (): AppThunk => async (dispatch, getState) => {

    let state = getState();
    if (state.dayPage.date) return;
    if (state.temporalBounds.bounds?.daily?.length === 2) return;

    await dispatch(fetchBounds());
    state = getState();
    const dateStr = state.temporalBounds.bounds?.daily?.[1];
    const date = dateStr ? DateTime.fromISO(dateStr) : DateTime.now().startOf("day");
    const dateMillis = date.toMillis();
    dispatch(slice.actions.setDate(dateMillis));

};

/**
 * Fetches detailed history for the selected date, at a 5-minute interval.
 */
export const fetchDetailedHistory = (): AppThunk => async (dispatch, getState) => {

    try {

        dispatch(slice.actions.startRequest());
        await dispatch(ensureDateIsSet());

        const state = getState();
        const fmt = "yyyy-MM-dd'T'HH:mm";
        const date = DateTime.fromMillis(state.dayPage.date!);
        const start = date.toFormat(fmt);
        const end = date.endOf("day").toFormat(fmt);

        const response = await _fetchDetailedHistory({
            request: {
                startTimestamp: start,
                endTimestamp: end,
            }
        });

        dispatch(slice.actions.setDetailedHistory(response.data));

    } catch (e) {
        console.error(e);
    } finally {
        dispatch(slice.actions.endRequest());
    }

}

/**
 * Provides a view of the selected date as a {@link DateTime}.
 */
export const selectDate = createSelector(
    (state: { dayPage: DayPageState }) => state.dayPage.date,
    date => date ? DateTime.fromMillis(date) : null,
)

/**
 * A debounced version of {@link fetchDetailedHistory}.
 */
const debouncedFetchDetailedHistoryDispatch =
    _.debounce(dispatch => dispatch(fetchDetailedHistory()), 300);

/**
 * Sets the selected date.
 *
 * Also fetches detailed history and SOC statistics for the selected date.
 *
 * @param date The date to set.
 */
export const setDate = (date: DateTime): AppThunk => async (dispatch) => {
    dispatch(slice.actions.setDate(date.toMillis()));
    debouncedFetchDetailedHistoryDispatch(dispatch);
}

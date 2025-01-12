import {AsyncMetaState, AsyncMetaStateUtils} from "@/utils/store.ts";
import {DateTime} from "luxon";
import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "@/store/store.ts";
import {
    DetailedHistoryDatum,
    fetchDetailedHistory as _fetchDetailedHistory,
    fetchSocStats as _fetchSocStats,
    SocStatsDatum,
} from "@/services/api/rest/history.ts";
import _ from "lodash";

interface DayPageState extends AsyncMetaState {
    date: number,
    socStats: SocStatsDatum[],
    detailedHistory: DetailedHistoryDatum[],
}

const now = DateTime.now();

const initialState: DayPageState = AsyncMetaStateUtils.withAsyncMetaState({
    date: now.startOf("day").toMillis(),
    socStats: [],
    detailedHistory: [],
});

const setSocStats = (state: DayPageState, action: PayloadAction<SocStatsDatum[]>) => {
    state.socStats = action.payload;
};

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
        setSocStats,
        setDetailedHistory,
        setDate: _setDate,
    },
});

export default slice.reducer;

/**
 * Fetches detailed history for the selected date, at a 5-minute interval.
 */
export const fetchDetailedHistory = (): AppThunk => async (dispatch, getState) => {

    try {

        const state = getState();
        const fmt = "yyyy-MM-dd'T'HH:mm";
        const date = DateTime.fromMillis(state.dayPage.date);
        const start = date.toFormat(fmt);
        const end = date.endOf("day").toFormat(fmt);
        if (!start || !end || end < start) {
            return;
        }

        dispatch(slice.actions.startRequest());
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
 * Fetches SOC statistics for the selected date.
 */
export const fetchSocStats = (): AppThunk => async (dispatch, getState) => {

        try {

            const state = getState();
            const fmt = "yyyy-MM-dd'T'HH:mm";
            const date = DateTime.fromMillis(state.dayPage.date);
            const start = date.toFormat(fmt);
            const end = date.endOf("day").toFormat(fmt);
            if (!start || !end || end < start) {
                return;
            }

            dispatch(slice.actions.startRequest());
            const response = await _fetchSocStats({
                request: {
                    startTimestamp: start,
                    endTimestamp: end,
                }
            });

            dispatch(slice.actions.setSocStats(response.data));

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
    date => DateTime.fromMillis(date),
)

const debouncedFetchDetailedHistoryDispatch =
    _.debounce(dispatch => dispatch(fetchDetailedHistory()), 300);

const debouncedFetchSocStatsDispatch =
    _.debounce(dispatch => dispatch(fetchSocStats()), 300);

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
    debouncedFetchSocStatsDispatch(dispatch);
}

import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    DetailedHistoryDatum,
    fetchDetailedHistory as _fetchDetailedHistory, HistoryData, SocStatsData
} from "@/services/api/rest/history.ts";
import {AsyncMetaState, AsyncMetaStateUtils} from "@/utils/store.ts";
import {AppThunk} from "@/store/store.ts";
import {DateTime} from "luxon";

interface DashboardState extends AsyncMetaState {

    history: {
        data: HistoryData[];
        startDate: number;
        endDate: number;
    };

    detailedHistory: {
        data: DetailedHistoryDatum[];
        startDate: number;
        endDate: number;
    };

    socStats: {
        data: SocStatsData[];
        startDate: number;
        endDate: number;
    };

}

const now = DateTime.now();
const initialState: DashboardState = AsyncMetaStateUtils.withAsyncMetaState(
    {

        history: {
            data: [],
            startDate: now.startOf("day").toMillis(),
            endDate: now.endOf("day").toMillis(),
        },

        detailedHistory: {
            data: [],
            startDate: now.startOf("day").toMillis(),
            endDate: now.endOf("day").toMillis(),
        },

        socStats: {
            data: [],
            startDate: now.startOf("day").toMillis(),
            endDate: now.endOf("day").toMillis(),
        },

    }
);

const setDetailedHistory =
    (state: DashboardState,
     action: PayloadAction<DetailedHistoryDatum[]>) => {
        state.detailedHistory.data =
            action.payload.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    }

const _setDetailedHistoryStartDate = (state: DashboardState, action: PayloadAction<number>) => {
    state.detailedHistory.startDate = action.payload;
}

const _setDetailedHistoryEndDate = (state: DashboardState, action: PayloadAction<number>) => {
    state.detailedHistory.endDate = action.payload;
}

const setSocStats = (state: DashboardState, action: PayloadAction<SocStatsData[]>) => {
    state.socStats.data = action.payload;
}

const _setSocStatsStartDate = (state: DashboardState, action: PayloadAction<number>) => {
    state.socStats.startDate = action.payload;
}

const _setSocStatsEndDate = (state: DashboardState, action: PayloadAction<number>) => {
    state.socStats.endDate = action.payload;
}

const setHistory = (state: DashboardState, action: PayloadAction<HistoryData[]>) => {
    state.history.data = action.payload;
}

const _setHistoryStartDate = (state: DashboardState, action: PayloadAction<number>) => {
    state.history.startDate = action.payload;
}

const _setHistoryEndDate = (state: DashboardState, action: PayloadAction<number>) => {
    state.history.endDate = action.payload;
}

const slice = createSlice({
    name: "dashboard",
    initialState: initialState,
    reducers: {
        startRequest: AsyncMetaStateUtils.startRequest,
        endRequest: AsyncMetaStateUtils.endRequest,
        setDetailedHistory,
        setDetailedHistoryStartDate: _setDetailedHistoryStartDate,
        setDetailedHistoryEndDate: _setDetailedHistoryEndDate,
        setSocStats,
        setSocStatsStartDate: _setSocStatsStartDate,
        setSocStatsEndDate: _setSocStatsEndDate,
        setHistory,
        setHistoryStartDate: _setHistoryStartDate,
        setHistoryEndDate: _setHistoryEndDate,
    }
});

export default slice.reducer;

/**
 * Fetches detailed history for a period of time, at a 5-minute interval.
 */
export const fetchDetailedHistory = (): AppThunk => async (dispatch, getState) => {

    try {

        const state = getState();
        const fmt = "yyyy-MM-dd'T'HH:mm";
        const start = DateTime.fromMillis(state.dashboard.detailedHistory.startDate).toFormat(fmt);
        const end = DateTime.fromMillis(state.dashboard.detailedHistory.endDate).toFormat(fmt);
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
 * Sets the start date for the detailed history.
 * If both the start and end dates are set and valid, new data will be fetched.
 * @param date The start date.
 */
export const setDetailedHistoryStartDate = (date: DateTime): AppThunk => async (dispatch) => {
    dispatch(slice.actions.setDetailedHistoryStartDate(date.startOf("day").toMillis()));
    dispatch(slice.actions.setDetailedHistoryEndDate(date.endOf("day").toMillis()));
    dispatch(fetchDetailedHistory());
}

/**
 * Sets the end date for the detailed history.
 * If both the start and end dates are set and valid, new data will be fetched.
 * @param date The end date.
 */
export const setDetailedHistoryEndDate = (date: DateTime): AppThunk => async (dispatch) => {
    dispatch(slice.actions.setDetailedHistoryEndDate(date.endOf("day").toMillis()));
    dispatch(fetchDetailedHistory());
}

/**
 * Selects the detailed history date range as a pair of {@link DateTime} instances.
 */
export const selectDetailedHistoryDateRage = createSelector(
    (state: { dashboard: DashboardState }) => state.dashboard.detailedHistory.startDate,
    (state: { dashboard: DashboardState }) => state.dashboard.detailedHistory.endDate,
    (start, end) => [DateTime.fromMillis(start), DateTime.fromMillis(end)],
);

/**
 * Fetches SOC statistics for a period of time.
 */
export const fetchSocStats = (): AppThunk => async (dispatch, getState) => {
    // TODO
}

/**
 * Sets the start date for the SOC statistics.
 * If both the start and end dates are set and valid, new data will be fetched.
 * @param date The start date.
 */
export const setSocStatsStartDate = (date: DateTime): AppThunk => async (dispatch) => {
    // TODO
}

/**
 * Sets the end date for the SOC statistics.
 * If both the start and end dates are set and valid, new data will be fetched.
 * @param date The end date.
 */
export const setSocStatsEndDate = (date: DateTime): AppThunk => async (dispatch) => {
    // TODO
}

/**
 * Selects the SOC statistics date range as a pair of {@link DateTime} instances.
 */
export const selectSocStatsDateRange = createSelector(
    (state: { dashboard: DashboardState }) => state.dashboard.socStats.startDate,
    (state: { dashboard: DashboardState }) => state.dashboard.socStats.endDate,
    (start, end) => [DateTime.fromMillis(start), DateTime.fromMillis(end)],
);

/**
 * Fetches history data for a period of time.
 */
export const fetchHistory = (): AppThunk => async (dispatch, getState) => {
    // TODO
}

/**
 * Sets the start date for the history data.
 * If both the start and end dates are set and valid, new data will be fetched.
 * @param date The start date.
 */
export const setHistoryStartDate = (date: DateTime): AppThunk => async (dispatch) => {
    // TODO
}

/**
 * Sets the end date for the history data.
 * If both the start and end dates are set and valid, new data will be fetched.
 * @param date The end date.
 */
export const setHistoryEndDate = (date: DateTime): AppThunk => async (dispatch) => {
    // TODO
}

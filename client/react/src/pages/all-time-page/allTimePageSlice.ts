import {AsyncMetaState, AsyncMetaStateUtils} from "@/utils/store.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SocStatsDatum} from "@/services/api/rest/history.ts";
import {DateTime} from "luxon";
import {AppThunk} from "@/store/store.ts";
import {fetchSocStats as _fetchSocStats} from "@/services/api/rest/history";

interface AllTimePageState extends AsyncMetaState {
    startDate: number;
    endDate: number;
    socStats: {
        data: SocStatsDatum[];
    },
}

const now = DateTime.now();

const initialState: AllTimePageState = AsyncMetaStateUtils.withAsyncMetaState({
    startDate: now.minus({year: 100}).startOf("day").toMillis(),
    endDate: now.plus({year: 1000}).endOf("day").toMillis(),
    socStats: {data: []},
});

const setSocStats = (state: AllTimePageState, action: PayloadAction<SocStatsDatum[]>) => {
    state.socStats.data = action.payload;
}

const slice = createSlice({
    name: "allTimePage",
    initialState,
    reducers: {
        startRequest: AsyncMetaStateUtils.startRequest,
        endRequest: AsyncMetaStateUtils.endRequest,
        setSocStats,
    },
});

export default slice.reducer;

/**
 * Fetches SOC statistics for a period of time.
 */
export const fetchSocStats = (): AppThunk => async (dispatch, getState) => {

    try {

        const state = getState();
        const fmt = "yyyy-MM-dd'T'HH:mm";
        const start = DateTime.fromMillis(state.allTimePage.startDate).toFormat(fmt);
        const end = DateTime.fromMillis(state.allTimePage.endDate).toFormat(fmt);
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

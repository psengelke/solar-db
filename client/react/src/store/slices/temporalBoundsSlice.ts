import { createSlice } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { fetchHistoryTemporalBounds } from "@/services/api/rest/history";
import { AsyncMetaState, AsyncMetaStateUtils } from '@/utils/store';

interface TemporalBoundsState extends AsyncMetaState {
    bounds?: {
        detailed?: [string, string];
        daily?: [string, string];
        monthly?: [string, string];
        yearly?: [string, string];
    }
}

const initialState: TemporalBoundsState = AsyncMetaStateUtils.withAsyncMetaState({
    bounds: undefined,
});

const setBounds = (state: TemporalBoundsState, action: { payload: TemporalBoundsState['bounds'] }) => {
    state.bounds = action.payload;
};

const slice = createSlice({
    name: "temporalBoundsState",
    initialState,
    reducers: {
        startRequest: AsyncMetaStateUtils.startRequest,
        endRequest: AsyncMetaStateUtils.endRequest,
        setBounds,
    },
});

export default slice.reducer;

/**
 * Fetches the temporal bounds for the detailed, daily, monthly, and yearly granularities.
 */
export const fetchBounds = (): AppThunk => async (dispatch) => {
    try {
        dispatch(slice.actions.startRequest());
        const response = await fetchHistoryTemporalBounds();
        dispatch(slice.actions.setBounds(response));
    } catch (e) {
        console.error(e);
    } finally {
        dispatch(slice.actions.endRequest());
    }
}
import _ from "lodash";

export interface AsyncMetaState {
    meta: { async: { pending: number } }
}

export class AsyncMetaStateUtils {

    /**
     * Add async meta state to the given state.
     * @param state The state to add async meta state to.
     * @return The state with async meta state.
     */
    static withAsyncMetaState<T>(state: T): T & AsyncMetaState {
        return _.merge(state, {meta: {async: {pending: 0}}});
    }

    /**
     * Start an async request.
     * @param state The state to start the request on.
     * @return The state with the request started.
     */
    static startRequest<T>(state: T & AsyncMetaState): T & AsyncMetaState {
        state.meta.async.pending++;
        return state;
    }

    /**
     * End an async request.
     * @param state The state to end the request on.
     * @return The state with the request ended.
     */
    static endRequest<T>(state: T & AsyncMetaState): T & AsyncMetaState {
        state.meta.async.pending = Math.max(0, state.meta.async.pending - 1);
        return state;
    }

}

import {
    GET_TOPLIST,
    TopListAction,
    TopListResponse,
} from "../actions/topList";

export type TopListState = {
    [season_rule: string]: {
        topList: TopListResponse;
        expires: number;
    };
};

export default (
    state: TopListState = {},
    action: TopListAction
): TopListState => {
    switch (action.type) {
        case GET_TOPLIST:
            return {
                ...state,
                [`${action.season}_${action.rule}`]: {
                    topList: action.topList,
                    expires:
                        new Date(new Date().toDateString()).getTime() +
                        86400000,
                },
            };
        default:
            return state;
    }
};

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

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
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
                    expires: Date.now() + 10800000,
                },
            };
        default:
            return state;
    }
};

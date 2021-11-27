import {
    RequestTopList,
    REQUEST_TOP_LIST,
    RECEIVE_TOP_LIST,
    ReceiveTopList,
    TopListResponse,
} from "../actions/topList";

export type TopListState = {
    [season_rule: string]: {
        topList: TopListResponse;
        isFetching: boolean;
        expires: number;
    };
};

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (
    state: TopListState = {},
    action: RequestTopList | ReceiveTopList
): TopListState => {
    switch (action.type) {
        case REQUEST_TOP_LIST:
            return {
                ...state,
                [`${action.season}_${action.rule}`]: {
                    topList: [],
                    isFetching: true,
                    expires: 0,
                },
            };
        case RECEIVE_TOP_LIST:
            return {
                ...state,
                [`${action.season}_${action.rule}`]: {
                    topList: action.topList,
                    isFetching: false,
                    expires: Date.now() + 10800000,
                },
            };
        default:
            return state;
    }
};

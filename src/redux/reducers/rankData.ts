import {
    REQUEST_RANK_DATA,
    RECEIVE_RANK_DATA,
    RequestRankData,
    ReceiveRankData,
    RankDataResponse,
} from "../actions/rankData";

export type RankDataState = {
    [season: number]: {
        [pmId: number]: {
            rank: RankDataResponse;
            isFetching: boolean;
            expires: number;
        };
    };
};

const storeRankData = (
    state: RankDataState = {},
    action: RequestRankData | ReceiveRankData
): RankDataState => {
    const time = Date.now() + 10800000;

    if (!state.hasOwnProperty(action.season)) {
        return {
            ...state,
            [action.season]: {
                [action.pmId]: {
                    rank:
                        action.type === REQUEST_RANK_DATA
                            ? {}
                            : action.rankData,
                    isFetching: action.type === REQUEST_RANK_DATA,
                    expires: action.type === REQUEST_RANK_DATA ? 0 : time,
                },
            },
        };
    }

    return {
        ...state,
        [action.season]: {
            ...state[action.season as number],
            [action.pmId]: {
                rank: action.type === REQUEST_RANK_DATA ? {} : action.rankData,
                isFetching: action.type === REQUEST_RANK_DATA,
                expires: action.type === REQUEST_RANK_DATA ? 0 : time,
            },
        },
    };
};

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (
    state: RankDataState = {},
    action: RequestRankData | ReceiveRankData
): RankDataState => {
    switch (action.type) {
        case REQUEST_RANK_DATA:
        case RECEIVE_RANK_DATA:
            return storeRankData(state, action);
        default:
            return state;
    }
};

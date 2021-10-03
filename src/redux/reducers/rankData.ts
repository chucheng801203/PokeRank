import {
    GET_RANK_DATA,
    RankDataAction,
    RankDataResponse,
} from "../actions/rankData";

export type RankDataState = {
    [season: number]: {
        [pmId: number]: {
            rank: RankDataResponse;
            expires: number;
        };
    };
};

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
const storeRankData = (
    state: RankDataState = {},
    action: RankDataAction
): RankDataState => {
    const time = new Date(new Date().toDateString()).getTime() + 86400000;

    if (!state.hasOwnProperty(action.season)) {
        return {
            ...state,
            [action.season]: {
                [action.pmId]: {
                    rank: action.rankData,
                    expires: time,
                },
            },
        };
    }

    return {
        ...state,
        [action.season]: {
            ...state[action.season as number],
            [action.pmId]: {
                rank: action.rankData,
                expires: time,
            },
        },
    };
};

export default (
    state: RankDataState = {},
    action: RankDataAction
): RankDataState => {
    switch (action.type) {
        case GET_RANK_DATA:
            return storeRankData(state, action);
        default:
            return state;
    }
};

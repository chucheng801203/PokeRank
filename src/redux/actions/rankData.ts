import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";

export const REQUEST_RANK_DATA = "REQUEST_RANK_DATA";
export const RECEIVE_RANK_DATA = "RECEIVE_RANK_DATA";

export type RankPokemonData = {
    [rule: number]: {
        [formId: number]: Array<{
            id: number;
            form_id: number;
        }>;
    };
};

export type RankPercentageData = {
    [rule: number]: {
        [formId: number]: Array<{
            id: number;
            percentage: string;
        }>;
    };
};

export type RankDataResponse = {
    rank: {
        [rule: number]: {
            [formId: number]: number;
        };
    };
    team: {
        pokemon: RankPokemonData;
        move: RankPercentageData;
        ability: RankPercentageData;
        nature: RankPercentageData;
        item: RankPercentageData;
    };
    win: {
        pokemon: RankPokemonData;
        move: RankPercentageData;
    };
    lose: {
        pokemon: RankPokemonData;
        move: RankPercentageData;
    };
};

export interface RequestRankData {
    type: typeof REQUEST_RANK_DATA;
    season: number | string;
    pmId: number | string;
}

export interface ReceiveRankData {
    type: typeof RECEIVE_RANK_DATA;
    season: number | string;
    pmId: number | string;
    rankData: RankDataResponse;
}

export const rankDataCheck = (rankData: any) => {
    if (!rankData) return false;

    if (!rankData.hasOwnProperty("rank")) return false;

    const cols = ["team", "win", "lose"];

    for (let i = 0; i < cols.length; i++) {
        if (!rankData.hasOwnProperty(cols[i])) return false;

        let col = rankData[cols[i]];
        let hasCol = col.hasOwnProperty;

        if (cols[i] === "team") {
            if (
                !hasCol.call(col, "ability") ||
                !hasCol.call(col, "nature") ||
                !hasCol.call(col, "item")
            )
                return false;
        }

        if (!hasCol.call(col, "pokemon") || !hasCol.call(col, "move"))
            return false;
    }

    return true;
};

const rankDataApi = (
    seasonNum: number,
    pmId: number
): Promise<RankDataResponse | false> => {
    const url = `${process.env.REACT_APP_RANK_DATA_PATH}/${seasonNum}/${pmId}.json`;
    return window.fetch(url).then((response) => response.json());
};

const fetchRankData =
    (
        pmId: number
    ): ThunkAction<
        void,
        RootState,
        unknown,
        RequestRankData | ReceiveRankData
    > =>
    (dispatch, getState) => {
        const { season } = getState();

        dispatch({
            type: REQUEST_RANK_DATA,
            season: season[0].value,
            pmId: pmId,
        });

        rankDataApi(season[0].value, pmId)
            .then((data) => {
                if (!data || !rankDataCheck(data)) {
                    alert("與伺服器連接失敗，請稍後在試。");
                    return;
                }

                dispatch({
                    type: RECEIVE_RANK_DATA,
                    season: season[0].value,
                    pmId: pmId,
                    rankData: data,
                });
            })
            .catch((e) => {
                alert("與伺服器連接失敗，請稍後在試。");
                console.log(e);
            });
    };

export const shouldFetchRankData = (
    state: RootState,
    pmId: number
): boolean => {
    const { season, rankData } = state;

    const currentRankData = rankData[season[0].value as number];

    if (!currentRankData || !currentRankData[pmId]) {
        return true;
    }

    if (
        !currentRankData[pmId].isFetching &&
        Date.now() > currentRankData[pmId].expires
    ) {
        return true;
    }

    return false;
};

export const fetchRankDataIfNeed: (
    pmId: number
) => ThunkAction<void, RootState, unknown, AnyAction> =
    (pmId) => (dispatch, getState) => {
        const state = getState();

        if (shouldFetchRankData(state, pmId)) {
            dispatch(fetchRankData(pmId));
        }
    };

import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";

export const GET_RANK_DATA = "getRankData";

export type RankDataResponse = {
    rank: {
        [rule: number]: {
            [formId: number]: number;
        };
    };
    team: {
        pokemon: {
            [rule: number]: {
                [formId: number]: Array<{
                    id: number;
                    form_id: number;
                }>;
            };
        };
        move: {
            [rule: number]: {
                [formId: number]: Array<{
                    id: number;
                    percentage: string;
                }>;
            };
        };
        ability: {
            [rule: number]: {
                [formId: number]: Array<{
                    id: number;
                    percentage: string;
                }>;
            };
        };
        nature: {
            [rule: number]: {
                [formId: number]: Array<{
                    id: number;
                    percentage: string;
                }>;
            };
        };
        item: {
            [rule: number]: {
                [formId: number]: Array<{
                    id: number;
                    percentage: string;
                }>;
            };
        };
    };
    win: {
        pokemon: {
            [rule: number]: {
                [formId: number]: Array<{
                    id: number;
                    form_id: number;
                }>;
            };
        };
        move: {
            [rule: number]: {
                [formId: number]: Array<{
                    id: number;
                    percentage: string;
                }>;
            };
        };
    };
    lose: {
        pokemon: {
            [rule: number]: {
                [formId: number]: Array<{
                    id: number;
                    form_id: number;
                }>;
            };
        };
        move: {
            [rule: number]: {
                [formId: number]: Array<{
                    id: number;
                    percentage: string;
                }>;
            };
        };
    };
};

export interface RankDataAction {
    type: typeof GET_RANK_DATA;
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

const getRankData: (
    pmId: number
) => ThunkAction<void, RootState, unknown, RankDataAction> =
    (pmId) => (dispatch, getState) => {
        const state = getState();
        const url = `https://pokerank.s3.ap-northeast-1.amazonaws.com/rank_data/${state.season[0].value}/${pmId}.json`;

        import("axios").then((axios) => {
            axios.default
                .get<RankDataResponse>(url)
                .then(function (response) {
                    const { data } = response;

                    if (!rankDataCheck(data)) {
                        alert("與伺服器連接失敗，請稍後在試。");
                        return;
                    }

                    dispatch({
                        type: GET_RANK_DATA,
                        season: state.season[0].value,
                        pmId: pmId,
                        rankData: data,
                    });
                })
                .catch((e) => {
                    alert("與伺服器連接失敗，請稍後在試。");
                    console.log(e);
                });
        });
    };

export default getRankData;

import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";

export const GET_RANK_DATA = "getRankData";

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

const rankDataApi = async (
    seasonNum: number,
    pmId: number
): Promise<RankDataResponse | false> => {
    const url = `${process.env.REACT_APP_RANK_DATA_PATH}/${seasonNum}/${pmId}.json`;
    const response = await window.fetch(url);

    if (!response.ok) return false;

    return await response.json();
};

const getRankData =
    (pmId: number): ThunkAction<void, RootState, unknown, RankDataAction> =>
    (dispatch, getState) => {
        const { season } = getState();

        rankDataApi(season[0].value, pmId)
            .then((data) => {
                if (!data || !rankDataCheck(data)) {
                    alert("與伺服器連接失敗，請稍後在試。");
                    return;
                }

                dispatch({
                    type: GET_RANK_DATA,
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

export default getRankData;

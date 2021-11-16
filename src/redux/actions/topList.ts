import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";

export const GET_TOP_LIST = "getTopList";

export type TopListResponse = Array<{
    pokemon: {
        id: number;
        form_id: number;
    };
    ranking: number;
}>;

export interface TopListAction {
    type: typeof GET_TOP_LIST;
    season: number;
    rule: number;
    topList: TopListResponse;
}

export const topListTypeCheck = (topList: TopListResponse) => {
    if (!Array.isArray(topList)) {
        return false;
    }

    for (let i = 0; i < topList.length; i++) {
        if (typeof topList[i].ranking !== "number") {
            return false;
        }

        if (!topList[i].pokemon) {
            return false;
        }

        if (typeof topList[i].pokemon.id !== "number") {
            return false;
        }

        if (typeof topList[i].pokemon.form_id !== "number") {
            return false;
        }
    }

    return true;
};

const topListApi = async (
    seasonNum: number,
    ruleNum: number
): Promise<TopListResponse | false> => {
    const url = `${process.env.REACT_APP_RANK_DATA_PATH}/${seasonNum}/top_list/${ruleNum}.json`;
    const response = await window.fetch(url);

    if (!response.ok) return false;

    return await response.json();
};

const getTopList: ThunkAction<void, RootState, unknown, TopListAction> = (
    dispatch,
    getState
) => {
    const { season, rule } = getState();

    topListApi(season[0].value, rule[0].value)
        .then((data) => {
            if (!data || !topListTypeCheck(data)) {
                alert("與伺服器連接失敗，請稍後在試。");
                return;
            }

            dispatch({
                type: GET_TOP_LIST,
                season: season[0].value,
                rule: rule[0].value,
                topList: data,
            });
        })
        .catch((e) => {
            alert("與伺服器連接失敗，請稍後在試。");
            console.log(e);
        });
};

export default getTopList;

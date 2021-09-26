import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";

export const GET_TOPLIST = "getTopList";

export type TopListResponse = Array<{
    pokemon: {
        id: number;
        form_id: number;
    };
    ranking: number;
}>;

export interface TopListAction {
    type: typeof GET_TOPLIST;
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

const getTopList: ThunkAction<void, RootState, unknown, TopListAction> = (dispatch, getState) => {
    const state = getState();
    const url = `/api/rank/top150/${state.season[0].value}/${state.rule[0].value}`;

    import("axios").then((axios) => {
        axios.default
            .get<TopListResponse>(url)
            .then(function (response) {
                const { data } = response;

                if (!topListTypeCheck(data)) {
                    alert("與伺服器連接失敗，請稍後在試。");
                    return;
                }

                dispatch({
                    type: GET_TOPLIST,
                    season: state.season[0].value,
                    rule: state.rule[0].value,
                    topList: data,
                });
            })
            .catch((e) => {
                alert("與伺服器連接失敗，請稍後在試。");
                console.log(e);
            });
    });
};

export default getTopList;

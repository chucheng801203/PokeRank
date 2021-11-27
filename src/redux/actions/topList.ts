import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";

export const REQUEST_TOP_LIST = "REQUEST_TOP_LIST";
export const RECEIVE_TOP_LIST = "RECEIVE_TOP_LIST";

export type TopListResponse = Array<{
    pokemon: {
        id: number;
        form_id: number;
    };
    ranking: number;
}>;

export type RequestTopList = {
    type: typeof REQUEST_TOP_LIST;
    season: number;
    rule: number;
};

export type ReceiveTopList = {
    type: typeof RECEIVE_TOP_LIST;
    season: number;
    rule: number;
    topList: TopListResponse;
};

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

export const topListApi = (
    seasonNum: number,
    ruleNum: number
): Promise<TopListResponse | false> => {
    const url = `${process.env.REACT_APP_RANK_DATA_PATH}/${seasonNum}/top_list/${ruleNum}.json`;
    return window.fetch(url).then((response) => response.json());
};

export const fetchTopList: () => ThunkAction<
    void,
    RootState,
    unknown,
    ReceiveTopList | RequestTopList
> = () => (dispatch, getState) => {
    const { season, rule } = getState();

    dispatch({
        type: REQUEST_TOP_LIST,
        season: season[0].value,
        rule: rule[0].value,
    });

    topListApi(season[0].value, rule[0].value)
        .then((data) => {
            if (!data || !topListTypeCheck(data)) {
                alert("與伺服器連接失敗，請稍後在試。");
                return;
            }

            dispatch({
                type: RECEIVE_TOP_LIST,
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

export const shouldFetchTopList = (state: RootState): boolean => {
    const { season, rule, topList } = state;

    const currentList = topList[`${season[0].value}_${rule[0].value}`];

    if (!currentList) {
        return true;
    }

    if (!currentList.isFetching && Date.now() > currentList.expires) {
        return true;
    }

    return false;
};

export const fetchTopListIfNeed: () => ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> = () => (dispatch, getState) => {
    const state = getState();

    if (shouldFetchTopList(state)) {
        dispatch(fetchTopList());
    }
};

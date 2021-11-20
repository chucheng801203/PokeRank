import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducers";
import { RuleState } from "./reducers/rule";
import { SeasonState } from "./reducers/season";
import { TopListState } from "./reducers/topList";
import { RankDataState } from "./reducers/rankData";
import { SearchTextState } from "./reducers/searchText";
import { ActivePokemonState } from "./reducers/activePokemon";
import { PageDataType } from "../contexts/PageDataContext";

export type RootState = {
    rule: Array<RuleState>;
    season: Array<SeasonState>;
    topList: TopListState;
    rankData: RankDataState;
    searchText: SearchTextState;
    activePokemon: ActivePokemonState;
};

export const defaultState: RootState = {
    rule: [],
    season: [],
    topList: {},
    rankData: {},
    searchText: "",
    activePokemon: {},
};

// 當頁面資料載入時取得預設的頁面狀態
export const getDefaultState = (pageData: PageDataType): RootState => {
    const defaultRule = {
        index: pageData.rules.length - 1,
        value: pageData.rules[pageData.rules.length - 1].value,
    };

    const defaultSeason = {
        index: pageData.seasons.length - 1,
        value: pageData.seasons[pageData.seasons.length - 1].value,
    };

    return {
        rule: [defaultRule],
        season: [defaultSeason],
        topList: {},
        rankData: [],
        searchText: "",
        activePokemon: {},
    };
};

export default createStore(reducer, defaultState, applyMiddleware(thunk));

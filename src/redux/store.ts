import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducers";
import { RuleState, SeasonState } from "./reducers/rs";
import { TopListState } from "./reducers/topList";
import { RankDataState } from "./reducers/rankData";
import { SearchTextState } from "./reducers/searchText";
import { ActivePokemonState } from "./reducers/activePokemon";
import { PageDataType } from "../contexts/PageDataContext";
import PageDataException from "../exceptions/PageDataException";

export interface RootState {
    rs: {
        rule?: RuleState;
        season?: SeasonState;
    };
    topList: TopListState;
    rankData: RankDataState;
    searchText: SearchTextState;
    activePokemon: ActivePokemonState;
}

export interface DefaultState extends RootState {
    rs: {
        rule: RuleState;
        season: SeasonState;
    };
}

export const defaultState: RootState = {
    rs: {},
    topList: {},
    rankData: {},
    searchText: "",
    activePokemon: {},
};

// 當頁面資料載入時取得預設的頁面狀態
export const getDefaultState = (pageData: PageDataType): DefaultState => {
    const { rules, seasons } = pageData;

    if (!rules || !seasons) {
        throw new PageDataException();
    }

    const defaultRule = {
        index: rules.length - 1,
        value: rules[rules.length - 1].value,
    };

    const defaultSeason = {
        index: seasons.length - 1,
        value: seasons[seasons.length - 1].value,
    };

    return {
        rs: {
            rule: defaultRule,
            season: defaultSeason,
        },
        topList: {},
        rankData: [],
        searchText: "",
        activePokemon: {},
    };
};

export default createStore(reducer, defaultState, applyMiddleware(thunk));

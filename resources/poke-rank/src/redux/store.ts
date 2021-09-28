import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducers";
import { RuleState } from "./reducers/rule";
import { SeasonState } from "./reducers/season";
import { TopListState } from "./reducers/topList";
import { RankDataState } from "./reducers/rankData";
import { SearchTextState } from "./reducers/searchText";

export type RootState = {
    rule: Array<RuleState>;
    season: Array<SeasonState>;
    topList: TopListState;
    rankData: RankDataState;
    searchText: SearchTextState;
};

export const defaultState: RootState = {
    rule: [],
    season: [],
    topList: {},
    rankData: {},
    searchText: "",
};

export default createStore(reducer, undefined, applyMiddleware(thunk));

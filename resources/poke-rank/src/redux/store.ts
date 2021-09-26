import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducers";
import { RuleState } from "./reducers/rule";
import { SeasonState } from "./reducers/season";
import { TopListState } from "./reducers/topList";
import { RankDataState } from "./reducers/rankData";
import { SearchTextState } from "./reducers/searchText";
import { PR_DATA } from "../PrContext";
import { getParameterByName } from "../util";

export type RootState = {
    rule: Array<RuleState>;
    season: Array<SeasonState>;
    topList: TopListState;
    rankData: RankDataState;
    searchText: SearchTextState;
};

export const defaultState: RootState = {
    rule: [{ index: 0, value: PR_DATA.rules[0].value }],
    season: [
        {
            index: PR_DATA.seasons.length - 1,
            value: PR_DATA.seasons[PR_DATA.seasons.length - 1].value,
        },
    ],
    topList: {},
    rankData: {},
    searchText: "",
};

const defaultValue = JSON.parse(JSON.stringify(defaultState));

const rule = getParameterByName("rule");
if (rule) {
    for (let i = 0; i < PR_DATA.rules.length; i++) {
        if (PR_DATA.rules[i].value === parseInt(rule)) {
            defaultValue.rule = [
                {
                    index: i,
                    value: PR_DATA.rules[i].value,
                },
            ];
            break;
        }
    }
}

const season = getParameterByName("season");
if (season) {
    for (let i = 0; i < PR_DATA.seasons.length; i++) {
        if (PR_DATA.seasons[i].value === parseInt(season)) {
            defaultValue.season = [
                {
                    index: i,
                    value: PR_DATA.seasons[i].value,
                },
            ];
            break;
        }
    }
}

export default createStore(reducer, defaultValue, applyMiddleware(thunk));

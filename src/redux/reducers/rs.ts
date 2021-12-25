import { TOGGLE_RULE, RuleAction } from "../actions/rule";
import { TOGGLE_SEASON, ToggleSeasonAction } from "../actions/season";

export interface RuleState {
    index: number;
    value: number;
}

export interface SeasonState {
    index: number;
    value: number;
}

export type rs = {
    rule?: RuleState;
    season?: SeasonState;
};

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (
    state: rs = {},
    action: RuleAction | ToggleSeasonAction
): rs => {
    switch (action.type) {
        case TOGGLE_RULE:
            return {
                ...state,
                rule: {
                    index: action.index,
                    value: action.value,
                },
            };
        case TOGGLE_SEASON:
            return {
                ...state,
                season: {
                    index: action.index,
                    value: action.value,
                },
            };
        default:
            return state;
    }
};

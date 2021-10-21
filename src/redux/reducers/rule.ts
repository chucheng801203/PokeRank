import { TOGGLE_RULE, RuleAction } from "../actions/rule";

export interface RuleState {
    index: number;
    value: number;
}

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (
    state: Array<RuleState> = [],
    action: RuleAction
): Array<RuleState> => {
    switch (action.type) {
        case TOGGLE_RULE:
            return [
                {
                    index: action.index,
                    value: action.value,
                },
            ];
        default:
            return state;
    }
};

import { RuleState } from "../reducers/rule";

export const TOGGLE_RULE = "toggleRule";

export interface RuleAction extends RuleState {
    type: typeof TOGGLE_RULE;
}

export default (rule: RuleState): RuleAction => ({
    type: TOGGLE_RULE,
    ...rule,
});

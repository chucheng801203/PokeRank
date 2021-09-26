import { TOGGLE_SEASON, ToggleSeasonAction } from "../actions/season";

export interface SeasonState {
    index: number;
    value: number;
}

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (state: Array<SeasonState> = [], action: ToggleSeasonAction) => {
    switch (action.type) {
        case TOGGLE_SEASON:
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

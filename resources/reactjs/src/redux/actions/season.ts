import { SeasonState } from "../reducers/season";

export const TOGGLE_SEASON = "toggleSeason";

export interface ToggleSeasonAction extends SeasonState {
    type: typeof TOGGLE_SEASON;
}

export default (season: SeasonState): ToggleSeasonAction => ({
    type: TOGGLE_SEASON,
    ...season,
});

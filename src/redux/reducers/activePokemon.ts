import {
    GET_ACTIVE_POKEMON,
    ActivePokemonAction,
    ActivePokemonResponse,
} from "../actions/activePokemon";

export type ActivePokemonState = {
    [season_rule: string]: ActivePokemonResponse;
};

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (
    state: ActivePokemonState = {},
    action: ActivePokemonAction
): ActivePokemonState => {
    switch (action.type) {
        case GET_ACTIVE_POKEMON:
            return {
                ...state,
                [`${action.season}_${action.rule}`]: action.activePokemon,
            };
        default:
            return state;
    }
};

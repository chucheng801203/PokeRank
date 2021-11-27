import {
    REQUEST_ACTIVE_POKEMON,
    RECEIVE_ACTIVE_POKEMON,
    RequestActivePokemon,
    ReceiveActivePokemon,
    ActivePokemonResponse,
} from "../actions/activePokemon";

export type ActivePokemonState = {
    [season_rule: string]: {
        activePokemon: ActivePokemonResponse;
        isFetching: boolean;
    };
};

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (
    state: ActivePokemonState = {},
    action: RequestActivePokemon | ReceiveActivePokemon
): ActivePokemonState => {
    switch (action.type) {
        case REQUEST_ACTIVE_POKEMON:
            return {
                ...state,
                [`${action.season}_${action.rule}`]: {
                    activePokemon: [],
                    isFetching: true,
                },
            };
        case RECEIVE_ACTIVE_POKEMON:
            return {
                ...state,
                [`${action.season}_${action.rule}`]: {
                    activePokemon: action.activePokemon,
                    isFetching: false,
                },
            };
        default:
            return state;
    }
};

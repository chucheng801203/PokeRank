import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";

export const REQUEST_ACTIVE_POKEMON = "REQUEST_ACTIVE_POKEMON";
export const RECEIVE_ACTIVE_POKEMON = "RECEIVE_ACTIVE_POKEMON";

export type ActivePokemonResponse = Array<{
    pf_id: number;
    id: number;
    form_id: number;
}>;

export type RequestActivePokemon = {
    type: typeof REQUEST_ACTIVE_POKEMON;
    season: number;
    rule: number;
};

export type ReceiveActivePokemon = {
    type: typeof RECEIVE_ACTIVE_POKEMON;
    season: number;
    rule: number;
    activePokemon: ActivePokemonResponse;
};

export const activePokemonTypeCheck = (
    activePokemon: ActivePokemonResponse
) => {
    if (!Array.isArray(activePokemon)) {
        return false;
    }

    for (let i = 0; i < activePokemon.length; i++) {
        if (typeof activePokemon[i].pf_id !== "number") {
            return false;
        }

        if (typeof activePokemon[i].id !== "number") {
            return false;
        }

        if (typeof activePokemon[i].form_id !== "number") {
            return false;
        }
    }

    return true;
};

const activePokemonApi = (
    seasonNum: number,
    ruleNum: number
): Promise<ActivePokemonResponse | false> => {
    const url = `${process.env.REACT_APP_RANK_DATA_PATH}/${seasonNum}/active_pokemon/${ruleNum}.json`;
    return window.fetch(url).then((response) => response.json());
};

const fetchActivePokemon: () => ThunkAction<
    void,
    RootState,
    unknown,
    RequestActivePokemon | ReceiveActivePokemon
> = () => (dispatch, getState) => {
    const { season, rule } = getState();

    dispatch({
        type: REQUEST_ACTIVE_POKEMON,
        season: season[0].value,
        rule: rule[0].value,
    });

    activePokemonApi(season[0].value, rule[0].value)
        .then((data) => {
            if (!data || !activePokemonTypeCheck(data)) {
                alert("與伺服器連接失敗，請稍後在試。");
                return;
            }

            dispatch({
                type: RECEIVE_ACTIVE_POKEMON,
                season: season[0].value,
                rule: rule[0].value,
                activePokemon: data,
            });
        })
        .catch((e) => {
            alert("與伺服器連接失敗，請稍後在試。");
            console.log(e);
        });
};

export const shouldFetchActivePokemon = (state: RootState): boolean => {
    const { season, rule, activePokemon } = state;

    const acPms = activePokemon[`${season[0].value}_${rule[0].value}`];

    if (!acPms) {
        return true;
    }

    return false;
};

export const fetchActivePokemonIfNeed: () => ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> = () => (dispatch, getState) => {
    const state = getState();

    if (shouldFetchActivePokemon(state)) {
        dispatch(fetchActivePokemon());
    }
};

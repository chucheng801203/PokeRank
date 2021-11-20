import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";

export const GET_ACTIVE_POKEMON = "activePokemon";

export type ActivePokemonResponse = Array<{
    pf_id: number;
    id: number;
    form_id: number;
}>;

export type ActivePokemonAction = {
    type: typeof GET_ACTIVE_POKEMON;
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

const activePokemonApi = async (
    seasonNum: number,
    ruleNum: number
): Promise<ActivePokemonResponse | false> => {
    const url = `${process.env.REACT_APP_RANK_DATA_PATH}/${seasonNum}/active_pokemon/${ruleNum}.json`;
    const response = await window.fetch(url);

    if (!response.ok) return false;

    return await response.json();
};

const getActivePokemon: ThunkAction<
    void,
    RootState,
    unknown,
    ActivePokemonAction
> = (dispatch, getState) => {
    const { season, rule } = getState();

    activePokemonApi(season[0].value, rule[0].value)
        .then((data) => {
            if (!data || !activePokemonTypeCheck(data)) {
                alert("與伺服器連接失敗，請稍後在試。");
                return;
            }

            dispatch({
                type: GET_ACTIVE_POKEMON,
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

export default getActivePokemon;

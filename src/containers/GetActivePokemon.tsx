import React, { useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import ActivePokemonPage from "../components/ActivePokemonPage";
import ActivePokemonPageLoading from "../components/ActivePokemonPageLoading";
import activePokemonAction from "../redux/actions/activePokemon";
import {
    getSeasonState,
    getRuleState,
    getActivePokemonState,
} from "../redux/selectors";
import PageDataContext from "../contexts/PageDataContext";

const GetActivePokemon: React.FC = () => {
    const { page_loading } = useContext(PageDataContext);
    const dispatch = useDispatch();
    const season = useSelector(getSeasonState);
    const rule = useSelector(getRuleState);
    const activePokemon = useSelector(getActivePokemonState);

    useEffect(() => {
        if (!page_loading && shouldLoading) dispatch(activePokemonAction);

        document.title = "可使用的寶可夢 - PokéRank";
    });

    if (page_loading) return <ActivePokemonPageLoading />;

    const acPms = activePokemon[`${season[0].value}_${rule[0].value}`];

    const shouldLoading = !acPms;

    return (
        <>
            {shouldLoading ? (
                <ActivePokemonPageLoading />
            ) : (
                <ActivePokemonPage
                    activePokemon={activePokemon}
                    season={season[0]}
                    rule={rule[0]}
                />
            )}
        </>
    );
};

export default GetActivePokemon;

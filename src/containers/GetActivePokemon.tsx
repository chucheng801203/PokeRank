import React, { useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import ActivePokemonPage from "../components/ActivePokemonPage";
import ActivePokemonPageLoading from "../components/ActivePokemonPageLoading";
import { fetchActivePokemonIfNeed } from "../redux/actions/activePokemon";
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
        if (!page_loading) dispatch(fetchActivePokemonIfNeed());

        document.title = "可使用的寶可夢 - PokéRank";
    });

    if (page_loading || !season || !rule) return <ActivePokemonPageLoading />;

    const acPms = activePokemon[`${season.value}_${rule.value}`];

    const isFetching = !acPms || acPms.isFetching;

    return (
        <>
            {isFetching ? (
                <ActivePokemonPageLoading />
            ) : (
                <ActivePokemonPage
                    activePokemon={activePokemon}
                    season={season}
                    rule={rule}
                />
            )}
        </>
    );
};

export default GetActivePokemon;

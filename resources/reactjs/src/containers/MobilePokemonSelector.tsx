import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import PokemonSelectorPage from "../components/PokemonSelectorPage";
import searchTextAction from "../redux/actions/searchText";
import { getSearchTextState } from "../redux/selectors";
import PrContext from "../PrContext";

const MobilePokemonSelector: React.FC = () => {
    const prData = useContext(PrContext);

    const dispatch = useDispatch();

    const searchText = useSelector(getSearchTextState);

    const str = searchText.trim();

    let filterPmId: Array<string>;
    if (!str) {
        filterPmId = Object.keys(prData.pokemon).slice(0, 9);
    } else {
        filterPmId = Object.keys(prData.pokemon).filter((i) => {
            return (
                i.indexOf(str) !== -1 ||
                prData.pokemon[parseInt(i)].indexOf(str) !== -1
            );
        });
    }

    const pokemonOptions: Array<{
        id: number;
        name: string;
    }> = filterPmId.map((i) => {
        const index = parseInt(i);
        return {
            id: index,
            name: prData.pokemon[index],
        };
    });

    return (
        <>
            <PokemonSelectorPage
                value={searchText}
                pokemonOptions={pokemonOptions}
                onChange={(v: string) => {
                    dispatch(searchTextAction(v));
                }}
            />
        </>
    );
};

export default MobilePokemonSelector;

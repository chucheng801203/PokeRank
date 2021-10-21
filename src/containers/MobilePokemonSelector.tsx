import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import PokemonSelectorPage from "../components/PokemonSelectorPage";
import searchTextAction from "../redux/actions/searchText";
import { getSearchTextState } from "../redux/selectors";
import PageDataContext from "../PageDataContext";

const MobilePokemonSelector: React.FC = () => {
    const pageData = useContext(PageDataContext);

    const dispatch = useDispatch();

    const searchText = useSelector(getSearchTextState);

    const str = searchText.trim();

    let filterPmId: Array<string>;
    if (!str) {
        filterPmId = Object.keys(pageData.pokemon).slice(0, 9);
    } else {
        filterPmId = Object.keys(pageData.pokemon).filter((i) => {
            return (
                i.indexOf(str) !== -1 ||
                pageData.pokemon[parseInt(i)].indexOf(str) !== -1
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
            name: pageData.pokemon[index],
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

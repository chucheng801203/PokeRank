import React, { useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import PmList from "../components/PmList";
import PmRow from "../components/PmRow";
import PmRowLoading from "../components/PmRowLoading";
import topListAction from "../redux/actions/topList";
import {
    getSeasonState,
    getRuleState,
    getTopListState,
} from "../redux/selectors";
import PageDataContext from "../PageDataContext";

const RankTopList: React.FC<{
    className?: string;
}> = ({ className }) => {
    const { page_loading, pokemon, pokemon_types } =
        useContext(PageDataContext);
    const dispatch = useDispatch();
    const season = useSelector(getSeasonState);
    const rule = useSelector(getRuleState);
    const topLists = useSelector(getTopListState);

    const now = Date.now();

    const currentList = page_loading
        ? undefined
        : topLists[`${season[0].value}_${rule[0].value}`];

    const shouldLoading = !currentList || now > currentList.expires;

    useEffect(() => {
        if (!page_loading && shouldLoading) dispatch(topListAction);

        document.title = "PokéRank";
    });

    return (
        <>
            <h2 className="text-center">寶可夢排行榜</h2>
            <PmList className={className}>
                {shouldLoading
                    ? Array.apply(null, Array(20)).map((v, i) => (
                          <PmRowLoading key={i} />
                      ))
                    : currentList.topList.map((rank, i) => (
                          <PmRow
                              key={i}
                              pmRank={rank.ranking}
                              pmAvatar={`${process.env.REACT_APP_IMAGE_PATH}/cap${rank.pokemon.id}_f${rank.pokemon.form_id}_s0.png`}
                              pmId={rank.pokemon.id}
                              pmFormId={rank.pokemon.form_id}
                              pmName={pokemon[rank.pokemon.id]}
                              pmType={
                                  pokemon_types[rank.pokemon.id][
                                      rank.pokemon.form_id
                                  ]
                              }
                          />
                      ))}
            </PmList>
        </>
    );
};

export default RankTopList;

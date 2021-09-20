import React, { useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import PmList from "../components/PmList";
import PmRow from "../components/PmRow";
import topListAction from "../redux/actions/topList";
import {
    getSeasonState,
    getRuleState,
    getTopListState,
} from "../redux/selectors";
import PrContext from "../PrContext";

type RankTopList = React.FC<{
    className?: string;
}>;

const RankTopList: RankTopList = ({ className }) => {
    const prData = useContext(PrContext);

    const dispatch = useDispatch();
    const season = useSelector(getSeasonState);
    const rule = useSelector(getRuleState);
    const topList = useSelector(getTopListState);

    const currentList = topList[`${season[0].value}_${rule[0].value}`];
    const now = Date.now();

    const shouldLoading = !currentList || now > currentList.expires;

    useEffect(() => {
        if (shouldLoading) {
            dispatch(topListAction);
        }
        window.scroll(0, 0);
    });

    const rows = [];

    if (shouldLoading) {
        for (let i = 0; i < 10; i++) {
            rows.push(<PmRow key={i} isLoading={true} />);
        }
    } else {
        currentList.topList.forEach((pokeDex, i) => {
            rows.push(
                <PmRow
                    key={i}
                    pmRank={pokeDex.ranking}
                    pmAvatar={`/storage/pokemon_images/cap${pokeDex.pokemon.id}_f${pokeDex.pokemon.form_id}_s0.png`}
                    pmId={pokeDex.pokemon.id}
                    pmFormId={pokeDex.pokemon.form_id}
                    pmName={prData.pokemon[pokeDex.pokemon.id]}
                    pmType={
                        prData.pokemon_types[pokeDex.pokemon.id][
                            pokeDex.pokemon.form_id
                        ]
                    }
                />
            );
        });
    }

    return <PmList className={className}>{rows}</PmList>;
};

export default RankTopList;

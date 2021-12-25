import React, { useContext } from "react";
import PmList from "./ListComponent/PmList";
import PmRow from "./ListComponent/PmRow";
import { TopListState } from "../redux/reducers/topList";
import { RuleState, SeasonState } from "../redux/reducers/rs";
import PageDataContext from "../contexts/PageDataContext";
import styles from "./rankTopList.module.scss";

export type RankTopListProps = {
    topList: TopListState;
    season: SeasonState;
    rule: RuleState;
};

const RankTopList: React.FC<RankTopListProps> = ({ topList, season, rule }) => {
    const { pokemon, pokemon_types } = useContext(PageDataContext);
    const currentList = topList[`${season.value}_${rule.value}`];

    return (
        <PmList className={styles["list"]}>
            {currentList.topList.map((rank, i) => (
                <PmRow
                    key={i}
                    pmRank={rank.ranking}
                    pmAvatar={`${process.env.REACT_APP_IMAGE_PATH}/cap${rank.pokemon.id}_f${rank.pokemon.form_id}_s0.png`}
                    pmId={rank.pokemon.id}
                    pmFormId={rank.pokemon.form_id}
                    pmName={pokemon[rank.pokemon.id]}
                    pmType={
                        pokemon_types[rank.pokemon.id][rank.pokemon.form_id]
                    }
                />
            ))}
        </PmList>
    );
};

export default RankTopList;

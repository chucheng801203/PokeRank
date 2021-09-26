import React, { useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import PmInfoBlock from "../components/PmInfoBlock";
import PmList from "../components/PmList";
import PmRow from "../components/PmRow";
import PercentageRow from "../components/PercentageRow";
import rankDataAction from "../redux/actions/rankData";
import {
    getRuleState,
    getSeasonState,
    getRankDataState,
} from "../redux/selectors";
import PrContext from "../PrContext";
import { defaultState } from "../redux/store";
import bootstrap from "bootstrap/dist/css/bootstrap-grid.min.css";

export type PokemonDetailUrlParams = {
    pmId: string;
    formId: string;
};

const GetRankData: React.FC = () => {
    const { pmId, formId } = useParams<PokemonDetailUrlParams>();

    if (!/^\d+$/.test(pmId) || !/^\d+$/.test(formId)) {
        const historyState = useHistory();
        const { rule, season } = defaultState;

        historyState.replace("", {
            rule: rule[0],
            season: season[0],
        });

        return null;
    }

    const prData = useContext(PrContext);

    const pmIdNum = parseInt(pmId);
    const formIdNum = parseInt(formId);

    const dispatch = useDispatch();
    const season = useSelector(getSeasonState);
    const rule = useSelector(getRuleState);
    const rankData = useSelector(getRankDataState);

    const currentRankData = rankData[season[0].value as number];
    const now = Date.now();

    const shouldLoading =
        !currentRankData ||
        !currentRankData[pmIdNum] ||
        now > currentRankData[pmIdNum].expires;

    useEffect(() => {
        if (shouldLoading) dispatch(rankDataAction(pmIdNum));

        window.scroll(0, 0);
    });

    let pmInfo: React.ReactNode;
    let teamPokemons: React.ReactNode;
    let move: React.ReactNode;
    let ability: React.ReactNode;
    let nature: React.ReactNode;
    let item: React.ReactNode;
    let winPokemons: React.ReactNode;
    let winMove: React.ReactNode;
    let losePokemons: React.ReactNode;
    let loseMove: React.ReactNode;

    if (shouldLoading) {
        pmInfo = <PmInfoBlock isLoading={shouldLoading} />;

        teamPokemons = Array.apply(null, Array(10)).map((v, i) => (
            <PmRow key={i} isLoading={true} />
        ));

        move = Array.apply(null, Array(10)).map((v, i) => (
            <PercentageRow key={i} isLoading={true} />
        ));

        ability = Array.apply(null, Array(2)).map((v, i) => (
            <PercentageRow key={i} isLoading={true} />
        ));

        nature = Array.apply(null, Array(8)).map((v, i) => (
            <PercentageRow key={i} isLoading={true} />
        ));

        item = Array.apply(null, Array(10)).map((v, i) => (
            <PercentageRow key={i} isLoading={true} />
        ));

        winPokemons = Array.apply(null, Array(10)).map((v, i) => (
            <PmRow key={i} isLoading={true} />
        ));

        winMove = Array.apply(null, Array(10)).map((v, i) => (
            <PercentageRow key={i} isLoading={true} />
        ));

        losePokemons = Array.apply(null, Array(10)).map((v, i) => (
            <PmRow key={i} isLoading={true} />
        ));

        loseMove = Array.apply(null, Array(10)).map((v, i) => (
            <PercentageRow key={i} isLoading={true} />
        ));
    } else {
        pmInfo = (
            <PmInfoBlock
                pmId={pmIdNum}
                formId={formIdNum}
                pmRank={
                    currentRankData[pmIdNum].rank.rank[rule[0].value]
                        ? currentRankData[pmIdNum].rank.rank[rule[0].value][
                              formIdNum
                          ]
                        : undefined
                }
            />
        );

        const { team, win, lose } = currentRankData[pmIdNum].rank;
        if (
            team.pokemon[rule[0].value] &&
            Array.isArray(team.pokemon[rule[0].value][formIdNum])
        ) {
            teamPokemons = team.pokemon[rule[0].value][formIdNum].map(
                (v, i) => {
                    if (
                        typeof v.id !== "number" ||
                        typeof v.form_id !== "number"
                    )
                        return null;

                    return (
                        <PmRow
                            key={i}
                            pmRank={i}
                            pmAvatar={`/storage/pokemon_images/cap${v.id}_f${v.form_id}_s0.png`}
                            pmId={v.id}
                            pmFormId={v.form_id}
                            pmName={prData.pokemon[v.id]}
                            pmType={prData.pokemon_types[v.id][v.form_id]}
                        />
                    );
                }
            );
        }

        if (
            team.move[rule[0].value] &&
            Array.isArray(team.move[rule[0].value][formIdNum])
        ) {
            move = team.move[rule[0].value][formIdNum].map((v, i) => {
                if (
                    typeof v.id !== "number" ||
                    typeof v.percentage !== "string"
                )
                    return null;

                return (
                    <PercentageRow
                        key={i}
                        rank={i + 1}
                        name={prData.moves[v.id] ? prData.moves[v.id].name : ""}
                        percentage={v.percentage}
                    />
                );
            });
        }

        if (
            team.ability[rule[0].value] &&
            Array.isArray(team.ability[rule[0].value][formIdNum])
        ) {
            ability = team.ability[rule[0].value][formIdNum].map((v, i) => {
                if (
                    typeof v.id !== "number" ||
                    typeof v.percentage !== "string"
                )
                    return null;

                return (
                    <PercentageRow
                        key={i}
                        rank={i + 1}
                        name={prData.abilities[v.id]}
                        percentage={v.percentage}
                    />
                );
            });
        }

        if (
            team.nature[rule[0].value] &&
            Array.isArray(team.nature[rule[0].value][formIdNum])
        ) {
            nature = team.nature[rule[0].value][formIdNum].map((v, i) => {
                if (
                    typeof v.id !== "number" ||
                    typeof v.percentage !== "string"
                )
                    return null;

                return (
                    <PercentageRow
                        key={i}
                        rank={i + 1}
                        name={prData.natures[v.id]}
                        percentage={v.percentage}
                    />
                );
            });
        }

        if (
            team.item[rule[0].value] &&
            Array.isArray(team.item[rule[0].value][formIdNum])
        ) {
            item = team.item[rule[0].value][formIdNum].map((v, i) => {
                if (
                    typeof v.id !== "number" ||
                    typeof v.percentage !== "string"
                )
                    return null;

                return (
                    <PercentageRow
                        key={i}
                        rank={i + 1}
                        name={prData.items[v.id]}
                        percentage={v.percentage}
                    />
                );
            });
        }

        if (
            win.pokemon[rule[0].value] &&
            Array.isArray(win.pokemon[rule[0].value][formIdNum])
        ) {
            winPokemons = win.pokemon[rule[0].value][formIdNum].map((v, i) => {
                if (typeof v.id !== "number" || typeof v.form_id !== "number")
                    return null;

                return (
                    <PmRow
                        key={i}
                        pmRank={i}
                        pmAvatar={`/storage/pokemon_images/cap${v.id}_f${v.form_id}_s0.png`}
                        pmId={v.id}
                        pmFormId={v.form_id}
                        pmName={prData.pokemon[v.id]}
                        pmType={prData.pokemon_types[v.id][v.form_id]}
                    />
                );
            });
        }

        if (
            win.move[rule[0].value] &&
            Array.isArray(win.move[rule[0].value][formIdNum])
        ) {
            winMove = win.move[rule[0].value][formIdNum].map((v, i) => {
                if (
                    typeof v.id !== "number" ||
                    typeof v.percentage !== "string"
                )
                    return null;

                return (
                    <PercentageRow
                        key={i}
                        rank={i + 1}
                        name={prData.moves[v.id] ? prData.moves[v.id].name : ""}
                        percentage={v.percentage}
                    />
                );
            });
        }

        if (
            lose.pokemon[rule[0].value] &&
            Array.isArray(lose.pokemon[rule[0].value][formIdNum])
        ) {
            losePokemons = lose.pokemon[rule[0].value][formIdNum].map(
                (v, i) => {
                    if (
                        typeof v.id !== "number" ||
                        typeof v.form_id !== "number"
                    )
                        return null;

                    return (
                        <PmRow
                            key={i}
                            pmRank={i}
                            pmAvatar={`/storage/pokemon_images/cap${v.id}_f${v.form_id}_s0.png`}
                            pmId={v.id}
                            pmFormId={v.form_id}
                            pmName={prData.pokemon[v.id]}
                            pmType={prData.pokemon_types[v.id][v.form_id]}
                        />
                    );
                }
            );
        }

        if (
            lose.move[rule[0].value] &&
            Array.isArray(lose.move[rule[0].value][formIdNum])
        ) {
            loseMove = lose.move[rule[0].value][formIdNum].map((v, i) => {
                if (
                    typeof v.id !== "number" ||
                    typeof v.percentage !== "string"
                )
                    return null;

                return (
                    <PercentageRow
                        key={i}
                        rank={i + 1}
                        name={prData.moves[v.id] ? prData.moves[v.id].name : ""}
                        percentage={v.percentage}
                    />
                );
            });
        }
    }

    return (
        <>
            {pmInfo}

            <div className={`${bootstrap["row"]}`}>
                {teamPokemons && (
                    <div
                        className={`${bootstrap["col-12"]} ${bootstrap["col-md-6"]} ${bootstrap["col-xl-4"]} ${bootstrap["mb-3"]}`}
                    >
                        <PmList listTitle="一起加入對戰隊伍的寶可夢TOP10">
                            {teamPokemons}
                        </PmList>
                    </div>
                )}

                <div
                    className={`${bootstrap["col-12"]} ${bootstrap["col-md-6"]} ${bootstrap["col-xl-8"]}`}
                >
                    <div className={bootstrap["row"]}>
                        {(move || nature) && (
                            <div
                                className={`${bootstrap["col-12"]} ${bootstrap["col-xl-6"]}`}
                            >
                                {move && (
                                    <PmList
                                        className={bootstrap["mb-3"]}
                                        listTitle="招式"
                                    >
                                        {move}
                                    </PmList>
                                )}

                                {nature && (
                                    <PmList
                                        className={bootstrap["mb-3"]}
                                        listTitle="性格"
                                    >
                                        {nature}
                                    </PmList>
                                )}
                            </div>
                        )}

                        {(ability || item) && (
                            <div
                                className={`${bootstrap["col-12"]} ${bootstrap["col-xl-6"]}`}
                            >
                                {ability && (
                                    <PmList
                                        className={bootstrap["mb-3"]}
                                        listTitle="特性"
                                    >
                                        {ability}
                                    </PmList>
                                )}

                                {item && (
                                    <PmList
                                        className={bootstrap["mb-3"]}
                                        listTitle="道具"
                                    >
                                        {item}
                                    </PmList>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {(winPokemons || winMove) && (
                <div
                    className={bootstrap["mb-4"]}
                    style={{ border: "1px solid #5e5e5e" }}
                />
            )}

            <div className={`${bootstrap["row"]}`}>
                {winPokemons && (
                    <div
                        className={`${bootstrap["col-12"]} ${bootstrap["col-md-6"]} ${bootstrap["mb-3"]}`}
                    >
                        <PmList listTitle="這隻寶可夢打倒的寶可夢TOP10">
                            {winPokemons}
                        </PmList>
                    </div>
                )}

                {winMove && (
                    <div
                        className={`${bootstrap["col-12"]} ${bootstrap["col-md-6"]} ${bootstrap["mb-3"]}`}
                    >
                        <PmList listTitle="這隻寶可夢打倒對手時使用的招式TOP10">
                            {winMove}
                        </PmList>
                    </div>
                )}
            </div>

            {(losePokemons || loseMove) && (
                <div
                    className={bootstrap["mb-4"]}
                    style={{ border: "1px solid #5e5e5e" }}
                />
            )}

            <div className={`${bootstrap["row"]}`}>
                {losePokemons && (
                    <div
                        className={`${bootstrap["col-12"]} ${bootstrap["col-md-6"]} ${bootstrap["mb-3"]}`}
                    >
                        <PmList listTitle="打倒這隻寶可夢的寶可夢TOP10">
                            {losePokemons}
                        </PmList>
                    </div>
                )}

                {loseMove && (
                    <div
                        className={`${bootstrap["col-12"]} ${bootstrap["col-md-6"]} ${bootstrap["mb-3"]}`}
                    >
                        <PmList listTitle="對手打倒這隻寶可夢時使用的招式TOP10">
                            {loseMove}
                        </PmList>
                    </div>
                )}
            </div>
        </>
    );
};

export default GetRankData;

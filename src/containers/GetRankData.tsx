import React, { useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Redirect } from "react-router-dom";
import PmInfoBlock from "../components/PmInfoBlock";
import PmRow from "../components/PmRow";
import RankDataPage from "../components/RankDataPage";
import PercentageRow from "../components/PercentageRow";
import rankDataAction from "../redux/actions/rankData";
import {
    getRuleState,
    getSeasonState,
    getRankDataState,
} from "../redux/selectors";
import PageDataContext from "../PageDataContext";
import { getDefaultState } from "../util";
import styles from "../components/pmRow.module.scss";
import ShowWikiModal from "../components/ShowWikiModal";

const GetRankData: React.FC = () => {
    const { pmId, formId } = useParams<{
        pmId: string;
        formId: string;
    }>();
    const pageData = useContext(PageDataContext);
    const dispatch = useDispatch();
    const season = useSelector(getSeasonState);
    const rule = useSelector(getRuleState);
    const rankData = useSelector(getRankDataState);

    const pmIdNum = parseInt(pmId);
    const formIdNum = parseInt(formId);

    const currentRankData = pageData.page_loading
        ? undefined
        : rankData[season[0].value as number];
    const now = Date.now();

    const isValidPmId = /^\d+$/.test(pmId) && /^\d+$/.test(formId);

    const shouldLoading =
        !currentRankData ||
        !currentRankData[pmIdNum] ||
        now > currentRankData[pmIdNum].expires;

    useEffect(() => {
        if (!pageData.page_loading && shouldLoading && isValidPmId)
            dispatch(rankDataAction(pmIdNum));

        window.scroll(0, 0);
    });

    let pmInfo: React.ReactNode = <PmInfoBlock isLoading={true} />;
    let teamPokemons: React.ReactNode;
    let move: React.ReactNode;
    let ability: React.ReactNode;
    let nature: React.ReactNode;
    let item: React.ReactNode;
    let winPokemons: React.ReactNode;
    let winMove: React.ReactNode;
    let losePokemons: React.ReactNode;
    let loseMove: React.ReactNode;

    let unMatch: React.ReactNode;

    if (!pageData.page_loading && !shouldLoading) {
        document.title = `No. ${pmIdNum} ${pageData.pokemon[pmIdNum]} - PokéRank`;

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
                            className={styles["rank-data-page-sm-pmrow"]}
                            pmRank={i}
                            pmAvatar={`https://pokerank.s3.ap-northeast-1.amazonaws.com/images/cap${v.id}_f${v.form_id}_s0.png`}
                            pmId={v.id}
                            pmFormId={v.form_id}
                            pmName={pageData.pokemon[v.id]}
                            pmType={pageData.pokemon_types[v.id][v.form_id]}
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

                let name = undefined;
                let typeId = undefined;

                if (pageData.moves[v.id]) {
                    name = pageData.moves[v.id].name;
                    typeId = pageData.moves[v.id].type_id;
                }

                return (
                    <ShowWikiModal type="moves" name={name} key={i}>
                        <PercentageRow
                            rank={i + 1}
                            name={name}
                            typeId={typeId}
                            percentage={v.percentage}
                        />
                    </ShowWikiModal>
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

                let name = undefined;

                if (pageData.abilities[v.id]) {
                    name = pageData.abilities[v.id]
                        ? pageData.abilities[v.id].name
                        : "";
                }

                return (
                    <ShowWikiModal type="abilities" name={name} key={i}>
                        <PercentageRow
                            key={i}
                            rank={i + 1}
                            name={name}
                            percentage={v.percentage}
                        />
                    </ShowWikiModal>
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

                let name = undefined;

                if (pageData.abilities[v.id]) {
                    name = pageData.natures[v.id]
                        ? pageData.natures[v.id].name
                        : "";
                }

                return (
                    <ShowWikiModal type="natures" name={name} key={i}>
                        <PercentageRow
                            key={i}
                            rank={i + 1}
                            name={name}
                            percentage={v.percentage}
                        />
                    </ShowWikiModal>
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

                let name = undefined;

                if (pageData.items[v.id]) {
                    name = pageData.items[v.id]
                        ? pageData.items[v.id].name
                        : "";
                }

                return (
                    <ShowWikiModal type="items" name={name} key={i}>
                        <PercentageRow
                            key={i}
                            rank={i + 1}
                            name={name}
                            percentage={v.percentage}
                        />
                    </ShowWikiModal>
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
                        className={styles["rank-data-page-pmrow"]}
                        pmRank={i}
                        pmAvatar={`https://pokerank.s3.ap-northeast-1.amazonaws.com/images/cap${v.id}_f${v.form_id}_s0.png`}
                        pmId={v.id}
                        pmFormId={v.form_id}
                        pmName={pageData.pokemon[v.id]}
                        pmType={pageData.pokemon_types[v.id][v.form_id]}
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

                let name = undefined;
                let typeId = undefined;

                if (pageData.moves[v.id]) {
                    name = pageData.moves[v.id].name;
                    typeId = pageData.moves[v.id].type_id;
                }

                return (
                    <ShowWikiModal type="moves" name={name} key={i}>
                        <PercentageRow
                            key={i}
                            rank={i + 1}
                            name={name}
                            typeId={typeId}
                            percentage={v.percentage}
                        />
                    </ShowWikiModal>
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
                            className={styles["rank-data-page-pmrow"]}
                            pmRank={i}
                            pmAvatar={`https://pokerank.s3.ap-northeast-1.amazonaws.com/images/cap${v.id}_f${v.form_id}_s0.png`}
                            pmId={v.id}
                            pmFormId={v.form_id}
                            pmName={pageData.pokemon[v.id]}
                            pmType={pageData.pokemon_types[v.id][v.form_id]}
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

                let name = undefined;
                let typeId = undefined;

                if (pageData.moves[v.id]) {
                    name = pageData.moves[v.id].name;
                    typeId = pageData.moves[v.id].type_id;
                }

                return (
                    <ShowWikiModal type="moves" name={name} key={i}>
                        <PercentageRow
                            key={i}
                            rank={i + 1}
                            name={name}
                            typeId={typeId}
                            percentage={v.percentage}
                        />
                    </ShowWikiModal>
                );
            });
        }
    } else if (!pageData.page_loading && !isValidPmId) {
        const defaultState = getDefaultState(pageData);
        unMatch = (
            <Redirect
                to={{
                    pathname: "",
                    state: {
                        rule: defaultState.rule[0],
                        season: defaultState.season[0],
                    },
                }}
            />
        );
    }

    return (
        <>
            {!isValidPmId ? (
                <>{unMatch}</>
            ) : (
                <>
                    <RankDataPage
                        isLoading={
                            pageData.page_loading ||
                            shouldLoading ||
                            !isValidPmId
                        }
                        pmInfo={pmInfo}
                        teamPokemons={teamPokemons}
                        move={move}
                        ability={ability}
                        nature={nature}
                        item={item}
                        winPokemons={winPokemons}
                        winMove={winMove}
                        losePokemons={losePokemons}
                        loseMove={loseMove}
                    />
                </>
            )}
        </>
    );
};

export default GetRankData;

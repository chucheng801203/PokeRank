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
import PageDataContext, { BaseStatType } from "../PageDataContext";
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

        document.title = `No. ${pmIdNum} ${pageData.pokemon[pmIdNum]} - PokéRank`;
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
    let baseStat: BaseStatType | undefined;

    let unMatch: React.ReactNode;

    if (!pageData.page_loading && !shouldLoading) {
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

        if (
            pageData.base_stats[pmIdNum] &&
            pageData.base_stats[pmIdNum][formIdNum]
        ) {
            baseStat = pageData.base_stats[pmIdNum][formIdNum];
        }

        const { team, win, lose } = currentRankData[pmIdNum].rank;

        [ability, nature, item] = ["ability", "nature", "item"].map((p) => {
            let key: "abilities" | "natures" | "items";
            
            if (p === "ability") {
                key = "abilities";
            } else if (p === "nature") {
                key = "natures";
            } else if (p === "item") {
                key = "items";
            } else {
                return null;
            }

            if (
                team[p][rule[0].value] &&
                Array.isArray(team[p][rule[0].value][formIdNum])
            ) {
                return team[p][rule[0].value][formIdNum].map((v, i) => {
                    if (
                        typeof v.id !== "number" ||
                        typeof v.percentage !== "string"
                    )
                        return null;

                    let name = undefined;

                    if (pageData[key][v.id]) {
                        name = pageData[key][v.id]
                            ? pageData[key][v.id].name
                            : "";
                    }

                    return (
                        <ShowWikiModal type={key} name={name} key={i}>
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

            return null;
        });

        [teamPokemons, winPokemons, losePokemons] = [team, win, lose].map(
            (p) => {
                if (
                    p.pokemon[rule[0].value] &&
                    Array.isArray(p.pokemon[rule[0].value][formIdNum])
                ) {
                    return p.pokemon[rule[0].value][formIdNum].map((v, i) => {
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
                    });
                }

                return null;
            }
        );

        [move, winMove, loseMove] = [team, win, lose].map((p) => {
            if (
                p.move[rule[0].value] &&
                Array.isArray(p.move[rule[0].value][formIdNum])
            ) {
                return p.move[rule[0].value][formIdNum].map((v, i) => {
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

            return null;
        });
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
                        baseStat={baseStat}
                    />
                </>
            )}
        </>
    );
};

export default GetRankData;

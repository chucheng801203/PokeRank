import React, { useContext } from "react";
import PmList from "./ListComponent/PmList";
import PmInfoBlock from "./PmInfoBlock";
import PercentageRow from "./ListComponent/PercentageRow";
import BaseStatRow from "./BaseStatRow";
import RankDataPageLoading from "./RankDataPageLoading";
import PageDataContext, { BaseState } from "../contexts/PageDataContext";
import { RankDataState } from "../redux/reducers/rankData";
import { SeasonState } from "../redux/reducers/season";
import { RuleState } from "../redux/reducers/rule";
import styles from "./rankDataPage.module.scss";
import pageRowStyles from "./ListComponent/pmRow.module.scss";
import pmListStyles from "./ListComponent/pmList.module.scss";
import ShowWikiModal from "./ShowWikiModal";
import PmRow from "./ListComponent/PmRow";

export type RankDataPageProps = {
    isLoading?: boolean;
    rankData?: RankDataState;
    season?: SeasonState;
    rule?: RuleState;
    pmId?: number;
    formId?: number;
};

const RankDataPage: React.FC<RankDataPageProps> = ({
    isLoading,
    rankData,
    season,
    rule,
    pmId,
    formId,
}) => {
    const pageData = useContext(PageDataContext);

    if (
        isLoading ||
        !rankData ||
        !season ||
        !rule ||
        typeof pmId !== "number" ||
        typeof formId !== "number"
    )
        return <RankDataPageLoading />;

    const currentRankData = rankData[season.value as number];

    let baseStat: BaseState | undefined;
    if (pageData.base_stats[pmId] && pageData.base_stats[pmId][formId]) {
        baseStat = pageData.base_stats[pmId][formId];
    }

    let teamPokemons: React.ReactNode;
    let move: React.ReactNode;
    let ability: React.ReactNode;
    let nature: React.ReactNode;
    let item: React.ReactNode;
    let winPokemons: React.ReactNode;
    let winMove: React.ReactNode;
    let losePokemons: React.ReactNode;
    let loseMove: React.ReactNode;

    const { team, win, lose } = currentRankData[pmId].rank;

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

        if (team[p][rule.value] && Array.isArray(team[p][rule.value][formId])) {
            return team[p][rule.value][formId].map((v, i) => {
                if (
                    typeof v.id !== "number" ||
                    typeof v.percentage !== "string"
                )
                    return null;

                let name = undefined;

                if (pageData[key][v.id]) {
                    name = pageData[key][v.id] ? pageData[key][v.id].name : "";
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

    [teamPokemons, winPokemons, losePokemons] = [team, win, lose].map((p) => {
        if (
            p.pokemon[rule.value] &&
            Array.isArray(p.pokemon[rule.value][formId])
        ) {
            return p.pokemon[rule.value][formId].map((v, i) => {
                if (typeof v.id !== "number" || typeof v.form_id !== "number")
                    return null;

                return (
                    <PmRow
                        key={i}
                        className={pageRowStyles["rank-page-row"]}
                        pmRank={i}
                        pmAvatar={`${process.env.REACT_APP_IMAGE_PATH}/cap${v.id}_f${v.form_id}_s0.png`}
                        pmId={v.id}
                        pmFormId={v.form_id}
                        pmName={pageData.pokemon[v.id]}
                        pmType={pageData.pokemon_types[v.id][v.form_id]}
                    />
                );
            });
        }

        return null;
    });

    [move, winMove, loseMove] = [team, win, lose].map((p) => {
        if (p.move[rule.value] && Array.isArray(p.move[rule.value][formId])) {
            return p.move[rule.value][formId].map((v, i) => {
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

    return (
        <>
            {
                <PmInfoBlock
                    pmId={pmId}
                    formId={formId}
                    pmRank={
                        currentRankData[pmId].rank.rank[rule.value]
                            ? currentRankData[pmId].rank.rank[rule.value][
                                  formId
                              ]
                            : undefined
                    }
                />
            }

            <div className={`row ${styles["row-custom"]}`}>
                <div className="col-12 col-xl-8">
                    <div className={`row ${styles["row-custom"]}`}>
                        <div className="col-12 col-md-6">
                            <PmList
                                className={`mb-3 ${pmListStyles["rank-page-list"]}`}
                                listTitle="種族值"
                            >
                                {
                                    <>
                                        <BaseStatRow
                                            name="ＨＰ"
                                            value={baseStat && baseStat.hp}
                                            rectColor="#bf4040"
                                        />
                                        <BaseStatRow
                                            name="攻擊"
                                            value={baseStat && baseStat.atk}
                                            rectColor="#bf9340"
                                        />
                                        <BaseStatRow
                                            name="防禦"
                                            value={baseStat && baseStat.def}
                                            rectColor="#bfbf40"
                                        />
                                        <BaseStatRow
                                            name="特功"
                                            value={baseStat && baseStat.spa}
                                            rectColor="#206020"
                                        />
                                        <BaseStatRow
                                            name="特防"
                                            value={baseStat && baseStat.spd}
                                            rectColor="#4040bf"
                                        />
                                        <BaseStatRow
                                            name="速度"
                                            value={baseStat && baseStat.spe}
                                            rectColor="#602060"
                                        />
                                    </>
                                }
                            </PmList>
                            <PmList
                                className={`mb-3 ${pmListStyles["rank-page-list"]}`}
                                listTitle="特性"
                            >
                                {ability}
                            </PmList>
                        </div>

                        <div className="col-12 col-md-6">
                            <PmList
                                className={`mb-3 ${pmListStyles["rank-page-list"]}`}
                                listTitle="招式"
                            >
                                {move}
                            </PmList>

                            <PmList
                                className={`mb-3 ${pmListStyles["rank-page-list"]}`}
                                listTitle="性格"
                            >
                                {nature}
                            </PmList>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-xl-4">
                    <div className={`row ${styles["row-custom"]}`}>
                        <div className="col-12 col-md-6 col-xl-12">
                            <PmList
                                className={`mb-3 ${pmListStyles["rank-page-list"]}`}
                                listTitle="一起加入對戰隊伍的寶可夢TOP10"
                            >
                                {teamPokemons}
                            </PmList>
                        </div>

                        <div className="col-12 col-md-6 col-xl-12">
                            <PmList
                                className={`mb-3 ${pmListStyles["rank-page-list"]}`}
                                listTitle="道具"
                            >
                                {item}
                            </PmList>
                        </div>
                    </div>
                </div>
            </div>

            {(winPokemons || winMove) && (
                <div className="mb-3" style={{ border: "1px solid #5e5e5e" }} />
            )}

            <div className={`row ${styles["row-custom"]}`}>
                {winPokemons && (
                    <div className="col-12 col-md-6 mb-3">
                        <PmList
                            className={pmListStyles["rank-page-list"]}
                            listTitle="這隻寶可夢打倒的寶可夢TOP10"
                        >
                            {winPokemons}
                        </PmList>
                    </div>
                )}

                {winMove && (
                    <div className="col-12 col-md-6 mb-3">
                        <PmList
                            className={pmListStyles["rank-page-list"]}
                            listTitle="這隻寶可夢打倒對手時使用的招式TOP10"
                        >
                            {winMove}
                        </PmList>
                    </div>
                )}
            </div>

            {(losePokemons || loseMove) && (
                <div className="mb-3" style={{ border: "1px solid #5e5e5e" }} />
            )}

            <div className={`row ${styles["row-custom"]}`}>
                {losePokemons && (
                    <div className="col-12 col-md-6 mb-3">
                        <PmList
                            className={pmListStyles["rank-page-list"]}
                            listTitle="打倒這隻寶可夢的寶可夢TOP10"
                        >
                            {losePokemons}
                        </PmList>
                    </div>
                )}

                {loseMove && (
                    <div className="col-12 col-md-6 mb-3">
                        <PmList
                            className={pmListStyles["rank-page-list"]}
                            listTitle="對手打倒這隻寶可夢時使用的招式TOP10"
                        >
                            {loseMove}
                        </PmList>
                    </div>
                )}
            </div>
        </>
    );
};

export default RankDataPage;

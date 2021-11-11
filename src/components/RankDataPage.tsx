import React from "react";
import PmList from "./PmList";
import PmInfoBlock from "./PmInfoBlock";
import PmRowLoading from "./PmRowLoading";
import PercentageRow from "./PercentageRow";
import BaseStatRow from "./BaseStatRow";
import { defaultPageData } from "../contexts/PageDataContext";
import styles from "./rankDataPage.module.scss";
import pageRowStyles from "./pmRow.module.scss";
import pmListStyles from "./pmList.module.scss";

type BaseStatType = typeof defaultPageData.base_stats[0][0];

export type RankDataPagePropsType = {
    isLoading?: boolean;
    pmInfo?: React.ReactNode;
    teamPokemons?: React.ReactNode;
    move?: React.ReactNode;
    ability?: React.ReactNode;
    nature?: React.ReactNode;
    item?: React.ReactNode;
    winPokemons?: React.ReactNode;
    winMove?: React.ReactNode;
    losePokemons?: React.ReactNode;
    loseMove?: React.ReactNode;
    baseStat?: BaseStatType;
};

const RankDataPage: React.FC<RankDataPagePropsType> = ({
    isLoading,
    pmInfo,
    teamPokemons,
    move,
    ability,
    nature,
    item,
    winPokemons,
    winMove,
    losePokemons,
    loseMove,
    baseStat,
}) => (
    <>
        {isLoading ? <PmInfoBlock isLoading={true} /> : pmInfo}

        <div className={`row ${styles["row-custom"]}`}>
            <div className="col-12 col-xl-8">
                <div className={`row ${styles["row-custom"]}`}>
                    <div className="col-12 col-md-6">
                        <PmList
                            className={`mb-3 ${pmListStyles["rank-page-list"]}`}
                            listTitle="種族值"
                        >
                            {isLoading ? (
                                [
                                    "ＨＰ",
                                    "攻擊",
                                    "防禦",
                                    "特功",
                                    "特防",
                                    "速度",
                                ].map((v, i) => (
                                    <BaseStatRow
                                        key={i}
                                        isLoading={true}
                                        name={v}
                                    />
                                ))
                            ) : (
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
                            )}
                        </PmList>
                        <PmList
                            className={`mb-3 ${pmListStyles["rank-page-list"]}`}
                            listTitle="特性"
                        >
                            {isLoading
                                ? Array.apply(null, Array(2)).map((v, i) => (
                                      <PercentageRow key={i} isLoading={true} />
                                  ))
                                : ability}
                        </PmList>
                    </div>

                    <div className="col-12 col-md-6">
                        <PmList
                            className={`mb-3 ${pmListStyles["rank-page-list"]}`}
                            listTitle="招式"
                        >
                            {isLoading
                                ? Array.apply(null, Array(5)).map((v, i) => (
                                      <PercentageRow key={i} isLoading={true} />
                                  ))
                                : move}
                        </PmList>

                        <PmList
                            className={`mb-3 ${pmListStyles["rank-page-list"]}`}
                            listTitle="性格"
                        >
                            {isLoading
                                ? Array.apply(null, Array(5)).map((v, i) => (
                                      <PercentageRow key={i} isLoading={true} />
                                  ))
                                : nature}
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
                            {isLoading
                                ? Array.apply(null, Array(5)).map((v, i) => (
                                      <PmRowLoading
                                          className={
                                              pageRowStyles["rank-page-row"]
                                          }
                                          key={i}
                                      />
                                  ))
                                : teamPokemons}
                        </PmList>
                    </div>

                    <div className="col-12 col-md-6 col-xl-12">
                        <PmList
                            className={`mb-3 ${pmListStyles["rank-page-list"]}`}
                            listTitle="道具"
                        >
                            {isLoading
                                ? Array.apply(null, Array(5)).map((v, i) => (
                                      <PercentageRow key={i} isLoading={true} />
                                  ))
                                : item}
                        </PmList>
                    </div>
                </div>
            </div>
        </div>

        {(isLoading || winPokemons || winMove) && (
            <div className="mb-3" style={{ border: "1px solid #5e5e5e" }} />
        )}

        <div className={`row ${styles["row-custom"]}`}>
            {(isLoading || winPokemons) && (
                <div className="col-12 col-md-6 mb-3">
                    <PmList
                        className={pmListStyles["rank-page-list"]}
                        listTitle="這隻寶可夢打倒的寶可夢TOP10"
                    >
                        {isLoading
                            ? Array.apply(null, Array(10)).map((v, i) => (
                                  <PmRowLoading
                                      className={pageRowStyles["rank-page-row"]}
                                      key={i}
                                  />
                              ))
                            : winPokemons}
                    </PmList>
                </div>
            )}

            {(isLoading || winMove) && (
                <div className="col-12 col-md-6 mb-3">
                    <PmList
                        className={pmListStyles["rank-page-list"]}
                        listTitle="這隻寶可夢打倒對手時使用的招式TOP10"
                    >
                        {isLoading
                            ? Array.apply(null, Array(10)).map((v, i) => (
                                  <PercentageRow key={i} isLoading={true} />
                              ))
                            : winMove}
                    </PmList>
                </div>
            )}
        </div>

        {(isLoading || losePokemons || loseMove) && (
            <div className="mb-3" style={{ border: "1px solid #5e5e5e" }} />
        )}

        <div className={`row ${styles["row-custom"]}`}>
            {(isLoading || losePokemons) && (
                <div className="col-12 col-md-6 mb-3">
                    <PmList
                        className={pmListStyles["rank-page-list"]}
                        listTitle="打倒這隻寶可夢的寶可夢TOP10"
                    >
                        {isLoading
                            ? Array.apply(null, Array(10)).map((v, i) => (
                                  <PmRowLoading
                                      className={pageRowStyles["rank-page-row"]}
                                      key={i}
                                  />
                              ))
                            : losePokemons}
                    </PmList>
                </div>
            )}

            {(isLoading || loseMove) && (
                <div className="col-12 col-md-6 mb-3">
                    <PmList
                        className={pmListStyles["rank-page-list"]}
                        listTitle="對手打倒這隻寶可夢時使用的招式TOP10"
                    >
                        {isLoading
                            ? Array.apply(null, Array(10)).map((v, i) => (
                                  <PercentageRow key={i} isLoading={true} />
                              ))
                            : loseMove}
                    </PmList>
                </div>
            )}
        </div>
    </>
);

export default RankDataPage;

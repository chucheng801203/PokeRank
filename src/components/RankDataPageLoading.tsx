import React from "react";
import PmList from "./PmList";
import PmInfoBlock from "./PmInfoBlock";
import PmRowLoading from "./PmRowLoading";
import PercentageRow from "./PercentageRow";
import BaseStatRow from "./BaseStatRow";
import styles from "./rankDataPage.module.scss";
import pageRowStyles from "./pmRow.module.scss";
import pmListStyles from "./pmList.module.scss";

const RankDataPageLoading: React.FC = () => {
    return (
        <>
            <PmInfoBlock isLoading={true} />

            <div className={`row ${styles["row-custom"]}`}>
                <div className="col-12 col-xl-8">
                    <div className={`row ${styles["row-custom"]}`}>
                        <div className="col-12 col-md-6">
                            <PmList
                                className={`mb-3 ${pmListStyles["rank-page-list"]}`}
                                listTitle="種族值"
                            >
                                {[
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
                                ))}
                            </PmList>
                            <PmList
                                className={`mb-3 ${pmListStyles["rank-page-list"]}`}
                                listTitle="特性"
                            >
                                {Array.apply(null, Array(2)).map((v, i) => (
                                    <PercentageRow key={i} isLoading={true} />
                                ))}
                            </PmList>
                        </div>

                        <div className="col-12 col-md-6">
                            <PmList
                                className={`mb-3 ${pmListStyles["rank-page-list"]}`}
                                listTitle="招式"
                            >
                                {Array.apply(null, Array(5)).map((v, i) => (
                                    <PercentageRow key={i} isLoading={true} />
                                ))}
                            </PmList>

                            <PmList
                                className={`mb-3 ${pmListStyles["rank-page-list"]}`}
                                listTitle="性格"
                            >
                                {Array.apply(null, Array(5)).map((v, i) => (
                                    <PercentageRow key={i} isLoading={true} />
                                ))}
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
                                {Array.apply(null, Array(5)).map((v, i) => (
                                    <PmRowLoading
                                        className={
                                            pageRowStyles["rank-page-row"]
                                        }
                                        key={i}
                                    />
                                ))}
                            </PmList>
                        </div>

                        <div className="col-12 col-md-6 col-xl-12">
                            <PmList
                                className={`mb-3 ${pmListStyles["rank-page-list"]}`}
                                listTitle="道具"
                            >
                                {Array.apply(null, Array(5)).map((v, i) => (
                                    <PercentageRow key={i} isLoading={true} />
                                ))}
                            </PmList>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-3" style={{ border: "1px solid #5e5e5e" }} />

            <div className={`row ${styles["row-custom"]}`}>
                <div className="col-12 col-md-6 mb-3">
                    <PmList
                        className={pmListStyles["rank-page-list"]}
                        listTitle="這隻寶可夢打倒的寶可夢TOP10"
                    >
                        {Array.apply(null, Array(10)).map((v, i) => (
                            <PmRowLoading
                                className={pageRowStyles["rank-page-row"]}
                                key={i}
                            />
                        ))}
                    </PmList>
                </div>

                <div className="col-12 col-md-6 mb-3">
                    <PmList
                        className={pmListStyles["rank-page-list"]}
                        listTitle="這隻寶可夢打倒對手時使用的招式TOP10"
                    >
                        {Array.apply(null, Array(10)).map((v, i) => (
                            <PercentageRow key={i} isLoading={true} />
                        ))}
                    </PmList>
                </div>
            </div>

            <div className="mb-3" style={{ border: "1px solid #5e5e5e" }} />

            <div className={`row ${styles["row-custom"]}`}>
                <div className="col-12 col-md-6 mb-3">
                    <PmList
                        className={pmListStyles["rank-page-list"]}
                        listTitle="打倒這隻寶可夢的寶可夢TOP10"
                    >
                        {Array.apply(null, Array(10)).map((v, i) => (
                            <PmRowLoading
                                className={pageRowStyles["rank-page-row"]}
                                key={i}
                            />
                        ))}
                    </PmList>
                </div>

                <div className="col-12 col-md-6 mb-3">
                    <PmList
                        className={pmListStyles["rank-page-list"]}
                        listTitle="對手打倒這隻寶可夢時使用的招式TOP10"
                    >
                        {Array.apply(null, Array(10)).map((v, i) => (
                            <PercentageRow key={i} isLoading={true} />
                        ))}
                    </PmList>
                </div>
            </div>
        </>
    );
};

export default RankDataPageLoading;

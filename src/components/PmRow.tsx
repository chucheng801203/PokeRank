import React from "react";
import classNames from "classnames";
import { Location } from "history";
import { Link } from "react-router-dom";
import PmTypeBlock from "./PmTypeBlock";
import LazyLoadImage from "./LazyLoadImage";
import { HistoryState } from "../containers/HistoryContainer";
import styles from "./pmRow.module.scss";

export type PmRowProps = {
    className?: string;
    pmRank?: number; // pokemon 排名
    pmAvatar?: string; // pokemon 圖片
    pmId?: number; // pokemon 編號
    pmFormId?: number; // pokemon 型態編號
    pmName?: string; // pokemon 名稱
    pmType?: Array<number>; // pokemon 屬性 id
};

const PmRow: React.FC<PmRowProps> = ({
    className,
    pmRank,
    pmAvatar,
    pmId,
    pmFormId,
    pmName,
    pmType,
}) => (
    <li className={classNames(styles["row"], className)}>
        <Link
            className={`${styles["row-link"]} ${styles["row-container"]}`}
            to={({ state }: Location<HistoryState>) => ({
                pathname: `/${pmId}/${pmFormId}`,
                search: `?season=${state.season.value}&rule=${state.rule.value}`,
                state: {
                    ...state,
                    searchText: "",
                },
            })}
        >
            <div className={`${styles["row-content"]}`}>
                <div className={`${styles["row-rank"]}`}>
                    {typeof pmRank === "number" ? pmRank + 1 : ""}
                </div>
                <LazyLoadImage
                    className={`${styles["row-img"]}`}
                    src={pmAvatar}
                    alt="pokemon"
                />
                <div className={`${styles["row-info"]}`}>
                    {`No. ${pmId}`}
                    <br />
                    {pmName}
                </div>
                <div>
                    {pmType?.map((type_id, i) => (
                        <PmTypeBlock
                            key={i}
                            className={`${styles["row-type"]}`}
                            pmType={type_id}
                        />
                    ))}
                </div>
            </div>
        </Link>
    </li>
);

export default PmRow;

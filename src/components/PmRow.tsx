import React from "react";
import classNames from "classnames";
import { Location } from "history";
import { Link } from "react-router-dom";
import PmTypeBlock from "./PmTypeBlock";
import LazyLoadImage from "./LazyLoadImage";
import { HistoryStateType } from "../containers/HistoryContainer";
import styles from "./pmRow.module.scss";

export type PmRowPropsType = {
    className?: string;
    pmRank?: number; // pokemon 排名
    pmAvatar?: string; // pokemon 圖片
    pmId?: number; // pokemon 編號
    pmFormId?: number; // pokemon 型態編號
    pmName?: string; // pokemon 名稱
    pmType?: Array<number>; // pokemon 屬性 id
};

const PmRow: React.FC<PmRowPropsType> = ({
    className,
    pmRank,
    pmAvatar,
    pmId,
    pmFormId,
    pmName,
    pmType,
}) => (
    <li className={classNames(styles["pr-pm-row"], className)}>
        <Link
            className={`${styles["pm-row-link"]} ${styles["pm-row-container"]}`}
            to={({ state }: Location<HistoryStateType>) => ({
                pathname: `/${pmId}/${pmFormId}`,
                search: `?season=${state.season.value}&rule=${state.rule.value}`,
                state: state,
            })}
        >
            <div className={`${styles["pm-row-content"]}`}>
                <div className={`${styles["pm-row-rank"]}`}>
                    {typeof pmRank === "number" ? pmRank + 1 : ""}
                </div>
                <LazyLoadImage
                    className={`${styles["pm-row-img"]}`}
                    src={pmAvatar}
                    alt="pokemon"
                />
                <div className={`${styles["pm-row-info"]}`}>
                    {`No. ${pmId}`}
                    <br />
                    {pmName}
                </div>
                <div>
                    {pmType?.map((type_id, i) => (
                        <PmTypeBlock
                            key={i}
                            className={`${styles["pm-row-type"]}`}
                            pmType={type_id}
                        />
                    ))}
                </div>
            </div>
        </Link>
    </li>
);

export default PmRow;

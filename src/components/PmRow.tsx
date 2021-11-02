import React from "react";
import { Location } from "history";
import { Link } from "react-router-dom";
import PmTypeBlock from "./PmTypeBlock";
import LazyLoadImage from "./LazyLoadImage";
import { HistoryStateType } from "../containers/HistoryContainer";
import styles from "./pmRow.module.scss";

const PmRow: React.FC<{
    className?: string;
    pmRank?: number; // pokemon 排名
    pmAvatar?: string; // pokemon 圖片
    pmId?: number; // pokemon 編號
    pmFormId?: number; // pokemon 型態編號
    pmName?: string; // pokemon 名稱
    pmType?: Array<number>; // pokemon 屬性 id
    [otherProps: string]: any;
}> = ({
    className = "",
    pmRank = 0,
    pmAvatar = "",
    pmId = 0,
    pmFormId = 0,
    pmName = "",
    pmType = [],
    ...otherProps
}) => (
    <li className={`${styles["pr-pm-row"]} ${className}`} {...otherProps}>
        <Link
            className={`${styles["pm-row-link"]} ${styles["pm-row-container"]}`}
            to={({ state }: Location<HistoryStateType>) => ({
                pathname: `/${pmId}/${pmFormId}`,
                search: `?season=${state.season.value}&rule=${state.rule.value}`,
                state: state,
            })}
        >
            <div className={`${styles["pm-row-content"]}`}>
                <div className={`${styles["pm-row-rank"]}`}>{pmRank + 1}</div>
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

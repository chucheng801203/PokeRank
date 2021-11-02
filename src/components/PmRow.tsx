import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PmTypeBlock from "./PmTypeBlock";
import LazyLoadImage from "./LazyLoadImage";
import { getSeasonState, getRuleState } from "../redux/selectors";
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
}) => {
    const season = useSelector(getSeasonState);
    const rule = useSelector(getRuleState);

    return (
        <li className={`${styles["pr-pm-row"]} ${className}`} {...otherProps}>
            <Link
                className={`${styles["pm-row-link"]} ${styles["pm-row-container"]}`}
                to={{
                    pathname: `/${pmId}/${pmFormId}`,
                    search: `?season=${season[0].value}&rule=${rule[0].value}`,
                    state: {
                        rule: rule[0],
                        season: season[0],
                    },
                }}
            >
                <div className={`${styles["pm-row-content"]}`}>
                    <div className={`${styles["pm-row-rank"]}`}>
                        {pmRank + 1}
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
};

export default PmRow;

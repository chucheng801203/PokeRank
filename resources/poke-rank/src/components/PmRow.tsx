import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LoadingBlock from "./LoadingBlock";
import PmTypeBlock from "./PmTypeBlock";
import { getSeasonState, getRuleState } from "../redux/selectors";
import styles from "./index.scss";

export interface PmRowProps {
    className?: string;
    isLoading?: boolean;
    pmRank?: number; // pokemon 排名
    pmAvatar?: string; // pokemon 圖片
    pmId?: number; // pokemon 編號
    pmFormId?: number; // pokemon 型態編號
    pmName?: string; // pokemon 名稱
    pmType?: Array<number>; // pokemon 屬性 id
    [otherProps: string]: any;
}

type PmRow = React.FC<PmRowProps>;

const PmRow: PmRow = ({
    isLoading,
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

    const rowContent = isLoading ? (
        <li className={`${styles["pr-pm-row"]} ${className}`} {...otherProps}>
            <div
                className={`${styles["pm-row-container"]} ${styles["pm-row-container-loading"]}`}
            >
                <div className={`${styles["pm-row-content"]}`}>
                    <LoadingBlock
                        className={`${styles["pm-row-loading-rank"]}`}
                    />
                    <LoadingBlock
                        className={`${styles["pm-row-loading-img"]}`}
                    />
                    <div className={`${styles["pm-row-info"]}`}>
                        <LoadingBlock
                            className={`${styles["pm-row-loading-id"]}`}
                        />
                        <LoadingBlock
                            className={`${styles["pm-row-loading-name"]}`}
                        />
                    </div>
                    <div className={`${styles["pm-row-types"]}`}>
                        <LoadingBlock
                            className={`${styles["pm-row-loading-type"]}`}
                        />
                        <LoadingBlock
                            className={`${styles["pm-row-loading-type"]}`}
                        />
                    </div>
                </div>
            </div>
        </li>
    ) : (
        <li className={`${styles["pr-pm-row"]} ${className}`} {...otherProps}>
            <Link
                className={`${styles["pm-row-link"]}`}
                style={{ display: "block" }}
                to={{
                    pathname: `/${pmId}/${pmFormId}`,
                    search: `?season=${season[0].value}&rule=${rule[0].value}`,
                    state: {
                        rule: rule[0],
                        season: season[0],
                    },
                }}
            >
                <div className={`${styles["pm-row-container"]}`}>
                    <div className={`${styles["pm-row-content"]}`}>
                        <div className={`${styles["pm-row-rank"]}`}>
                            {pmRank + 1}
                        </div>
                        <figure className={`${styles["pm-row-img"]}`}>
                            <img src={pmAvatar} alt="pokemon" />
                        </figure>
                        <div className={`${styles["pm-row-info"]}`}>
                            <div>{`No. ${pmId}`}</div>
                            <div>{pmName}</div>
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
                </div>
            </Link>
        </li>
    );

    return rowContent;
};

export default PmRow;

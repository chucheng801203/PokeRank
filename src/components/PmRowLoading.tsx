import React from "react";
import classNames from "classnames";
import LoadingBlock from "./LoadingBlock";
import styles from "./pmRow.module.scss";

export type PmRowLoadingPropsType = {
    className?: string;
};

const PmRowLoading: React.FC<PmRowLoadingPropsType> = ({ className }) => (
    <li className={classNames(styles["pr-pm-row"], className)}>
        <div
            className={`${styles["pm-row-container"]} ${styles["pm-row-container-loading"]}`}
        >
            <div className={`${styles["pm-row-content"]}`}>
                <LoadingBlock className={`${styles["pm-row-loading-rank"]}`} />
                <LoadingBlock className={`${styles["pm-row-loading-img"]}`} />
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
);

export default PmRowLoading;

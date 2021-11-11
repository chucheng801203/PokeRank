import React from "react";
import classNames from "classnames";
import LoadingBlock from "./LoadingBlock";
import styles from "./pmRow.module.scss";

export type PmRowLoadingPropsType = {
    className?: string;
};

const PmRowLoading: React.FC<PmRowLoadingPropsType> = ({ className }) => (
    <li className={classNames(styles["row"], className)}>
        <div
            className={`${styles["row-container"]} ${styles["row-container-loading"]}`}
        >
            <div className={`${styles["row-content"]}`}>
                <LoadingBlock className={`${styles["row-loading-rank"]}`} />
                <LoadingBlock className={`${styles["row-loading-img"]}`} />
                <div className={`${styles["row-info"]}`}>
                    <LoadingBlock className={`${styles["row-loading-id"]}`} />
                    <LoadingBlock className={`${styles["row-loading-name"]}`} />
                </div>
                <div className={`${styles["row-types"]}`}>
                    <LoadingBlock className={`${styles["row-loading-type"]}`} />
                    <LoadingBlock className={`${styles["row-loading-type"]}`} />
                </div>
            </div>
        </div>
    </li>
);

export default PmRowLoading;

import React from "react";
import classNames from "classnames";
import styles from "./pmSelectListItem.module.scss";

export type PmSelectListContentPropsType = {
    className?: string;
    pmAvatar?: string; // pokemon 圖片
    pmId?: number; // pokemon 編號
    pmName?: string; // pokemon 名稱
};

const PmSelectListContent: React.FC<PmSelectListContentPropsType> = ({
    className,
    pmAvatar,
    pmId,
    pmName,
}) => {
    return (
        <div
            className={classNames(
                styles["pr-pm-select-list-content"],
                className
            )}
        >
            <div className={styles["content-id"]}>No. {pmId}</div>
            <figure className={styles["content-img"]}>
                <img src={pmAvatar} alt="pokemon" />
            </figure>
            <div className={styles["content-name"]}>{pmName}</div>
        </div>
    );
};

export default PmSelectListContent;

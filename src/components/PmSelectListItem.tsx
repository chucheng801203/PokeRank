import React from "react";
import classNames from "classnames";
import styles from "./pmSelectListItem.module.scss";

export type PmSelectListContentProps = {
    className?: string;
    pmAvatar?: string; // pokemon 圖片
    pmId?: number; // pokemon 編號
    pmName?: string; // pokemon 名稱
};

const PmSelectListContent: React.FC<PmSelectListContentProps> = ({
    className,
    pmAvatar,
    pmId,
    pmName,
}) => {
    return (
        <div className={classNames(styles["item"], className)}>
            <div className={styles["item-id"]}>No. {pmId}</div>
            <figure className={styles["item-img"]}>
                <img src={pmAvatar} alt="pokemon" />
            </figure>
            <div className={styles["item-name"]}>{pmName}</div>
        </div>
    );
};

export default PmSelectListContent;

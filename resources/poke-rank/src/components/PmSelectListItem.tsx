import React from "react";
import styles from "./index.scss";

export interface PmSelectListContentProps {
    className?: string;
    pmAvatar?: string; // pokemon 圖片
    pmId?: number; // pokemon 編號
    pmName?: string; // pokemon 名稱
}

type PmSelectListContent = React.FC<PmSelectListContentProps>;

const PmSelectListContent: PmSelectListContent = ({
    className = "",
    pmAvatar = "",
    pmId = 0,
    pmName = "",
}) => {
    return (
        <div className={`${styles["pr-pm-select-list-content"]} ${className}`}>
            <div className={styles["content-id"]}>No. {pmId}</div>
            <figure className={styles["content-img"]}>
                <img src={pmAvatar} alt="pokemon" />
            </figure>
            <div className={styles["content-name"]}>{pmName}</div>
        </div>
    );
};

export default PmSelectListContent;

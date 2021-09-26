import React from "react";
import styles from "./index.module.scss";

const PmSelectListContent: React.FC<{
    className?: string;
    pmAvatar?: string; // pokemon 圖片
    pmId?: number; // pokemon 編號
    pmName?: string; // pokemon 名稱
}> = ({
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

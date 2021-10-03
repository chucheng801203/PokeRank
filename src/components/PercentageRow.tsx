import React from "react";
import LoadingBlock from "./LoadingBlock";
import styles from "./index.module.scss";

const PercentageRow: React.FC<{
    rank?: number;
    name?: string;
    percentage?: number | string;
    isLoading?: boolean;
}> = ({ rank, name, percentage, isLoading }) => {
    return (
        <li className={styles["pr-percentage-row"]}>
            <div className={styles["row-content"]}>
                {isLoading ? (
                    <>
                        <LoadingBlock className={styles["row-loading-rank"]} />
                        <LoadingBlock className={styles["row-loading-name"]} />
                        <LoadingBlock
                            className={styles["row-loading-percentage"]}
                        />
                    </>
                ) : (
                    <>
                        <div className={styles["row-rank"]}>{rank}</div>
                        <div className={styles["row-name"]}>{name}</div>
                        <div className={styles["row-percentage"]}>
                            {`${percentage}%`}
                        </div>
                    </>
                )}
            </div>
        </li>
    );
};

export default PercentageRow;

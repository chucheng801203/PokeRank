import React from "react";
import LoadingBlock from "./LoadingBlock";
import PmTypeBlock from "./PmTypeBlock";
import styles from "./index.module.scss";

const PercentageRow: React.FC<{
    rank?: number;
    name?: string;
    typeId?: number | null;
    percentage?: number | string;
    isLoading?: boolean;
}> = ({ rank, name, typeId, percentage, isLoading }) => {
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
                        <div
                            className="d-flex justify-content-end"
                            style={{ width: "112px" }}
                        >
                            {typeof typeId === "number" && (
                                <PmTypeBlock
                                    className={`${styles["row-type"]}`}
                                    pmType={typeId}
                                />
                            )}
                            <div
                                className={`${styles["row-percentage"]} ml-auto`}
                            >
                                {`${percentage}%`}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </li>
    );
};

export default PercentageRow;

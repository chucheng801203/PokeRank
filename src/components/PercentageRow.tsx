import React from "react";
import LoadingBlock from "./LoadingBlock";
import PmTypeBlock from "./PmTypeBlock";
import styles from "./percentageRow.module.scss";

export type PercentageRowPropsType = {
    rank?: number;
    name?: string;
    typeId?: number | null;
    percentage?: number | string;
    isLoading?: boolean;
    onClick?: () => void;
};

const PercentageRow: React.FC<PercentageRowPropsType> = ({
    rank,
    name,
    typeId,
    percentage,
    isLoading,
    onClick,
}) => {
    let className = styles["row"];
    if (onClick) {
        className = `${className} ${styles["row-hover"]}`;
    }

    return (
        <li className={className} onClick={onClick}>
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

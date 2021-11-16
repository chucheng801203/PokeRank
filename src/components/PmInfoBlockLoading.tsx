import React from "react";
import LoadingBlock from "./LoadingBlock";
import styles from "./pmInfoBlock.module.scss";

export const PmInfoBlockLoading: React.FC = () => {
    return (
        <div className={styles["info"]}>
            <div className="d-sm-flex mb-3">
                <div className="d-flex align-items-center mr-sm-auto mb-2 mb-sm-0">
                    <LoadingBlock
                        className={`${styles["info-loading-name"]} mr-2`}
                    />
                    <LoadingBlock
                        className={`${styles["info-loading-rank"]} mr-auto`}
                    />
                </div>
                <div className="d-flex align-items-center">
                    <LoadingBlock className={styles["info-type"]} />
                </div>
            </div>
            <div className="d-flex flex-wrap mb-3">
                <LoadingBlock className={styles["info-img"]} />
            </div>
            <div style={{ overflowX: "auto" }}>
                <div className={styles["info-weakness-table"]}>
                    <div className={styles["info-table-tr"]}>
                        {Array.apply(null, Array(18)).map((v, i) => (
                            <div key={i} className={styles["info-table-td"]}>
                                <LoadingBlock
                                    style={{ width: "100%", height: "100%" }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className={styles["info-table-tr"]}>
                        {Array.apply(null, Array(18)).map((v, i) => (
                            <div key={i} className={styles["info-table-td"]}>
                                --
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PmInfoBlockLoading;

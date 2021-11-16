import React from "react";
import LoadingBlock from "./LoadingBlock";
import styles from "./baseStat.module.scss";

export type BaseStatsProps = {
    isLoading?: boolean;
    name?: string;
    value?: number;
    rectColor?: string;
};

const BaseStats: React.FC<BaseStatsProps> = ({
    isLoading,
    name,
    rectColor,
    value = 0,
}) => {
    let styleAttr: React.CSSProperties = {};
    if (Number.isInteger(value)) {
        styleAttr.width = `${(value / 255) * 100}%`;
    }
    if (rectColor) {
        styleAttr.backgroundColor = rectColor;
    }

    return !isLoading && (name === undefined || value === undefined) ? null : (
        <li className={styles["baseStat"]}>
            <div className={styles["baseStat-content"]}>
                <div className={styles["baseStat-name"]}>
                    {name ? `${name}：` : ""}
                </div>

                {isLoading ? (
                    <LoadingBlock
                        className={styles["baseStat-loading-value"]}
                    />
                ) : (
                    <div className={styles["baseStat-value"]}>
                        {value ? value : ""}
                    </div>
                )}

                {isLoading ? (
                    <LoadingBlock
                        className={styles["baseStat-loading-value-rect"]}
                    />
                ) : (
                    <div className={styles["baseStat-value-rect"]}>
                        {Number.isInteger(value) ? (
                            <div
                                className={
                                    styles["baseStat-value-rect-content"]
                                }
                                style={styleAttr}
                            />
                        ) : (
                            ""
                        )}
                    </div>
                )}
            </div>
        </li>
    );
};

export default BaseStats;

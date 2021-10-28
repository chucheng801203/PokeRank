import React from "react";
import LoadingBlock from "./LoadingBlock";
import styles from "./baseStats.module.scss";

const BaseStats: React.FC<{
    isLoading?: boolean;
    name?: string;
    value?: number;
    rectColor?: string;
}> = ({ isLoading, name, rectColor, value = 0 }) => {
    let styleAttr: React.CSSProperties = {};
    if (Number.isInteger(value)) {
        styleAttr.width = `${(value / 255) * 100}%`;
    }
    if (rectColor) {
        styleAttr.backgroundColor = rectColor;
    }

    return !isLoading && (name === undefined || value === undefined) ? null : (
        <li className={styles["pr-baseStat-row"]}>
            <div className={styles["row-content"]}>
                <div className={styles["row-name"]}>
                    {name ? `${name}：` : ""}
                </div>

                {isLoading ? (
                    <LoadingBlock className={styles["row-loading-value"]} />
                ) : (
                    <div className={styles["row-value"]}>
                        {value ? value : ""}
                    </div>
                )}

                {isLoading ? (
                    <LoadingBlock
                        className={styles["row-loading-value-rect"]}
                    />
                ) : (
                    <div className={styles["row-value-rect"]}>
                        {Number.isInteger(value) ? (
                            <div
                                className={styles["row-value-rect-content"]}
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

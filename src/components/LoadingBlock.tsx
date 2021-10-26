import React from "react";
import styles from "./loadingBlock.module.scss";

const LoadingBlock: React.FC<{
    className?: string;
    [otherProps: string]: any;
}> = ({ className = "", ...otherProps }) => {
    return (
        <div
            className={`${styles["pr-loading-block"]} ${className}`}
            {...otherProps}
        />
    );
};

export default LoadingBlock;

import React from "react";
import styles from "./index.module.scss";

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

import React from "react";
import styles from "./index.scss";

export interface LoadingBlockProps {
    className?: string;
    [otherProps: string]: any;
}

type LoadingBlock = React.FC<LoadingBlockProps>;

const LoadingBlock: LoadingBlock = ({ className = "", ...otherProps }) => {
    return (
        <div
            className={`${styles["pr-loading-block"]} ${className}`}
            {...otherProps}
        />
    );
};

export default LoadingBlock;

import React from "react";
import styles from "./loadingBlock.module.scss";

const LoadingBlock: React.FC<{
    className?: string;
    width?: string;
    height?: string;
    [otherProps: string]: any;
}> = ({ className = "", width, height, ...otherProps }) => {
    const styleAttr: React.CSSProperties = {};
    if (width) {
        styleAttr.width = width;
    }
    if (height) {
        styleAttr.height = height;
    }

    return (
        <div
            className={`${styles["pr-loading-block"]} ${className}`}
            style={styleAttr}
            {...otherProps}
        />
    );
};

export default LoadingBlock;

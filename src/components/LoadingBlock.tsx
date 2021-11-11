import React from "react";
import classNames from "classnames";
import styles from "./loadingBlock.module.scss";

export type LoadingBlockPropsType = {
    className?: string;
    width?: string;
    height?: string;
    style?: React.CSSProperties;
};

const LoadingBlock: React.FC<LoadingBlockPropsType> = ({
    className,
    width,
    height,
    style,
}) => {
    const styleAttr: React.CSSProperties = style ? style : {};
    if (width) {
        styleAttr.width = width;
    }
    if (height) {
        styleAttr.height = height;
    }

    return (
        <div
            className={classNames(styles["loading-block"], className)}
            style={styleAttr}
        />
    );
};

export default LoadingBlock;

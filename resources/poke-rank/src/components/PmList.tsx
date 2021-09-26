import React from "react";
import styles from "./index.scss";

export interface PmListProps {
    className?: string;
    children?: React.ReactNode;
    listTitle?: string;
    [otherProps: string]: any;
}

type PmList = React.FC<PmListProps>;

const PmList: PmList = ({
    className = "",
    children,
    listTitle,
    ...otherProps
}) => {
    return (
        <section
            className={`${styles["pr-pm-list"]} ${className}`}
            {...otherProps}
        >
            {listTitle && (
                <h1 className={styles["pm-list-title"]}>{listTitle}</h1>
            )}
            <ul>{children}</ul>
        </section>
    );
};

export default PmList;

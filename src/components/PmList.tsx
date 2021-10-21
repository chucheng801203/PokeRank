import React from "react";
import styles from "./index.module.scss";

const PmList: React.FC<{
    className?: string;
    children?: React.ReactNode;
    listTitle?: string;
    [otherProps: string]: any;
}> = ({ className = "", children, listTitle, ...otherProps }) => {
    return (
        <section
            className={`${styles["pr-pm-list"]} ${className}`}
            {...otherProps}
        >
            {listTitle && (
                <h3 className={styles["pm-list-title"]}>{listTitle}</h3>
            )}
            <ul>{children}</ul>
        </section>
    );
};

export default PmList;

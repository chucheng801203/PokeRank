import React from "react";
import styles from "./pmList.module.scss";

const PmList: React.FC<{
    className?: string;
    children?: React.ReactNode;
    listTitle?: string;
    [otherProps: string]: any;
}> = ({ className = "", children, listTitle, ...otherProps }) => {
    return (
        <main
            className={`${styles["pr-pm-list"]} ${className}`}
            {...otherProps}
        >
            {listTitle && (
                <h3 className={styles["pm-list-title"]}>{listTitle}</h3>
            )}
            <ul>{children}</ul>
        </main>
    );
};

export default PmList;

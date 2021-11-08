import React from "react";
import classNames from "classnames";
import styles from "./pmList.module.scss";

export type PmListPropsType = {
    className?: string;
    children?: React.ReactNode;
    listTitle?: string;
};

const PmList: React.FC<PmListPropsType> = ({
    className,
    children,
    listTitle,
}) => {
    return (
        <section className={classNames(styles["pr-pm-list"], className)}>
            {listTitle && (
                <h3 className={styles["pm-list-title"]}>{listTitle}</h3>
            )}
            <ul>{children}</ul>
        </section>
    );
};

export default PmList;

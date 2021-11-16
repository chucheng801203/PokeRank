import React from "react";
import classNames from "classnames";
import styles from "./pmList.module.scss";

export type PmListProps = {
    className?: string;
    children?: React.ReactNode;
    listTitle?: string;
};

const PmList: React.FC<PmListProps> = ({
    className,
    children,
    listTitle,
}) => {
    return (
        <section className={classNames(styles["list"], className)}>
            {listTitle && <h3 className={styles["list-title"]}>{listTitle}</h3>}
            <ul>{children}</ul>
        </section>
    );
};

export default PmList;

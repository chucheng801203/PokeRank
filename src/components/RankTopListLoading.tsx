import React from "react";
import PmList from "./PmList";
import PmRowLoading from "./PmRowLoading";
import styles from "./rankTopList.module.scss";

const RankTopListLoading: React.FC = () => (
    <PmList className={styles["list"]}>
        {Array.apply(null, Array(20)).map((v, i) => (
            <PmRowLoading key={i} />
        ))}
    </PmList>
);

export default RankTopListLoading;

import React from "react";
import PmList from "./ListComponent/PmList";
import PmRowLoading from "./ListComponent/PmRowLoading";
import styles from "./rankTopList.module.scss";

const RankTopListLoading: React.FC = () => (
    <PmList className={styles["list"]}>
        {Array.apply(null, Array(20)).map((v, i) => (
            <PmRowLoading key={i} />
        ))}
    </PmList>
);

export default RankTopListLoading;

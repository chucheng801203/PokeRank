import React, { useContext } from "react";
import { useSelector } from "react-redux";
import PageDataContext from "../contexts/PageDataContext";
import { getRuleState, getSeasonState } from "../redux/selectors";
import styles from "./titleWithSeasonInfo.module.scss";

export type TitleWIthSeasonInfoProps = {
    title: string;
};

const TitleWithSeasonInfo: React.FC<TitleWIthSeasonInfoProps> = ({ title }) => {
    const { page_loading, seasons, rules } = useContext(PageDataContext);

    const season = useSelector(getSeasonState);
    const rule = useSelector(getRuleState);

    let seasonText: string = "　";
    if (!page_loading && season && rule) {
        const s = seasons[season.index];
        const r = rules[rule.index];
        seasonText = `(${s.text}, ${r.text}, ${s.start}~${s.end})`;
    }

    return (
        <header>
            <h1 className={styles["title"]}>{title}</h1>
            <p className={styles["season-info"]}>{seasonText}</p>
        </header>
    );
};

export default TitleWithSeasonInfo;

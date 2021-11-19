import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    DefaultSelector as Selector,
    Option,
} from "../components/SelectorComponent";
import { SelectValue } from "../components/SelectorComponent/DefaultSelector";
import { getSeasonState } from "../redux/selectors";
import PageDataContext from "../contexts/PageDataContext";
import { HistoryState } from "./HistoryContainer";
import { getParameterByName } from "../util";

export type SeasonSelectorProps = {
    className?: string;
    style?: React.CSSProperties;
};

const SeasonSelector: React.FC<SeasonSelectorProps> = (props) => {
    const pageData = useContext(PageDataContext);
    const season = useSelector(getSeasonState);

    const history = useHistory<HistoryState>();

    const onChange = (v: SelectValue) => {
        if (v.length <= 0) return;

        const ruleParam = getParameterByName("rule");

        const location = history.location;
        let pathname = `${location.pathname}?season=${v[0].value}`;

        if (ruleParam) {
            pathname += `&rule=${ruleParam}`;
        }

        history.push(pathname, {
            ...location.state,
            season: {
                index: v[0].index,
                value: v[0].value as number,
            },
        });

        window.scroll(0, 0);
    };

    return (
        <Selector value={season} onChange={onChange} {...props}>
            {pageData.seasons.map((option, i) => (
                <Option key={i} value={option.value}>
                    {option.text}
                </Option>
            ))}
        </Selector>
    );
};

export default SeasonSelector;

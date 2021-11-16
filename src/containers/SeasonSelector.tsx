import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import {
    DefaultSelector as Selector,
    Option,
} from "../components/SelectorComponent";
import { SelectValue } from "../components/SelectorComponent/DefaultSelector";
import toggleSeason from "../redux/actions/season";
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

    const dispatch = useDispatch();
    const history = useHistory();
    const { state, pathname } = useLocation<HistoryState>();

    const onChange = (v: SelectValue) => {
        if (v.length <= 0) return;

        const s = {
            index: v[0].index,
            value: v[0].value as number,
        };

        dispatch(toggleSeason(s));

        const ruleParam = getParameterByName("rule");

        let pathName = `${pathname}?season=${v[0].value}`;

        if (ruleParam) {
            pathName += `&rule=${ruleParam}`;
        }

        history.push(pathName, {
            ...state,
            season: s,
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

import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Selector from "../components/Selector";
import { SelectValue } from "../components/SelectorComponent/DefaultSelector";
import toggleSeason from "../redux/actions/season";
import { getSeasonState, getRuleState } from "../redux/selectors";
import PageDataContext from "../PageDataContext";
import { getParameterByName } from "../util";

const SeasonSelector: React.FC<{
    className?: string;
    style?: React.CSSProperties;
}> = ({ className, style }) => {
    const pageData = useContext(PageDataContext);
    const season = useSelector(getSeasonState);
    const rule = useSelector(getRuleState);

    const dispatch = useDispatch();
    const history = useHistory();

    const onChange = (v: SelectValue) => {
        if (v.length > 0) {
            const s = {
                index: v[0].index,
                value: v[0].value as number,
            };

            dispatch(toggleSeason(s));

            let pathName = `${window.location.pathname}?season=${v[0].value}`;

            const ruleParam = getParameterByName("rule");
            if (ruleParam) {
                pathName = `${pathName}&rule=${ruleParam}`;
            }

            history.push(pathName, {
                rule: rule[0],
                season: s,
            });
        }
    };

    return (
        <Selector
            value={season}
            onChange={onChange}
            optionData={pageData.seasons}
            className={className}
            style={style}
        />
    );
};

export default SeasonSelector;

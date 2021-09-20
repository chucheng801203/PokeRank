import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Selector from "../components/Selector";
import { SelectValue } from "../components/SelectorComponent/DefaultSelector";
import toggleRule from "../redux/actions/rule";
import { getSeasonState, getRuleState } from "../redux/selectors";
import PrContext from "../PrContext";
import { getParameterByName } from "../util";

type RuleSelector = React.FC<{
    className?: string;
    style?: React.CSSProperties;
}>;

const RuleSelector: RuleSelector = ({ className, style }) => {
    const prData = useContext(PrContext);
    const season = useSelector(getSeasonState);
    const rule = useSelector(getRuleState);

    const dispatch = useDispatch();
    const history = useHistory();

    const onChange = (v: SelectValue) => {
        if (v.length > 0) {
            const r = {
                index: v[0].index,
                value: v[0].value as number,
            };

            dispatch(toggleRule(r));

            let pathName = window.location.pathname;

            const seasonParam = getParameterByName("season");
            if (seasonParam) {
                pathName = `${pathName}?season=${seasonParam}&rule=${v[0].value}`;
            } else {
                pathName = `${pathName}?rule=${v[0].value}`;
            }

            history.push(pathName, {
                season: season[0],
                rule: r,
            });
        }
    };

    return (
        <Selector
            value={rule}
            onChange={onChange}
            optionData={prData.rules}
            className={className}
            style={style}
        />
    );
};

export default RuleSelector;

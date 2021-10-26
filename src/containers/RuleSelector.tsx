import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import Selector from "../components/Selector";
import { SelectValue } from "../components/SelectorComponent/DefaultSelector";
import toggleRule from "../redux/actions/rule";
import { getRuleState } from "../redux/selectors";
import PageDataContext from "../PageDataContext";
import { HistoryStateType } from "./HistoryContainer";
import { getParameterByName } from "../util";

const RuleSelector: React.FC<{
    className?: string;
    style?: React.CSSProperties;
}> = ({ className, style }) => {
    const pageData = useContext(PageDataContext);
    const rule = useSelector(getRuleState);

    const dispatch = useDispatch();
    const history = useHistory();
    const { state } = useLocation<HistoryStateType>();

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
                season: state.season,
                rule: r,
            });

            window.scroll(0, 0);
        }
    };

    return (
        <Selector
            value={rule}
            onChange={onChange}
            optionData={pageData.rules}
            className={className}
            style={style}
        />
    );
};

export default RuleSelector;

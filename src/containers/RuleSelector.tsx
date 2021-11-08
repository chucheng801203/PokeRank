import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import {
    DefaultSelector as Selector,
    Option,
} from "../components/SelectorComponent";
import { SelectValueType } from "../components/SelectorComponent/DefaultSelector";
import toggleRule from "../redux/actions/rule";
import { getRuleState } from "../redux/selectors";
import PageDataContext from "../contexts/PageDataContext";
import { HistoryStateType } from "./HistoryContainer";
import { getParameterByName } from "../util";

export type RuleSelectorPropsType = {
    className?: string;
    style?: React.CSSProperties;
};

const RuleSelector: React.FC<RuleSelectorPropsType> = (props) => {
    const pageData = useContext(PageDataContext);
    const rule = useSelector(getRuleState);

    const dispatch = useDispatch();
    const history = useHistory();
    const { state, pathname } = useLocation<HistoryStateType>();

    const onChange = (v: SelectValueType) => {
        if (v.length <= 0) return;

        const r = {
            index: v[0].index,
            value: v[0].value as number,
        };

        dispatch(toggleRule(r));

        const seasonParam = getParameterByName("season");

        let pathName = pathname;

        if (seasonParam) {
            pathName += `?season=${seasonParam}&rule=${v[0].value}`;
        } else {
            pathName += `?rule=${v[0].value}`;
        }

        history.push(pathName, {
            ...state,
            rule: r,
        });

        window.scroll(0, 0);
    };

    return (
        <Selector value={rule} onChange={onChange} {...props}>
            {pageData.rules.map((option, i) => (
                <Option key={i} value={option.value}>
                    {option.text}
                </Option>
            ))}
        </Selector>
    );
};

export default RuleSelector;

import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    DefaultSelector as Selector,
    Option,
} from "../components/SelectorComponent";
import { SelectValue } from "../components/SelectorComponent/DefaultSelector";
import { getRuleState } from "../redux/selectors";
import PageDataContext from "../contexts/PageDataContext";
import { HistoryState } from "./HistoryContainer";
import { getParameterByName } from "../util";

export type RuleSelectorProps = {
    className?: string;
    style?: React.CSSProperties;
};

const RuleSelector: React.FC<RuleSelectorProps> = (props) => {
    const pageData = useContext(PageDataContext);
    const rule = useSelector(getRuleState);

    const history = useHistory<HistoryState>();

    if (!rule) {
        return <Selector {...props} />;
    }

    const onChange = (v: SelectValue) => {
        if (v.length <= 0) return;

        const seasonParam = getParameterByName("season");

        const location = history.location;
        let pathname = location.pathname;

        if (/^\/active-pokemon\/\d+$/.test(pathname)) {
            pathname = "/active-pokemon/1";
        }

        if (seasonParam) {
            pathname += `?season=${seasonParam}&rule=${v[0].value}`;
        } else {
            pathname += `?rule=${v[0].value}`;
        }

        history.push(pathname, {
            ...location.state,
            rule: {
                index: v[0].index,
                value: v[0].value as number,
            },
        });

        window.scroll(0, 0);
    };

    return (
        <Selector value={[rule]} onChange={onChange} {...props}>
            {pageData.rules.map((option, i) => (
                <Option key={i} value={option.value}>
                    {option.text}
                </Option>
            ))}
        </Selector>
    );
};

export default RuleSelector;

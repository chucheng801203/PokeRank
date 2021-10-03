import React from "react";
import { DefaultSelector, Option } from "../components/SelectorComponent";
import { SelectValue } from "./SelectorComponent/DefaultSelector";

const Selector: React.FC<{
    value: SelectValue;
    onChange: (v: SelectValue) => void;
    optionData: Array<{
        value: number;
        text: string;
    }>;
    [otherProps: string]: any;
}> = ({ value, onChange, optionData, ...otherProps }) => {
    return (
        <DefaultSelector value={value} onChange={onChange} {...otherProps}>
            {optionData.map((option, i) => (
                <Option key={i} value={option.value}>
                    {option.text}
                </Option>
            ))}
        </DefaultSelector>
    );
};

export default Selector;

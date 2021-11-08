import React, { useRef, ReactText, useState, useEffect } from "react";
import Popup from "../PopupComponent";
import { convertNodeToOption } from "./Option";
import OptionList from "./OptionList";
import useIsActive from "./hooks/useIsActive";
import selectStyle from "./select.module.scss";
import expandMoreIcon from "../../images/expand_more_black_24dp.svg";

export type SelectValueType = Array<{
    index: number;
    value?: ReactText;
    text?: ReactText;
}>;

export type DefaultSelectorProps = {
    value?: SelectValueType;
    children?: React.ReactNode;
    onChange?: (v: SelectValueType) => void;
    placeholder?: string;
    className?: string;
    [otherProps: string]: any;
};

const DefaultSelector: React.FC<DefaultSelectorProps> = ({
    value,
    children,
    onChange,
    placeholder,
    className = "",
    ...otherProps
}) => {
    const options = React.Children.map(children, (elem, i) => {
        return convertNodeToOption(elem, i);
    })?.filter((option) => option);

    const getCurrentValue = (): SelectValueType => {
        let current: SelectValueType;

        if (value && value.length > 0) {
            current = value;
        } else {
            return [];
        }

        if (!options) {
            return [];
        }

        let currentOption = options.filter(
            (o) => o.index === current[0].index && o.value === current[0].value
        );

        if (currentOption.length > 0) {
            current[0].text = currentOption[0].text;
            return [current[0]];
        }

        return [];
    };

    const [currentValue, setCurrentValue] = useState<SelectValueType>(
        getCurrentValue()
    );

    const nextValue = getCurrentValue();

    useEffect(() => {
        if (
            (nextValue.length > 0 && currentValue.length === 0) ||
            (currentValue[0] &&
                nextValue.length > 0 &&
                nextValue[0].index !== currentValue[0].index)
        )
            setCurrentValue(nextValue);
    }, [nextValue, currentValue]);

    const selectorRef = useRef<HTMLDivElement>(null);

    const [isActive, setIsActive] = useIsActive(selectorRef);

    // 當 currentValue 發生變動而觸發的事件
    const onChangeHandler = (v: SelectValueType) => {
        setCurrentValue(v);

        if (onChange) onChange(v);

        setIsActive(false);
    };

    className = `${selectStyle["pr-select-selector"]} ${className}`.trim();

    if (isActive)
        className = `${className} ${selectStyle["pr-select-selector-focus"]}`;

    return (
        <div className={selectStyle["pr-select"]} {...otherProps}>
            <div
                className={className}
                tabIndex={0}
                ref={selectorRef}
                onClick={(e) => {
                    setIsActive(!isActive);
                }}
            >
                {currentValue.length > 0 ? (
                    <span className={selectStyle["pr-select-selector-content"]}>
                        {currentValue.map((v) => v.text).join()}
                    </span>
                ) : placeholder ? (
                    <span
                        className={
                            selectStyle["pr-select-selector-placeholder"]
                        }
                    >
                        {placeholder}
                    </span>
                ) : (
                    "　"
                )}

                <div className={selectStyle["pr-select-selector-suIcon"]}>
                    <img src={expandMoreIcon} alt="expand more icon" />
                </div>
            </div>

            <Popup triggerRef={selectorRef} isActive={isActive}>
                <OptionList
                    options={options}
                    value={currentValue}
                    onChange={onChangeHandler}
                    selectorRef={selectorRef}
                />
            </Popup>
        </div>
    );
};

export default DefaultSelector;

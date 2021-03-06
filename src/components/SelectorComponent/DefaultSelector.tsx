import React, { useRef, ReactText, useState } from "react";
import classNames from "classnames";
import Popup from "../PopupComponent";
import { convertNodeToOption } from "./Option";
import OptionList from "./OptionList";
import useIsActive from "../PopupComponent/hooks/useIsActive";
import selectStyle from "./select.module.scss";
import expandMoreIcon from "../../images/expand_more_black_24dp.svg";

export type SelectValue = Array<{
    index: number;
    value?: ReactText;
    text?: ReactText;
}>;

export type DefaultSelectorProps = {
    value?: SelectValue;
    children?: React.ReactNode;
    onChange?: (v: SelectValue) => void;
    placeholder?: string;
    className?: string;
    [otherProps: string]: any;
};

const DefaultSelector: React.FC<DefaultSelectorProps> = ({
    value,
    children,
    onChange,
    placeholder,
    className,
    ...otherProps
}) => {
    const options = React.Children.map(children, (elem, i) => {
        return convertNodeToOption(elem, i);
    })?.filter((option) => option);

    const getCurrentValue = (): SelectValue => {
        let current: SelectValue;

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

    const [currentValue, setCurrentValue] = useState<SelectValue>(
        getCurrentValue()
    );

    const nextValue = getCurrentValue();

    if (
        nextValue.length > 0 &&
        (currentValue.length === 0 ||
            (currentValue.length > 0 &&
                nextValue[0].index !== currentValue[0].index))
    ) {
        setCurrentValue(nextValue);
    }

    const selectorRef = useRef<HTMLDivElement>(null);

    const [isActive, setIsActive] = useIsActive(selectorRef);

    // ??? currentValue ??????????????????????????????
    const onChangeHandler = (v: SelectValue) => {
        setCurrentValue(v);

        if (onChange) onChange(v);

        setIsActive(false);
    };

    return (
        <div className={selectStyle["pr-select"]} {...otherProps}>
            <div
                className={classNames(
                    selectStyle["pr-select-selector"],
                    className,
                    {
                        [selectStyle["pr-select-selector-focus"]]: isActive,
                    }
                )}
                tabIndex={0}
                ref={selectorRef}
                onClick={() => {
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
                    "???"
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

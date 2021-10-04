import React, { useRef, useState, useEffect } from "react";
import Popup from "../PopupComponent";
import { SelectValue } from "./DefaultSelector";
import { convertNodeToOption, OptionData } from "./Option";
import OptionList from "./OptionList";
import useIsActive from "./hooks/useIsActive";
import selectStyle from "./select.module.scss";

export type TextInputSelectorProps = {
    value?: string;
    className?: string;
    placeholder?: string;
    SufixIconBtn?: React.ComponentType<any>;
    children?: React.ReactNode;
    onChange?: (v: string) => void;
    onSubmit?: (v: SelectValue) => void;
    onSufixIconBtnClick?: (v: SelectValue) => void;
};

const TextInputSelector: React.FC<TextInputSelectorProps> = ({
    value,
    placeholder,
    SufixIconBtn,
    children,
    onChange,
    onSubmit,
    onSufixIconBtnClick,
    className = "",
}) => {
    const options = React.Children.map(children, (elem, i) => {
        return convertNodeToOption(elem, i);
    })?.filter((option) => option);

    const selectorRef = useRef<HTMLInputElement>(null);

    const [isActive, setIsActive] = useIsActive(selectorRef);

    const [currentValue, setCurrentValue] = useState<string>(
        value === undefined ? "" : value
    );

    useEffect(() => {
        if (value !== undefined) setCurrentValue(value);
        if (!value) setOptionListValueIndex(undefined);
    }, [value]);

    const onInputChangeHandler = (v: string) => {
        setCurrentValue(v);
        setOptionListValueIndex(v.trim() ? 0 : undefined);

        if (onChange) onChange(v);

        setIsActive(true);
    };

    const onOptionListChangeHandler = (v: SelectValue) => {
        onInputChangeHandler(v[0].text ? v[0].text.toString() : "");

        setIsActive(false);
    };

    let visibleOptions: Array<OptionData> | undefined;

    const str = currentValue.trim();

    if (!str) {
        visibleOptions = options?.slice(0, 9);
    } else {
        visibleOptions = options?.filter(
            (o) =>
                o.value.toString().indexOf(str) !== -1 ||
                o.text.toString().indexOf(str) !== -1
        );
    }

    const getOptionListValue = (index: number | undefined) => {
        if (
            index !== undefined &&
            visibleOptions &&
            visibleOptions.length > 0
        ) {
            let i = index % visibleOptions.length;

            i = i < 0 ? visibleOptions.length + i : Math.abs(i);

            return [
                {
                    index: visibleOptions[i].index,
                    value: visibleOptions[i].value,
                    text: visibleOptions[i].text,
                },
            ];
        }

        return [];
    };

    const [optionListValueIndex, setOptionListValueIndex] = useState<
        number | undefined
    >();

    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.code) {
            case "ArrowDown":
                setOptionListValueIndex(
                    optionListValueIndex === undefined
                        ? 0
                        : optionListValueIndex + 1
                );
                break;
            case "ArrowUp":
                setOptionListValueIndex(
                    optionListValueIndex === undefined
                        ? 0
                        : optionListValueIndex - 1
                );
                break;
            case "Enter":
                const v = getOptionListValue(optionListValueIndex);

                if (!v || !v[0]) return;

                break;
            case "Escape":
                setIsActive(false);
                break;
        }
    };

    const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const value = getOptionListValue(optionListValueIndex);

        if (!value || !value[0]) return;

        const text = value[0].text.toString();

        if (text !== currentValue) onInputChangeHandler(text);

        if (onSubmit) onSubmit(value);

        setIsActive(false);
    };

    return (
        <div
            className={`${selectStyle["pr-input-select"]} ${className}`}
            onClick={() => {
                if (!isActive) {
                    if (!currentValue) setOptionListValueIndex(undefined);
                    setIsActive(true);
                }
            }}
        >
            <form action="#" onSubmit={onSubmitHandler}>
                <input
                    {...(isActive && {
                        className:
                            selectStyle["pr-input-select-selector-focus"],
                    })}
                    type="text"
                    value={currentValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        e.preventDefault();
                        onInputChangeHandler(e.target.value);
                    }}
                    onKeyUp={onKeyDownHandler}
                    ref={selectorRef}
                    placeholder={placeholder}
                    autoComplete="off"
                />
            </form>
            {SufixIconBtn && (
                <SufixIconBtn
                    className={selectStyle["pr-input-select-icon-btn"]}
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                        e.preventDefault();
                        if (onSufixIconBtnClick) {
                            const value =
                                getOptionListValue(optionListValueIndex);

                            if (!value || !value[0]) return;

                            onSufixIconBtnClick(value);
                        }
                    }}
                />
            )}

            <Popup triggerRef={selectorRef} isActive={isActive}>
                <OptionList
                    options={visibleOptions}
                    value={getOptionListValue(optionListValueIndex)}
                    onChange={onOptionListChangeHandler}
                    selectorRef={selectorRef}
                    selector="inputSelector"
                />
            </Popup>
        </div>
    );
};

export default TextInputSelector;

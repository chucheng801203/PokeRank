import React, { useEffect, useRef } from "react";
import OptionItem from "./OptionItem";
import { SelectValueType } from "./DefaultSelector";
import { OptionData } from "./Option";
import selectStyle from "./select.module.scss";

export type OptionListProps = {
    selectorRef: React.RefObject<HTMLDivElement>;
    value?: SelectValueType;
    onChange?: (v: SelectValueType) => void;
    options?: Array<OptionData>;
    selector?: "inputSelector" | "defaultSelector";
};

const OptionList: React.FC<OptionListProps> = ({
    selectorRef,
    value,
    onChange,
    options,
    selector,
}) => {
    const optionListRef = useRef<HTMLDivElement>(null);

    const selectedIndex = value ? value.map((v) => v.index) : [];

    const onChangeHandler = (v: OptionData): void => {
        if (
            onChange &&
            (selectedIndex.indexOf(v.index) === -1 ||
                selector === "inputSelector")
        ) {
            onChange([{ index: v.index, value: v.value, text: v.text }]);
        }
    };

    useEffect(() => {
        if (optionListRef.current) {
            let selected = optionListRef.current.querySelector(
                `.${selectStyle["pr-select-popup-listItem-selected"]}`
            );

            if (selected) {
                optionListRef.current.scrollTop = (
                    selected as HTMLDivElement
                ).offsetTop;
            }
        }
    });

    return (
        <div
            className={`${selectStyle["pr-select-popup-list"]}`}
            ref={optionListRef}
        >
            {options &&
                options.map((v, i) => {
                    const selected = selectedIndex.indexOf(v.index);
                    const className = [selectStyle["pr-select-popup-listItem"]];

                    if (selected !== -1)
                        className.push(
                            selectStyle["pr-select-popup-listItem-selected"]
                        );

                    return (
                        <OptionItem
                            key={i}
                            className={className.join(" ")}
                            onClick={(e) => {
                                e.stopPropagation();
                                onChangeHandler(v);
                            }}
                            style={v.style}
                            selectorRef={selectorRef}
                        >
                            {v.children}
                        </OptionItem>
                    );
                })}
        </div>
    );
};

export default OptionList;

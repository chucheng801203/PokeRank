import React, { ReactText, ReactNode } from "react";
import { getNodeText } from "../../util";

export interface OptionProps {
    value: ReactText;
    children?: ReactNode;
    text?: ReactText;
    style?: React.CSSProperties;
}

export interface OptionData extends OptionProps {
    index: number;
    text: ReactText;
}

export function convertNodeToOption(
    node: React.ReactNode,
    index: number
): OptionData | boolean {
    const {
        type,
        props: { value, children, text, ...otherProps },
    } = node as React.ReactElement;

    let textContent = getNodeText(children);

    if (!textContent) {
        textContent = text ? text : "　";
    }

    if (type && (type as React.FC).displayName === "Option") {
        return { index, value, children, text: textContent, ...otherProps };
    }

    return false;
}

const Option: React.FC<OptionProps> = () => null;

Option.displayName = "Option";

export default Option;

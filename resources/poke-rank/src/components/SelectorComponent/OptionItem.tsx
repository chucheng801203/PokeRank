import React, { useEffect, useRef, ReactText } from "react";

export interface OptionItemProps {
    selectorRef: React.RefObject<HTMLDivElement>;
    key?: ReactText;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

const OptionItem: React.FC<OptionItemProps> = ({
    className,
    onClick,
    style,
    children,
    selectorRef,
}) => {
    const optionItemRef = useRef<HTMLDivElement>(null);

    const childrenIsText = ["string", "number"].includes(typeof children);

    useEffect(() => {
        const selector = selectorRef.current;
        const optionItem = optionItemRef.current;

        if (!childrenIsText) return;

        if (selector && optionItem && style?.height === undefined) {
            optionItem.style.height =
                selector.getBoundingClientRect().height + "px";
        }
    });

    if (childrenIsText) style = { padding: "0.4em 0.6em", ...style };

    return (
        <div
            className={className}
            onClick={onClick}
            style={style}
            ref={optionItemRef}
        >
            {children}
        </div>
    );
};

export default OptionItem;

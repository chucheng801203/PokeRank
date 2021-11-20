import React, { useEffect, useRef } from "react";
import { checkParentHasFixedProp, debounce } from "../../util";
import popupStyle from "./popup.module.scss";

export interface PopupContainerProps {
    popupRef: React.RefObject<HTMLElement>;
    triggerRef: React.RefObject<HTMLElement>;
    isActive?: boolean;
    children?: React.ReactNode;
    width?: string;
    align?: "top" | "left";
}

const PopupContainer: React.FC<PopupContainerProps> = ({
    triggerRef,
    children,
    isActive,
    popupRef,
    width,
    align,
}) => {
    const popupContainerRef = useRef<HTMLDivElement>(null);

    const setPopupContainerPosition = () => {
        const selector = triggerRef.current;
        const popupContainer = popupContainerRef.current;
        const popup = popupRef.current;

        if (selector && popupContainer && popup) {
            const offset = selector.getBoundingClientRect();
            const visualViewportOffset = popup.getBoundingClientRect();

            let x = offset.left;
            let y = offset.bottom;

            const isFixed = checkParentHasFixedProp(selector);

            if (!isFixed) {
                x += window.pageXOffset;
                y += window.pageYOffset;
            } else {
                if (Math.abs(visualViewportOffset.top) !== 0) {
                    y += Math.abs(visualViewportOffset.top);
                }

                if (Math.abs(visualViewportOffset.left) !== 0) {
                    x += Math.abs(visualViewportOffset.left);
                }
            }

            popupContainer.style.position = "absolute";

            if (align === "left" || !align) {
                popupContainer.style.left = `${x}px`;
            }

            if (align === "top" || !align) {
                popupContainer.style.top = `${y + 7}px`;
            }

            if (width) {
                popupContainer.style.width = width;
                popupContainer.style.height = "0";
            } else {
                popupContainer.style.width = `${offset.width}px`;
            }
        }
    };

    const delaySetPosition = debounce(setPopupContainerPosition, 50);

    useEffect(() => {
        setPopupContainerPosition();

        const popupContainer = popupContainerRef.current;
        if (popupContainer) popupContainer.style.display = "block";

        window.addEventListener("resize", delaySetPosition);

        return () => {
            window.removeEventListener("resize", delaySetPosition);
        };
    });

    return (
        <div
            className={popupStyle["pr-select-popup-container"]}
            ref={popupContainerRef}
        >
            {isActive && children}
        </div>
    );
};

export default PopupContainer;

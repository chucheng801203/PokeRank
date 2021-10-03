import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import PopupContainer from "./PopupContainer";
import { checkParentHasFixedProp } from "../../util";
import popupStyle from "./popup.module.scss";

export interface PopupProps {
    triggerRef: React.RefObject<HTMLDivElement>;
    isActive?: boolean;
    children?: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ triggerRef, isActive, children }) => {
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const selector = triggerRef.current;
        const popup = popupRef.current;

        if (selector && popup) {
            if (checkParentHasFixedProp(selector)) {
                popup.style.position = "fixed";
                popup.style.zIndex = "1030";
            }
        }
    });

    return ReactDOM.createPortal(
        <div className={`${popupStyle["pr-select-popup-mask"]}`} ref={popupRef}>
            <PopupContainer
                triggerRef={triggerRef}
                isActive={isActive}
                popupRef={popupRef}
            >
                {children}
            </PopupContainer>
        </div>,
        window.document.body
    );
};

export default Popup;

import { useState, useEffect } from "react";
import { contains } from "../../../util";

const useIsActive: (
    selectorRef: React.RefObject<HTMLElement>
) => [boolean, React.Dispatch<React.SetStateAction<boolean>>] = (
    selectorRef
) => {
    const [isActive, setIsActive] = useState<boolean>(false);

    const hidePopupList = () => {
        if (isActive) setIsActive(false);
    };

    const onDocumentClick = (e: Event) => {
        const selector = selectorRef.current;
        const target = e.target;

        if (selector && target && contains(selector, target as Node)) {
            return;
        }

        hidePopupList();
    };

    useEffect(() => {
        window.addEventListener("blur", hidePopupList);
        document.addEventListener("click", onDocumentClick);

        return () => {
            window.removeEventListener("blur", hidePopupList);
            document.removeEventListener("click", onDocumentClick);
        };
    });

    return [isActive, setIsActive];
};

export default useIsActive;

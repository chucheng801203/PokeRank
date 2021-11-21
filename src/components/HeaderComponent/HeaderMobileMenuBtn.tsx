import React, { useRef } from "react";
import classNames from "classnames";
import MenuIconBtn from "../MenuIconBtn";
import Popup from "../PopupComponent";
import useIsActive from "../SelectorComponent/hooks/useIsActive";
import styles from "./headerMobileMenuBtn.module.scss";
import TopListLink from "./TopListLink";
import ActivePokemonLink from "./ActivePokemonLink";

export type HeaderMobileMenuBtnProps = {
    className?: string;
};

const HeaderMobileMenuBtn: React.FC<HeaderMobileMenuBtnProps> = ({
    className,
}) => {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [isActive, setIsActive] = useIsActive(btnRef);

    return (
        <>
            <MenuIconBtn
                className={classNames(className, {
                    [styles["btn-active"]]: isActive,
                })}
                ref={btnRef}
                onClick={(e) => {
                    e.preventDefault();
                    setIsActive(!isActive);
                }}
            />
            <Popup
                triggerRef={btnRef}
                isActive={isActive}
                align="top"
                width="100%"
            >
                <div className="container-fluid py-0">
                    <ul className={styles["dropdown"]}>
                        <li className={styles["dropdown-item"]}>
                            <TopListLink
                                className={styles["dropdown-item-link"]}
                                activeClassName={styles["active"]}
                            />
                        </li>
                        <li className={styles["dropdown-item"]}>
                            <ActivePokemonLink
                                className={styles["dropdown-item-link"]}
                                activeClassName={styles["active"]}
                            />
                        </li>
                    </ul>
                </div>
            </Popup>
        </>
    );
};

export default HeaderMobileMenuBtn;

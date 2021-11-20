import React, { useRef } from "react";
import { Location } from "history";
import MenuIconBtn from "./MenuIconBtn";
import Popup from "./PopupComponent";
import useIsActive from "./SelectorComponent/hooks/useIsActive";
import styles from "./headerMobileMenuBtn.module.scss";
import { NavLink } from "react-router-dom";
import { HistoryState } from "../containers/HistoryContainer";

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
                className={className}
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
                            <NavLink
                                className={styles["dropdown-item-link"]}
                                to={(location: Location<HistoryState>) => ({
                                    ...location,
                                    pathname: "/",
                                    state: {
                                        ...location.state,
                                        searchText: "",
                                    },
                                })}
                                activeClassName={styles["active"]}
                                exact
                                onClick={() => {
                                    window.scrollTo(0, 0)
                                }}
                            >
                                排行榜
                            </NavLink>
                        </li>
                        <li className={styles["dropdown-item"]}>
                            <NavLink
                                className={styles["dropdown-item-link"]}
                                to={(location: Location<HistoryState>) => ({
                                    ...location,
                                    pathname: "/active-pokemon/1",
                                    state: {
                                        ...location.state,
                                        searchText: "",
                                    },
                                })}
                                activeClassName={styles["active"]}
                                isActive={(match, location) =>
                                    /^\/active-pokemon\/\d+$/.test(
                                        location.pathname
                                    )
                                }
                                onClick={() => {
                                    window.scrollTo(0, 0)
                                }}
                            >
                                可用寶可夢
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </Popup>
        </>
    );
};

export default HeaderMobileMenuBtn;

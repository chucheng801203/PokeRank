import React from "react";
import classNames from "classnames";
import styles from "./searchIconBtn.module.scss";
import menuIcon from "../images/menu_black_24dp.svg";

const MenuIconBtn = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...otherProps }, ref) => {
    return (
        <button
            ref={ref}
            className={classNames(styles["btn"], className)}
            title="選單"
            {...otherProps}
        >
            <img src={menuIcon} alt="menu icon" />
        </button>
    );
});

export default MenuIconBtn;

import React from "react";
import classNames from "classnames";
import styles from "./searchIconBtn.module.scss";
import searchIcon from "../images/search_black_24dp.svg";

const SearchIconBtn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> =
    ({ className, ...otherProps }) => {
        return (
            <button
                className={classNames(styles["search-icon-btn"], className)}
                title="搜尋"
                {...otherProps}
            >
                <img src={searchIcon} alt="search icon" />
            </button>
        );
    };

export default SearchIconBtn;

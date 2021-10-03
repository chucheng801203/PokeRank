import React from "react";
import styles from "./index.module.scss";
import searchIcon from "../images/search_black_24dp.svg";

const SearchIconBtn: React.FC<{
    className?: string;
    [otherProps: string]: any;
}> = ({ className = "", ...otherProps }) => {
    return (
        <button
            className={`${styles["search-icon-btn"]} ${className}`}
            title="搜尋"
            {...otherProps}
        >
            <img src={searchIcon} alt="search icon" />
        </button>
    );
};

export default SearchIconBtn;

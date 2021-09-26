import React from "react";
import styles from "./index.scss";
import searchIcon from "../images/search_black_24dp.svg";

export interface SearchIconProps {
    className?: string;
    [otherProps: string]: any;
}

type SearchIconBtn = React.FC<SearchIconProps>;

const SearchIconBtn: SearchIconBtn = ({ className = "", ...otherProps }) => {
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

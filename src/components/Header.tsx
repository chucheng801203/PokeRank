import React from "react";
import { Link } from "react-router-dom";
import HomePageLink from "../containers/HomePageLink";
import PokemonSelector from "../containers/PokemonSelector";
import SearchIconBtn from "./SearchIconBtn";
import RuleSelector from "../containers/RuleSelector";
import SeasonSelector from "../containers/SeasonSelector";
import styles from "./index.module.scss";

const Header: React.FC = () => (
    <nav
        className={`${styles["pr-header"]} container-fluid d-flex align-items-center`}
    >
        <div
            className="container d-flex align-items-center"
            style={{ lineHeight: "1.3" }}
        >
            <HomePageLink className={styles["pr-header-logo"]}>
                PokéRank
            </HomePageLink>

            <PokemonSelector
                className={styles["pr-header-search"]}
                SufixIconBtn={SearchIconBtn}
                placeholder="搜尋名稱或編號"
            />

            <div
                className={`${styles["pr-header-nav-btn"]} ${styles["pr-header-mobile-search-btn"]}`}
            >
                <Link to="/mobile/search/">
                    <SearchIconBtn style={{ fontSize: "1.3rem" }} />
                </Link>
            </div>

            <div
                className={`${styles["pr-header-nav-btn"]} ${styles["pr-header-season-selector"]}`}
            >
                <SeasonSelector style={{ width: "106px" }} />
            </div>

            <div className={styles["pr-header-nav-btn"]}>
                <RuleSelector />
            </div>
        </div>
    </nav>
);

export default Header;

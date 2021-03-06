import React from "react";
import { Location } from "history";
import { Link } from "react-router-dom";
import HomePageLink from "../../containers/HomePageLink";
import PokemonSelector from "../../containers/PokemonSelector";
import SearchIconBtn from "../SearchIconBtn";
import HeaderMobileMenuBtn from "./HeaderMobileMenuBtn";
import TopListLink from "./TopListLink";
import ActivePokemonLink from "./ActivePokemonLink";
import RuleSelector from "../../containers/RuleSelector";
import SeasonSelector from "../../containers/SeasonSelector";
import { HistoryState } from "../../containers/HistoryContainer";
import styles from "./header.module.scss";

const Header: React.FC = () => (
    <nav
        className={`${styles["header"]} container-fluid d-flex align-items-center`}
    >
        <div
            className={`container d-flex align-items-center h-100 ${styles["custom-container"]}`}
            style={{ lineHeight: "1.3" }}
        >
            <HomePageLink className={styles["header-logo"]}>
                PokéRank
            </HomePageLink>

            <HeaderMobileMenuBtn className={styles["header-mobile-menu"]} />

            <ul className={styles["header-nav"]}>
                <li className={styles["header-nav-item"]}>
                    <TopListLink
                        className={styles["header-nav-item-link"]}
                        activeClassName={styles["active"]}
                    />
                </li>
                <li className={styles["header-nav-item"]}>
                    <ActivePokemonLink
                        className={styles["header-nav-item-link"]}
                        activeClassName={styles["active"]}
                    />
                </li>
            </ul>

            <PokemonSelector
                className={styles["header-search"]}
                SufixIconBtn={SearchIconBtn}
                placeholder="搜尋名稱或編號"
            />

            <div
                className={`${styles["header-nav-btn"]} ${styles["header-mobile-search-btn"]}`}
            >
                <Link
                    to={({ state }: Location<HistoryState>) => ({
                        pathname: "/mobile/search/",
                        state: state,
                    })}
                >
                    <SearchIconBtn style={{ fontSize: "1.3rem" }} />
                </Link>
            </div>

            <div
                className={`${styles["header-nav-btn"]} ${styles["header-season-selector"]}`}
            >
                <SeasonSelector style={{ width: "106px" }} />
            </div>

            <div className={styles["header-nav-btn"]}>
                <RuleSelector style={{ width: "74px" }} />
            </div>
        </div>
    </nav>
);

export default Header;

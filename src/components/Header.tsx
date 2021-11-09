import React from "react";
import { Location } from "history";
import { Link } from "react-router-dom";
import HomePageLink from "../containers/HomePageLink";
import PokemonSelector from "../containers/PokemonSelector";
import SearchIconBtn from "./SearchIconBtn";
import RuleSelector from "../containers/RuleSelector";
import SeasonSelector from "../containers/SeasonSelector";
import { HistoryStateType } from "../containers/HistoryContainer";
import styles from "./header.module.scss";

const Header: React.FC = () => (
    <nav
        className={`${styles["header"]} container-fluid d-flex align-items-center`}
    >
        <div
            className="container d-flex align-items-center"
            style={{ lineHeight: "1.3" }}
        >
            <HomePageLink className={styles["header-logo"]}>
                PokéRank
            </HomePageLink>

            <PokemonSelector
                className={styles["header-search"]}
                SufixIconBtn={SearchIconBtn}
                placeholder="搜尋名稱或編號"
            />

            <div
                className={`${styles["header-nav-btn"]} ${styles["header-mobile-search-btn"]}`}
            >
                <Link
                    to={({ state }: Location<HistoryStateType>) => ({
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
                <RuleSelector />
            </div>
        </div>
    </nav>
);

export default Header;

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import PmSelectListItem from "./PmSelectListItem";
import { getSeasonState, getRuleState } from "../redux/selectors";
import styles from "./pokemonSelectorPage.module.scss";
import arrowBackIcon from "../images/arrow_back_black_24dp.svg";

const PokemonSelectorPage: React.FC<{
    value?: string;
    pokemonOptions?: Array<{
        id: number;
        name: string;
    }>;
    onChange?: (v: string) => void;
}> = ({ value, pokemonOptions, onChange }) => {
    const history = useHistory();
    const season = useSelector(getSeasonState);
    const rule = useSelector(getRuleState);

    useEffect(() => {
        window.document.body.style.overflow = "hidden";

        return () => {
            window.document.body.style.overflow = "visible";
        };
    });

    return (
        <div className={styles["pr-pokemon-selector-page"]}>
            <div className={styles["search-bar"]}>
                <button
                    className={styles["back-btn"]}
                    onClick={() => {
                        history.goBack();
                    }}
                >
                    <img src={arrowBackIcon} alt="back" />
                </button>
                <input
                    type="text"
                    placeholder="搜尋名稱或編號"
                    value={value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        e.preventDefault();
                        if (onChange) onChange(e.target.value);
                    }}
                    autoComplete="off"
                />
            </div>
            <div className={styles["option-list"]}>
                {pokemonOptions &&
                    pokemonOptions.map((o, i) => (
                        <Link
                            key={i}
                            className={styles["option-list-link"]}
                            to={{
                                pathname: `/${o.id}/0`,
                                search: `?season=${season[0].value}&rule=${rule[0].value}`,
                                state: {
                                    rule: rule[0],
                                    season: season[0],
                                    searchText: o.name,
                                },
                            }}
                        >
                            <PmSelectListItem
                                pmAvatar={`https://pokerank.s3.ap-northeast-1.amazonaws.com/images/cap${o.id}_f0_s0.png`}
                                pmId={o.id}
                                pmName={o.name}
                                className={styles["option-list-item"]}
                            />
                        </Link>
                    ))}
            </div>
        </div>
    );
};

export default PokemonSelectorPage;

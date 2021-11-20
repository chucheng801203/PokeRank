import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Location } from "history";
import classNames from "classnames";
import LazyLoadImage from "./LazyLoadImage";
import PageDataContext from "../contexts/PageDataContext";
import { ActivePokemonState } from "../redux/reducers/activePokemon";
import { RuleState } from "../redux/reducers/rule";
import { SeasonState } from "../redux/reducers/season";
import styles from "./activePokemonPage.module.scss";
import PmTypeBlock from "./PmTypeBlock";
import { getPmTypeColor } from "../util";
import RedirectHome from "./RedirectHome";
import { HistoryState } from "../containers/HistoryContainer";

export type ActivePokemonPageProps = {
    activePokemon: ActivePokemonState;
    season: SeasonState;
    rule: RuleState;
};

const ActivePokemonPage: React.FC<ActivePokemonPageProps> = ({
    activePokemon,
    season,
    rule,
}) => {
    const { pokemon, pokemon_types, base_stats } = useContext(PageDataContext);
    const acPms = activePokemon[`${season.value}_${rule.value}`];

    const { pageNum } = useParams<{
        pageNum: string;
    }>();

    if (!/^\d+$/.test(pageNum)) return <RedirectHome />;

    let currentPage = parseInt(pageNum);

    // 每次顯示50筆資料
    const per_page = 50;

    // 頁數
    const pages = Math.ceil(acPms.length / per_page);

    // 最大顯示頁數
    const pageItemCount = 5;

    // 可以看見的頁數
    const visiblePages = [];
    if (pages <= pageItemCount) {
        for (let i = 1; i <= pages; i++) {
            visiblePages.push(i);
        }
    } else if (currentPage <= Math.ceil(pageItemCount / 2)) {
        for (let i = 1; i <= pageItemCount; i++) {
            visiblePages.push(i);
        }
    } else if (currentPage >= pages - Math.ceil(pageItemCount / 2)) {
        for (let i = pages - pageItemCount + 1; i <= pages; i++) {
            visiblePages.push(i);
        }
    } else if (currentPage > Math.ceil(pageItemCount / 2)) {
        for (
            let i = currentPage - Math.floor(pageItemCount / 2);
            i <= currentPage + Math.floor(pageItemCount / 2);
            i++
        ) {
            visiblePages.push(i);
        }
    }

    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };

    return (
        <>
            <div className={styles["pagination"]}>
                {visiblePages[0] !== 1 && (
                    <Link
                        className={styles["pagination-item"]}
                        to={(location: Location<HistoryState>) => ({
                            ...location,
                            pathname: "/active-pokemon/1",
                        })}
                        onClick={scrollToTop}
                    >
                        1
                    </Link>
                )}
                {visiblePages[0] - 1 > 1 && (
                    <div className={styles["pagination-item-ignore"]}>•••</div>
                )}
                {visiblePages.map((v, i) => {
                    if (v > pages || v < 1) return null;

                    return (
                        <Link
                            className={classNames(styles["pagination-item"], {
                                [styles["active"]]: v === currentPage,
                            })}
                            key={i}
                            to={(location: Location<HistoryState>) => ({
                                ...location,
                                pathname: `/active-pokemon/${v}`,
                            })}
                            onClick={scrollToTop}
                        >
                            {v}
                        </Link>
                    );
                })}
                {visiblePages[visiblePages.length - 1] + 1 < pages && (
                    <div className={styles["pagination-item-ignore"]}>•••</div>
                )}
                {visiblePages[visiblePages.length - 1] < pages && (
                    <Link
                        className={styles["pagination-item"]}
                        to={(location: Location<HistoryState>) => ({
                            ...location,
                            pathname: `/active-pokemon/${pages}`,
                        })}
                        onClick={scrollToTop}
                    >
                        {pages}
                    </Link>
                )}
            </div>
            <div style={{ overflowX: "auto" }}>
                <table className={styles["table"]}>
                    <thead>
                        <tr>
                            <th>編號</th>
                            <th>圖片</th>
                            <th>名稱</th>
                            <th colSpan={2}>屬性</th>
                            <th>HP</th>
                            <th>攻擊</th>
                            <th>防禦</th>
                            <th>特功</th>
                            <th>特防</th>
                            <th>速度</th>
                        </tr>
                    </thead>
                    <tbody>
                        {acPms
                            .slice(
                                (currentPage - 1) * per_page,
                                (currentPage - 1) * per_page + per_page
                            )
                            .map((v, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{v.id}</td>
                                        <td>
                                            <LazyLoadImage
                                                className={styles["img"]}
                                                src={`${process.env.REACT_APP_IMAGE_PATH}/cap${v.id}_f${v.form_id}_s0.png`}
                                                alt="pokemon"
                                            />
                                        </td>
                                        <td>
                                            <Link
                                                to={(
                                                    location: Location<HistoryState>
                                                ) => ({
                                                    ...location,
                                                    pathname: `/${v.id}/${v.form_id}`,
                                                    search: `?season=${location.state.season.value}&rule=${location.state.rule.value}`,
                                                })}
                                            >
                                                {pokemon[v.id]}
                                            </Link>
                                        </td>

                                        {pokemon_types[v.id] &&
                                        pokemon_types[v.id][v.form_id] ? (
                                            pokemon_types[v.id][v.form_id]
                                                .length === 1 ? (
                                                <td
                                                    colSpan={2}
                                                    style={{
                                                        backgroundColor:
                                                            getPmTypeColor(
                                                                pokemon_types[
                                                                    v.id
                                                                ][v.form_id][0]
                                                            ),
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    <PmTypeBlock
                                                        pmType={
                                                            pokemon_types[v.id][
                                                                v.form_id
                                                            ][0]
                                                        }
                                                    />
                                                </td>
                                            ) : pokemon_types[v.id][v.form_id]
                                                  .length === 2 ? (
                                                <>
                                                    <td
                                                        style={{
                                                            backgroundColor:
                                                                getPmTypeColor(
                                                                    pokemon_types[
                                                                        v.id
                                                                    ][
                                                                        v
                                                                            .form_id
                                                                    ][0]
                                                                ),
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        <PmTypeBlock
                                                            pmType={
                                                                pokemon_types[
                                                                    v.id
                                                                ][v.form_id][0]
                                                            }
                                                        />
                                                    </td>
                                                    <td
                                                        style={{
                                                            backgroundColor:
                                                                getPmTypeColor(
                                                                    pokemon_types[
                                                                        v.id
                                                                    ][
                                                                        v
                                                                            .form_id
                                                                    ][1]
                                                                ),
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        <PmTypeBlock
                                                            pmType={
                                                                pokemon_types[
                                                                    v.id
                                                                ][v.form_id][1]
                                                            }
                                                        />
                                                    </td>
                                                </>
                                            ) : (
                                                <td colSpan={2}></td>
                                            )
                                        ) : (
                                            <td colSpan={2}></td>
                                        )}

                                        {base_stats[v.id] &&
                                        base_stats[v.id][v.form_id] ? (
                                            <>
                                                <td>
                                                    {
                                                        base_stats[v.id][
                                                            v.form_id
                                                        ].hp
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        base_stats[v.id][
                                                            v.form_id
                                                        ].atk
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        base_stats[v.id][
                                                            v.form_id
                                                        ].def
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        base_stats[v.id][
                                                            v.form_id
                                                        ].spa
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        base_stats[v.id][
                                                            v.form_id
                                                        ].spd
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        base_stats[v.id][
                                                            v.form_id
                                                        ].spe
                                                    }
                                                </td>
                                            </>
                                        ) : (
                                            Array.apply(null, Array(6)).map(
                                                (v, i) => <td key={i}></td>
                                            )
                                        )}
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
            <div className={styles["pagination"]}>
                {visiblePages[0] !== 1 && (
                    <Link
                        className={styles["pagination-item"]}
                        to={(location: Location<HistoryState>) => ({
                            ...location,
                            pathname: "/active-pokemon/1",
                        })}
                        onClick={scrollToTop}
                    >
                        1
                    </Link>
                )}
                {visiblePages[0] - 1 > 1 && (
                    <div className={styles["pagination-item-ignore"]}>•••</div>
                )}
                {visiblePages.map((v, i) => {
                    if (v > pages || v < 1) return null;

                    return (
                        <Link
                            className={classNames(styles["pagination-item"], {
                                [styles["active"]]: v === currentPage,
                            })}
                            key={i}
                            to={(location: Location<HistoryState>) => ({
                                ...location,
                                pathname: `/active-pokemon/${v}`,
                            })}
                            onClick={scrollToTop}
                        >
                            {v}
                        </Link>
                    );
                })}
                {visiblePages[visiblePages.length - 1] + 1 < pages && (
                    <div className={styles["pagination-item-ignore"]}>•••</div>
                )}
                {visiblePages[visiblePages.length - 1] < pages && (
                    <Link
                        className={styles["pagination-item"]}
                        to={(location: Location<HistoryState>) => ({
                            ...location,
                            pathname: `/active-pokemon/${pages}`,
                        })}
                        onClick={scrollToTop}
                    >
                        {pages}
                    </Link>
                )}
            </div>
        </>
    );
};

export default ActivePokemonPage;

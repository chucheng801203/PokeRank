import React, { useContext, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Location } from "history";
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
import Pagination from "./Pagination";
import classNames from "classnames";

export type ActivePokemonPageProps = {
    activePokemon: ActivePokemonState;
    season: SeasonState;
    rule: RuleState;
};

export type BaseStatKey = "hp" | "atk" | "def" | "spa" | "spd" | "spe";

export type OrderByState = {
    column: BaseStatKey;
    sort: "desc" | "asc";
};

const ActivePokemonPage: React.FC<ActivePokemonPageProps> = ({
    activePokemon,
    season,
    rule,
}) => {
    const { pokemon, pokemon_types, base_stats } = useContext(PageDataContext);
    const history = useHistory<HistoryState>();
    const { pageNum } = useParams<{
        pageNum: string;
    }>();
    const [orderBy, setOrderBy] = useState<OrderByState>();

    if (!/^\d+$/.test(pageNum)) return <RedirectHome />;

    const acPms = [
        ...activePokemon[`${season.value}_${rule.value}`].activePokemon,
    ];

    if (orderBy) {
        acPms.sort((a, b) => {
            if (!base_stats[a.id] || !base_stats[a.id][a.form_id]) {
                if (orderBy.sort === "asc") {
                    return -1;
                }
                return 1;
            }

            if (!base_stats[b.id] || !base_stats[b.id][b.form_id]) {
                if (orderBy.sort === "asc") {
                    return 1;
                }
                return -1;
            }

            const c1 = base_stats[a.id][a.form_id][orderBy.column];
            const c2 = base_stats[b.id][b.form_id][orderBy.column];

            if (orderBy.sort === "asc") {
                return c1 - c2;
            }

            return c2 - c1;
        });
    }

    let currentPage = parseInt(pageNum);

    // 每次顯示50筆資料
    const per_page = 50;

    // 頁數
    const pages = Math.ceil(acPms.length / per_page);

    // 最大顯示頁數
    const pageItemCount = 5;

    const { location } = history;
    const onPaginationChange = (page: number) => {
        history.push(`/active-pokemon/${page}${location.search}`, {
            ...location.state,
        });
        window.scrollTo(0, 0);
    };

    const onSortBtnClick = (state: OrderByState) => {
        return () => {
            if (
                orderBy &&
                orderBy.sort === state.sort &&
                orderBy.column === state.column
            ) {
                setOrderBy(undefined);
                return;
            }
            setOrderBy(state);
        };
    };

    return (
        <>
            <Pagination
                pages={pages}
                currentPage={currentPage}
                pageItemCount={pageItemCount}
                onChange={onPaginationChange}
            />
            <div style={{ overflowX: "auto", padding: "1px" }}>
                <table className={styles["table"]}>
                    <thead>
                        <tr>
                            <th>編號</th>
                            <th>圖片</th>
                            <th>名稱</th>
                            <th colSpan={2}>屬性</th>
                            {[
                                {
                                    colName: "HP",
                                    value: "hp",
                                },
                                {
                                    colName: "攻擊",
                                    value: "atk",
                                },
                                {
                                    colName: "防禦",
                                    value: "def",
                                },
                                {
                                    colName: "特功",
                                    value: "spa",
                                },
                                {
                                    colName: "特防",
                                    value: "spd",
                                },
                                {
                                    colName: "速度",
                                    value: "spe",
                                },
                            ].map((v, i) => (
                                <th key={i}>
                                    <div className="d-flex align-items-center">
                                        <span>{v.colName}</span>
                                        <div className="d-flex flex-column ml-2">
                                            <span
                                                className={classNames(
                                                    styles["sort-desc"],
                                                    {
                                                        [styles["active"]]:
                                                            orderBy &&
                                                            orderBy.column ===
                                                                v.value &&
                                                            orderBy.sort ===
                                                                "desc",
                                                    }
                                                )}
                                                onClick={onSortBtnClick({
                                                    column: v.value as BaseStatKey,
                                                    sort: "desc",
                                                })}
                                            />
                                            <span
                                                className={classNames(
                                                    styles["sort-asc"],
                                                    {
                                                        [styles["active"]]:
                                                            orderBy &&
                                                            orderBy.column ===
                                                                v.value &&
                                                            orderBy.sort ===
                                                                "asc",
                                                    }
                                                )}
                                                onClick={onSortBtnClick({
                                                    column: v.value as BaseStatKey,
                                                    sort: "asc",
                                                })}
                                            />
                                        </div>
                                    </div>
                                </th>
                            ))}
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
            <Pagination
                pages={pages}
                currentPage={currentPage}
                pageItemCount={pageItemCount}
                onChange={onPaginationChange}
            />
        </>
    );
};

export default ActivePokemonPage;

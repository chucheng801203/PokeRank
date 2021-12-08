import React from "react";
import styles from "./activePokemonPage.module.scss";

const ActivePokemonPageLoading: React.FC = () => (
    <div style={{ overflowX: "auto", padding: "1px" }}>
        <table className={styles["table-loading"]}>
            <thead>
                <tr>
                    <th>編號</th>
                    <th>圖片</th>
                    <th>名稱</th>
                    <th colSpan={2}>屬性</th>
                    <th>
                        <div className="d-flex align-items-center">
                            <span>HP</span>
                            <div className="d-flex flex-column ml-2">
                                <span className={styles["sort-desc"]} />
                                <span className={styles["sort-asc"]} />
                            </div>
                        </div>
                    </th>
                    <th>
                        <div className="d-flex align-items-center">
                            <span>攻擊</span>
                            <div className="d-flex flex-column ml-1">
                                <span className={styles["sort-desc"]} />
                                <span className={styles["sort-asc"]} />
                            </div>
                        </div>
                    </th>
                    <th>
                        <div className="d-flex align-items-center">
                            <span>防禦</span>
                            <div className="d-flex flex-column ml-1">
                                <span className={styles["sort-desc"]} />
                                <span className={styles["sort-asc"]} />
                            </div>
                        </div>
                    </th>
                    <th>
                        <div className="d-flex align-items-center">
                            <span>特功</span>
                            <div className="d-flex flex-column ml-1">
                                <span className={styles["sort-desc"]} />
                                <span className={styles["sort-asc"]} />
                            </div>
                        </div>
                    </th>
                    <th>
                        <div className="d-flex align-items-center">
                            <span>特防</span>
                            <div className="d-flex flex-column ml-1">
                                <span className={styles["sort-desc"]} />
                                <span className={styles["sort-asc"]} />
                            </div>
                        </div>
                    </th>
                    <th>
                        <div className="d-flex align-items-center">
                            <span>速度</span>
                            <div className="d-flex flex-column ml-1">
                                <span className={styles["sort-desc"]} />
                                <span className={styles["sort-asc"]} />
                            </div>
                        </div>
                    </th>
                </tr>
            </thead>

            <tbody>
                {Array.apply(null, Array(20)).map((v, i) => (
                    <tr key={i}>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colSpan={2}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default ActivePokemonPageLoading;

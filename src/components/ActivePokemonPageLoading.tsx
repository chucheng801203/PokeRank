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
                    <th>HP</th>
                    <th>攻擊</th>
                    <th>防禦</th>
                    <th>特功</th>
                    <th>特防</th>
                    <th>速度</th>
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

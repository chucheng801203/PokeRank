import React from "react";
import bootstrap from "bootstrap/dist/css/bootstrap-grid.min.css";
import styles from "./index.scss";

const Footer: React.FC = () => (
    <footer
        className={`${styles["pr-footer"]} ${bootstrap["container-fluid"]}`}
    >
        <span>
            Pokémon and all respective names are trademark & © of Nintendo
            1995-2021
        </span>
    </footer>
);

export default Footer;

import React from "react";
import styles from "./index.module.scss";

const Footer: React.FC = () => (
    <footer className={`${styles["pr-footer"]} container-fluid`}>
        <span>
            Pokémon and all respective names are trademark & © of Nintendo
            1995-2021
        </span>
    </footer>
);

export default Footer;

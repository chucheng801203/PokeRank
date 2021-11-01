import { FC } from "react";
import { createPortal } from "react-dom";
import styles from "./backgroundWrap.module.scss";

const BackgroundWrap: FC = () =>
    createPortal(
        <div className={styles["pr-background-wrap"]}></div>,
        window.document.body
    );

export default BackgroundWrap;

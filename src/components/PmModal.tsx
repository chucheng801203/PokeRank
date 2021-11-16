import React from "react";
import ReactDOM from "react-dom";
import styles from "./pmModal.module.scss";
import closeIcon from "../images/close_white_24dp.svg";

export type PmModalProps = {
    title?: React.ReactNode;
    content?: React.ReactNode;
    onCancel?: () => void;
};

const PmModal: React.FC<PmModalProps> = ({ title, content, onCancel }) => {
    return ReactDOM.createPortal(
        <div className={styles["mask"]} onClick={onCancel}>
            <div
                className={styles["modal"]}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className={styles["modal-header"]}>
                    <h4 className={styles["title"]}>{title}</h4>
                    <button className={styles["close-btn"]}>
                        <img src={closeIcon} alt="cancel" onClick={onCancel} />
                    </button>
                </div>
                <div className={styles["modal-body"]}>{content}</div>
            </div>
        </div>,
        window.document.body
    );
};

export default PmModal;

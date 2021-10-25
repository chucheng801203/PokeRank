import React from "react";
import ReactDOM from "react-dom";
import styles from "./index.module.scss";
import closeIcon from "../images/close_white_24dp.svg";

const PmModal: React.FC<{
    title?: React.ReactNode;
    content?: React.ReactNode;
    onCancel?: () => void;
}> = ({ title, content, onCancel }) => {
    return ReactDOM.createPortal(
        <div className={styles["pr-modal-mask"]} onClick={onCancel}>
            <div className={styles["pr-modal-modal"]} onClick={(e)=> {e.stopPropagation()}}>
                <div className={styles["header"]}>
                    <h4 className={styles["title"]}>{title}</h4>
                    <button className={styles["close-btn"]}>
                        <img src={closeIcon} alt="cancel" onClick={onCancel} />
                    </button>
                </div>
                <div className={styles["body"]}>{content}</div>
            </div>
        </div>,
        window.document.body
    );
};

export default PmModal;

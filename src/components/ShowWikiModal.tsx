import React, { useState, useContext } from "react";
import PmModal from "./PmModal";
import WikiDataContext from "../contexts/WikiDataContext";
import styles from "./showWikiModal.module.scss";

export type ShowWikiModalPropsType = {
    type: string;
    name?: string;
};

const ShowWikiModal: React.FC<ShowWikiModalPropsType> = ({
    children,
    type,
    name,
}) => {
    const { abilities, items, moves, natures } = useContext(WikiDataContext);

    let title: React.ReactNode = "";
    let content: React.ReactNode = "";

    switch (type) {
        case "abilities":
            if (name && abilities[name]) {
                title = (
                    <table className={styles["pr-show-wiki-modal-table"]}>
                        <thead>
                            <tr>
                                <th>特性：</th>
                                <th>{name}</th>
                            </tr>
                        </thead>
                    </table>
                );
                content = (
                    <table className={styles["pr-show-wiki-modal-table"]}>
                        <tbody>
                            <tr>
                                <td>描述：</td>
                                <td>{abilities[name].description}</td>
                            </tr>
                        </tbody>
                    </table>
                );
            }
            break;
        case "items":
            if (name && items[name]) {
                title = (
                    <table className={styles["pr-show-wiki-modal-table"]}>
                        <thead>
                            <tr>
                                <th>道具：</th>
                                <th>{name}</th>
                            </tr>
                        </thead>
                    </table>
                );
                content = (
                    <table className={styles["pr-show-wiki-modal-table"]}>
                        <tbody>
                            <tr>
                                <td>描述：</td>
                                <td>{items[name].description}</td>
                            </tr>
                        </tbody>
                    </table>
                );
            }
            break;
        case "moves":
            if (name && moves[name]) {
                title = (
                    <table className={styles["pr-show-wiki-modal-table"]}>
                        <thead>
                            <tr>
                                <th>招式：</th>
                                <th>{name}</th>
                            </tr>
                        </thead>
                    </table>
                );
                content = (
                    <table className={styles["pr-show-wiki-modal-table"]}>
                        <tbody>
                            <tr>
                                <td>屬性：</td>
                                <td>{moves[name].type}</td>
                            </tr>
                            <tr>
                                <td>分類：</td>
                                <td>{moves[name].class}</td>
                            </tr>
                            <tr>
                                <td>威力：</td>
                                <td>{moves[name].damage}</td>
                            </tr>
                            <tr>
                                <td>命中：</td>
                                <td>{moves[name].hitRate}</td>
                            </tr>
                            <tr>
                                <td>ｐｐ：</td>
                                <td>{moves[name].PP}</td>
                            </tr>
                            <tr>
                                <td>描述：</td>
                                <td>{moves[name].description}</td>
                            </tr>
                        </tbody>
                    </table>
                );
            }
            break;
        case "natures":
            if (name && natures[name]) {
                title = (
                    <table className={styles["pr-show-wiki-modal-table"]}>
                        <thead>
                            <tr>
                                <th>性格：</th>
                                <th>{name}</th>
                            </tr>
                        </thead>
                    </table>
                );
                content = (
                    <table className={styles["pr-show-wiki-modal-table"]}>
                        <tbody>
                            <tr>
                                <td>加：</td>
                                <td>{natures[name].advantage}</td>
                            </tr>
                            <tr>
                                <td>減：</td>
                                <td>{natures[name].weakness}</td>
                            </tr>
                            <tr>
                                <td>喜歡：</td>
                                <td>{natures[name].like}</td>
                            </tr>
                            <tr>
                                <td style={{ width: "80px" }}>不喜歡：</td>
                                <td>{natures[name].notlike}</td>
                            </tr>
                        </tbody>
                    </table>
                );
            }
            break;
    }

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const hideModal = () => {
        setIsModalVisible(false);
    };

    const childrenWithProps = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                onClick: () => {
                    showModal();
                },
            });
        }
        return child;
    });

    return (
        <>
            {childrenWithProps}

            {isModalVisible && (
                <PmModal onCancel={hideModal} title={title} content={content} />
            )}
        </>
    );
};

export default ShowWikiModal;

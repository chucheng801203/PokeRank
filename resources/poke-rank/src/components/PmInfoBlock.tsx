import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import PmTypeBlock from "./PmTypeBlock";
import LoadingBlock from "./LoadingBlock";
import PrContext, { PR_DATA } from "../PrContext";
import bootstrap from "bootstrap/dist/css/bootstrap-grid.min.css";
import styles from "./index.scss";

type PmInfoBlock = React.FC<{
    pmId?: number;
    formId?: number;
    pmRank?: number;
    isLoading?: boolean;
}>;

const LoadingMode = (prData: PR_DATA) => (
    <div className={styles["pr-info-block"]}>
        <div className={`${bootstrap["d-sm-flex"]} ${bootstrap["mb-3"]}`}>
            <div
                className={`${bootstrap["d-flex"]} ${bootstrap["align-items-center"]} ${bootstrap["mr-sm-auto"]} ${bootstrap["mb-2"]} ${bootstrap["mb-sm-0"]}`}
            >
                <LoadingBlock
                    className={`${styles["info-loading-name"]} ${bootstrap["mr-2"]}`}
                />
                <LoadingBlock
                    className={`${styles["info-loading-rank"]} ${bootstrap["mr-auto"]}`}
                />
            </div>
            <div
                className={`${bootstrap["d-flex"]} ${bootstrap["align-items-center"]}`}
            >
                <LoadingBlock className={styles["info-type"]} />
                <LoadingBlock className={styles["info-type"]} />
            </div>
        </div>
        <div
            className={`${bootstrap["d-flex"]} ${bootstrap["flex-wrap"]} ${bootstrap["mb-3"]}`}
        >
            <LoadingBlock className={styles["info-img"]} />
        </div>
        <div style={{ overflowX: "auto" }}>
            <div className={styles["info-weakness-table"]}>
                <div className={styles["info-table-tr"]}>
                    {prData.types.map((v, i) => (
                        <div key={i} className={styles["info-table-td"]}>
                            <LoadingBlock
                                style={{ width: "100%", height: "100%" }}
                            />
                        </div>
                    ))}
                </div>
                <div className={styles["info-table-tr"]}>
                    {prData.types.map((v, i) => (
                        <div key={i} className={styles["info-table-td"]}>
                            --
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const PmInfoBlock: PmInfoBlock = ({ pmId, formId, pmRank, isLoading }) => {
    const prData = useContext(PrContext);

    const location = useLocation();

    if (isLoading || typeof pmId !== "number" || typeof formId !== "number")
        return LoadingMode(prData);

    const pmTypes = prData.pokemon_types;

    if (!pmTypes[pmId] || !pmTypes[pmId][formId]) return LoadingMode(prData);

    const damage: Array<number> = [];
    for (let i = 0; i < pmTypes[pmId][formId].length; i++) {
        const typeId = pmTypes[pmId][formId][i];
        if (!prData.type_weakness[typeId]) {
            continue;
        }

        prData.type_weakness[typeId].forEach((v, j) => {
            if (typeof damage[j] !== "number") {
                damage[j] = v;
            } else {
                damage[j] = damage[j] * v;
            }
        });
    }

    return (
        <div className={styles["pr-info-block"]}>
            <div className={`${bootstrap["d-sm-flex"]} ${bootstrap["mb-3"]}`}>
                <div
                    className={`${bootstrap["d-flex"]} ${bootstrap["align-items-center"]} ${bootstrap["mr-sm-auto"]} ${bootstrap["mb-2"]} ${bootstrap["mb-sm-0"]}`}
                >
                    <h1
                        className={`${styles["info-name"]} ${bootstrap["mr-2"]}`}
                    >
                        {`No. ${pmId}`} {prData.pokemon[pmId]}
                    </h1>
                    <div className={bootstrap["mr-auto"]}>
                        {typeof pmRank === "number" && `# ${pmRank + 1}`}
                    </div>
                </div>
                <div
                    className={`${bootstrap["d-flex"]} ${bootstrap["align-items-center"]}`}
                >
                    {prData.pokemon_types[pmId][formId].map((v, i) => (
                        <PmTypeBlock
                            key={i}
                            className={styles["info-type"]}
                            pmType={v}
                        />
                    ))}
                </div>
            </div>
            <div
                className={`${bootstrap["d-flex"]} ${bootstrap["flex-wrap"]} ${bootstrap["mb-3"]}`}
            >
                {prData.pokemon_types[pmId].map((v, i) => (
                    <Link key={i} to={`/${pmId}/${i}${location.search}`}>
                        <figure
                            className={`${styles["info-img"]} ${
                                i === formId ? styles["info-img-focus"] : ""
                            }`}
                        >
                            <img
                                src={`/storage/pokemon_images/cap${pmId}_f${i}_s0.png`}
                                alt="pokemon"
                            />
                        </figure>
                    </Link>
                ))}
            </div>
            <div style={{ overflowX: "auto" }}>
                <div className={styles["info-weakness-table"]}>
                    <div className={styles["info-table-tr"]}>
                        {prData.types.map((v, i) => (
                            <div key={i} className={styles["info-table-td"]}>
                                <PmTypeBlock
                                    pmType={i}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        color: "white",
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className={styles["info-table-tr"]}>
                        {damage.map((v, i) => (
                            <div key={i} className={styles["info-table-td"]}>
                                {v === 0.5 ? (
                                    <>
                                        <sup>1</sup>/<sub>2</sub>
                                    </>
                                ) : v === 0.25 ? (
                                    <>
                                        <sup>1</sup>/<sub>4</sub>
                                    </>
                                ) : (
                                    v
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PmInfoBlock;

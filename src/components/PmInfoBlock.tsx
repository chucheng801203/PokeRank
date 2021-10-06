import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import PmTypeBlock from "./PmTypeBlock";
import LoadingBlock from "./LoadingBlock";
import PageDataContext, { PageDataType } from "../PageDataContext";
import styles from "./index.module.scss";

const LoadingMode = (pageData: PageDataType) => (
    <div className={styles["pr-info-block"]}>
        <div className="d-sm-flex mb-3">
            <div className="d-flex align-items-center mr-sm-auto mb-2 mb-sm-0">
                <LoadingBlock
                    className={`${styles["info-loading-name"]} mr-2`}
                />
                <LoadingBlock
                    className={`${styles["info-loading-rank"]} mr-auto`}
                />
            </div>
            <div className="d-flex align-items-center">
                <LoadingBlock className={styles["info-type"]} />
                <LoadingBlock className={styles["info-type"]} />
            </div>
        </div>
        <div className="d-flex flex-wrap mb-3">
            <LoadingBlock className={styles["info-img"]} />
        </div>
        <div style={{ overflowX: "auto" }}>
            <div className={styles["info-weakness-table"]}>
                <div className={styles["info-table-tr"]}>
                    {pageData.types.map((v, i) => (
                        <div key={i} className={styles["info-table-td"]}>
                            <LoadingBlock
                                style={{ width: "100%", height: "100%" }}
                            />
                        </div>
                    ))}
                </div>
                <div className={styles["info-table-tr"]}>
                    {pageData.types.map((v, i) => (
                        <div key={i} className={styles["info-table-td"]}>
                            --
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const PmInfoBlock: React.FC<{
    pmId?: number;
    formId?: number;
    pmRank?: number;
    isLoading?: boolean;
}> = ({ pmId, formId, pmRank, isLoading }) => {
    const pageData = useContext(PageDataContext);

    const location = useLocation();

    if (isLoading || typeof pmId !== "number" || typeof formId !== "number")
        return LoadingMode(pageData);

    const pmTypes = pageData.pokemon_types;

    if (!pmTypes[pmId] || !pmTypes[pmId][formId]) return LoadingMode(pageData);

    const damage: Array<number> = [];
    for (let i = 0; i < pmTypes[pmId][formId].length; i++) {
        const typeId = pmTypes[pmId][formId][i];
        if (!pageData.type_weakness[typeId]) {
            continue;
        }

        pageData.type_weakness[typeId].forEach((v, j) => {
            if (typeof damage[j] !== "number") {
                damage[j] = v;
            } else {
                damage[j] = damage[j] * v;
            }
        });
    }

    return (
        <div className={styles["pr-info-block"]}>
            <div className="d-sm-flex mb-3">
                <div className="d-flex align-items-center mr-sm-auto mb-2 mb-sm-0">
                    <h1 className={`${styles["info-name"]} mr-2`}>
                        {`No. ${pmId}`} {pageData.pokemon[pmId]}
                    </h1>
                    <div className="mr-auto">
                        {typeof pmRank === "number" && `# ${pmRank + 1}`}
                    </div>
                </div>
                <div className="d-flex align-items-center">
                    {pageData.pokemon_types[pmId][formId].map((v, i) => (
                        <PmTypeBlock
                            key={i}
                            className={styles["info-type"]}
                            pmType={v}
                        />
                    ))}
                </div>
            </div>
            <div className="d-flex flex-wrap mb-3">
                {pageData.pokemon_types[pmId].map((v, i) => (
                    <Link key={i} to={`/${pmId}/${i}${location.search}`}>
                        <figure
                            className={`${styles["info-img"]} ${
                                i === formId ? styles["info-img-focus"] : ""
                            }`}
                        >
                            <img
                                src={`https://pokerank.s3.ap-northeast-1.amazonaws.com/images/cap${pmId}_f${i}_s0.png`}
                                alt="pokemon"
                            />
                        </figure>
                    </Link>
                ))}
            </div>
            <div style={{ overflowX: "auto" }}>
                <div className={styles["info-weakness-table"]}>
                    <div className={styles["info-table-tr"]}>
                        {pageData.types.map((v, i) => (
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
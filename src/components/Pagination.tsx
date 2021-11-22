import React from "react";
import classNames from "classnames";
import styles from "./Pagination.module.scss";

export type PaginationProps = {
    pages: number; // 總頁數
    currentPage: number; // 現在所在頁數
    pageItemCount: number; // 最大顯示頁數(奇數)
    onChange?: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
    pages,
    currentPage,
    pageItemCount,
    onChange,
}) => {
    // 可以看見的頁數
    const visiblePages = [];
    if (pages <= pageItemCount) {
        for (let i = 1; i <= pages; i++) {
            visiblePages.push(i);
        }
    } else if (currentPage <= Math.ceil(pageItemCount / 2)) {
        for (let i = 1; i <= pageItemCount; i++) {
            visiblePages.push(i);
        }
    } else if (currentPage >= pages - Math.ceil(pageItemCount / 2)) {
        for (let i = pages - pageItemCount + 1; i <= pages; i++) {
            visiblePages.push(i);
        }
    } else if (currentPage > Math.ceil(pageItemCount / 2)) {
        for (
            let i = currentPage - Math.floor(pageItemCount / 2);
            i <= currentPage + Math.floor(pageItemCount / 2);
            i++
        ) {
            visiblePages.push(i);
        }
    }

    return (
        <div className={styles["pagination"]}>
            {visiblePages[0] !== 1 && (
                <div
                    className={styles["pagination-item"]}
                    onClick={() => {
                        onChange && onChange(1);
                    }}
                >
                    1
                </div>
            )}
            {visiblePages[0] - 1 > 1 && (
                <div className={styles["pagination-item-ignore"]}>•••</div>
            )}
            {visiblePages.map((v, i) => {
                if (v > pages || v < 1) return null;

                return (
                    <div
                        className={classNames(styles["pagination-item"], {
                            [styles["active"]]: v === currentPage,
                        })}
                        key={i}
                        onClick={() => {
                            v !== currentPage && onChange && onChange(v);
                        }}
                    >
                        {v}
                    </div>
                );
            })}
            {visiblePages[visiblePages.length - 1] + 1 < pages && (
                <div className={styles["pagination-item-ignore"]}>•••</div>
            )}
            {visiblePages[visiblePages.length - 1] < pages && (
                <div
                    className={styles["pagination-item"]}
                    onClick={() => {
                        onChange && onChange(pages);
                    }}
                >
                    {pages}
                </div>
            )}
        </div>
    );
};

export default Pagination;

import React from "react";
import { Location } from "history";
import { NavLink } from "react-router-dom";
import { HistoryState } from "../../containers/HistoryContainer";

export type TopListLinkProps = {
    className?: string;
    activeClassName?: string;
};

const TopListLink: React.FC<TopListLinkProps> = ({
    className,
    activeClassName,
}) => {
    return (
        <NavLink
            className={className}
            to={(location: Location<HistoryState>) => ({
                ...location,
                pathname: "/",
                state: {
                    ...location.state,
                    searchText: "",
                },
            })}
            activeClassName={activeClassName}
            exact
            onClick={() => {
                window.scrollTo(0, 0);
            }}
        >
            排行榜
        </NavLink>
    );
};

export default TopListLink;

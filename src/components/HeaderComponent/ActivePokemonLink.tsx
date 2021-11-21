import React from "react";
import { Location } from "history";
import { NavLink } from "react-router-dom";
import { HistoryState } from "../../containers/HistoryContainer";

export type ActivePokemonLinkProps = {
    className?: string;
    activeClassName?: string;
};

const ActivePokemonLink: React.FC<ActivePokemonLinkProps> = ({
    className,
    activeClassName,
}) => {
    return (
        <NavLink
            className={className}
            to={(location: Location<HistoryState>) => ({
                ...location,
                pathname: "/active-pokemon/1",
                state: {
                    ...location.state,
                    searchText: "",
                },
            })}
            activeClassName={activeClassName}
            isActive={(match, location) =>
                /^\/active-pokemon\/\d+$/.test(location.pathname)
            }
            onClick={() => {
                window.scrollTo(0, 0);
            }}
        >
            可用寶可夢
        </NavLink>
    );
};

export default ActivePokemonLink;

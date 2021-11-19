import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { HistoryState } from "./HistoryContainer";
import searchTextAction from "../redux/actions/searchText";
import PageDataContext from "../contexts/PageDataContext";
import { getDefaultState } from "../redux/store";

export type HomePageLinkProps = {
    className?: string;
};

const HomePageLink: React.FC<HomePageLinkProps> = ({ children, className }) => {
    const pageData = useContext(PageDataContext);
    const dispatch = useDispatch();
    const history = useHistory<HistoryState>();

    const onClick: React.MouseEventHandler = (e) => {
        e.preventDefault();

        if (!pageData.page_loading) {
            const location = history.location;
            const { state } = location;
            const { rule, season } = getDefaultState(pageData);

            if (
                state.rule.index !== rule[0].index ||
                state.season.index !== season[0].index ||
                location.pathname !== "/"
            ) {
                history.push("", {
                    rule: rule[0],
                    season: season[0],
                    searchText: "",
                });
            } else if (location.search !== "") {
                history.replace("", {
                    rule: rule[0],
                    season: season[0],
                    searchText: "",
                });
            }

            dispatch(searchTextAction(""));
            window.scroll(0, 0);
        }
    };

    return (
        <a className={className} onClick={onClick} href="/#">
            {children}
        </a>
    );
};

export default HomePageLink;

import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import toggleRule from "../redux/actions/rule";
import toggleSeason from "../redux/actions/season";
import searchTextAction from "../redux/actions/searchText";
import { RuleState } from "../redux/reducers/rule";
import { SeasonState } from "../redux/reducers/season";
import PageDataContext from "../contexts/PageDataContext";
import { getDefaultState } from "../redux/store";

export type HomePageLinkProps = {
    className?: string;
};

const HomePageLink: React.FC<HomePageLinkProps> = ({
    children,
    className,
}) => {
    const pageData = useContext(PageDataContext);
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation<{ rule: RuleState; season: SeasonState }>();

    const onClick: React.MouseEventHandler = (e) => {
        e.preventDefault();

        if (!pageData.page_loading) {
            const { state } = location;
            const { rule, season } = getDefaultState(pageData);

            if (state.rule.index !== rule[0].index) {
                dispatch(toggleRule(rule[0]));
            }

            if (state.season.index !== season[0].index) {
                dispatch(toggleSeason(season[0]));
            }

            if (
                state.rule.index !== rule[0].index ||
                state.season.index !== season[0].index ||
                location.pathname !== "/"
            ) {
                history.push("", {
                    rule: rule[0],
                    season: season[0],
                });
            } else if (location.search !== "") {
                history.replace("", {
                    rule: rule[0],
                    season: season[0],
                });
            }

            window.scroll(0, 0);
        }

        dispatch(searchTextAction(""));
    };

    return (
        <a className={className} onClick={onClick} href="/#">
            {children}
        </a>
    );
};

export default HomePageLink;

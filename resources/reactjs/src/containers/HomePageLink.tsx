import React from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import toggleRule from "../redux/actions/rule";
import toggleSeason from "../redux/actions/season";
import searchTextAction from "../redux/actions/searchText";
import { RuleState } from "../redux/reducers/rule";
import { SeasonState } from "../redux/reducers/season";
import { defaultState } from "../redux/store";

type HomePageLink = React.FC<{
    className?: string;
}>;

const HomePageLink: HomePageLink = ({ children, className }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation<{ rule: RuleState; season: SeasonState }>();

    const onClick: React.MouseEventHandler = (e) => {
        e.preventDefault();

        const { state } = location;
        const { rule, season } = defaultState;

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

        dispatch(searchTextAction(""));
    };

    return (
        <a className={className} onClick={onClick}>
            {children}
        </a>
    );
};

export default HomePageLink;

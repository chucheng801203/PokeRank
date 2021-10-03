import React, { useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import toggleRule from "../redux/actions/rule";
import toggleSeason from "../redux/actions/season";
import searchTextAction from "../redux/actions/searchText";
import { RuleState } from "../redux/reducers/rule";
import { SeasonState } from "../redux/reducers/season";
import { getSeasonState, getRuleState } from "../redux/selectors";
import PageDataContext from "../PageDataContext";

const HistoryContainer: React.FC = () => {
    const { page_loading } = useContext(PageDataContext);
    const dispatch = useDispatch();
    const season = useSelector(getSeasonState);
    const rule = useSelector(getRuleState);

    const historyState = useHistory();
    const location = useLocation<{
        rule: RuleState;
        season: SeasonState;
        searchText: string;
    }>();

    useEffect(() => {
        const { state, search } = location;

        if (!page_loading) {
            if (
                !state ||
                (state.season.index !== season[0].index && search === "")
            ) {
                historyState.replace(
                    window.location.pathname + location.search,
                    {
                        rule: rule[0],
                        season: season[0],
                        searchText: "",
                    }
                );
            } else {
                if (state.rule.index !== rule[0].index)
                    dispatch(toggleRule(state.rule));

                if (state.season.index !== season[0].index)
                    dispatch(toggleSeason(state.season));

                dispatch(
                    searchTextAction(state.searchText ? state.searchText : "")
                );
            }
        }
    });

    return null;
};

export default HistoryContainer;

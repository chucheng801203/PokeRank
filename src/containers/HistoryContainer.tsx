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
import { getDefaultState } from "../util";

export type HistoryStateType = {
    rule: RuleState;
    season: SeasonState;
    searchText: string;
};

const HistoryContainer: React.FC = () => {
    const pageData = useContext(PageDataContext);
    const dispatch = useDispatch();
    const season = useSelector(getSeasonState);
    const rule = useSelector(getRuleState);

    const history = useHistory();
    const { state, search } = useLocation<HistoryStateType>();

    useEffect(() => {
        if (!state) {
            history.replace(window.location.pathname + search, {
                rule: rule[0],
                season: season[0],
                searchText: "",
            });
        } else if (history.action === "POP") {
            const defaultState = getDefaultState(pageData);

            if (
                state.season.index === season[0].index &&
                defaultState.season[0].value !== season[0].value &&
                search === ""
            ) {
                // 當賽季更新時，重新整理時首頁的 location state 也要更新成最新賽季
                history.replace(window.location.pathname + search, {
                    rule: defaultState.rule[0],
                    season: defaultState.season[0],
                    searchText: "",
                });
            } else {
                if (state.season.index !== season[0].index)
                    dispatch(toggleSeason(state.season));

                if (state.rule.index !== rule[0].index)
                    dispatch(toggleRule(state.rule));

                dispatch(
                    searchTextAction(state.searchText ? state.searchText : "")
                );
            }
        }
    });

    return null;
};

export default HistoryContainer;

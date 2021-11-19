import React, { useEffect, useContext } from "react";
import { useDispatch, useStore } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import toggleRule from "../redux/actions/rule";
import toggleSeason from "../redux/actions/season";
import searchTextAction from "../redux/actions/searchText";
import { RuleState } from "../redux/reducers/rule";
import { SeasonState } from "../redux/reducers/season";
import PageDataContext from "../contexts/PageDataContext";
import { getDefaultState, RootState } from "../redux/store";

export type HistoryState = {
    rule: RuleState;
    season: SeasonState;
    searchText: string;
};

const HistoryContainer: React.FC = () => {
    const pageData = useContext(PageDataContext);
    const dispatch = useDispatch();

    const store = useStore<RootState>();
    const { season, rule } = store.getState();

    const history = useHistory();
    const { state, search, pathname } = useLocation<HistoryState>();

    // 網頁剛載入時加入預設 history state
    useEffect(() => {
        if (state || pageData.page_loading) return;

        history.replace(pathname + search, {
            rule: rule[0],
            season: season[0],
            searchText: "",
        });
    });

    // push & popstate & replace event
    useEffect(() => {
        if (!state || pageData.page_loading) return;

        const defaultState = getDefaultState(pageData);

        if (
            state.season.index === season[0].index &&
            defaultState.season[0].value !== season[0].value &&
            search === ""
        ) {
            // 當賽季更新時，重新整理時首頁的 location state 也要更新成最新賽季
            history.replace(pathname + search, {
                rule: defaultState.rule[0],
                season: defaultState.season[0],
                searchText: "",
            });
        } else {
            dispatch(toggleSeason(state.season));

            dispatch(toggleRule(state.rule));

            dispatch(
                searchTextAction(state.searchText ? state.searchText : "")
            );
        }
    });

    return null;
};

export default HistoryContainer;

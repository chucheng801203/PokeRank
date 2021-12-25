import React, { useEffect, useContext } from "react";
import { useDispatch, useStore } from "react-redux";
import { useLocation } from "react-router-dom";
import toggleRule from "../redux/actions/rule";
import toggleSeason from "../redux/actions/season";
import searchTextAction from "../redux/actions/searchText";
import { RuleState, SeasonState } from "../redux/reducers/rs";
import PageDataContext from "../contexts/PageDataContext";
import { RootState } from "../redux/store";
import { getRS } from "../redux/selectors";

export type HistoryState = {
    rule: RuleState;
    season: SeasonState;
    searchText: string;
};

const HistoryContainer: React.FC = () => {
    const pageData = useContext(PageDataContext);
    const dispatch = useDispatch();

    const { state } = useLocation<HistoryState>();
    const { season, rule } = getRS(useStore<RootState>().getState());

    // push & popstate & replace event
    useEffect(() => {
        if (!state || pageData.page_loading || !season || !rule) return;

        if (season.index !== state.season.index) {
            dispatch(toggleSeason(state.season));
        }

        if (rule.index !== state.rule.index) {
            dispatch(toggleRule(state.rule));
        }

        dispatch(searchTextAction(state.searchText ? state.searchText : ""));
    });

    return null;
};

export default HistoryContainer;

import React, { useEffect, useContext } from "react";
import { useDispatch, useStore } from "react-redux";
import { useLocation } from "react-router-dom";
import toggleRule from "../redux/actions/rule";
import toggleSeason from "../redux/actions/season";
import searchTextAction from "../redux/actions/searchText";
import { RuleState } from "../redux/reducers/rule";
import { SeasonState } from "../redux/reducers/season";
import PageDataContext from "../contexts/PageDataContext";
import { RootState } from "../redux/store";

export type HistoryState = {
    rule: RuleState;
    season: SeasonState;
    searchText: string;
};

const HistoryContainer: React.FC = () => {
    const pageData = useContext(PageDataContext);
    const dispatch = useDispatch();

    const { state } = useLocation<HistoryState>();
    const {season, rule} = useStore<RootState>().getState();

    // push & popstate & replace event
    useEffect(() => {
        if (!state || pageData.page_loading) return;

        if (season[0].index !== state.season.index) {
            dispatch(toggleSeason(state.season));
        }

        if (rule[0].index !== state.rule.index) {
            dispatch(toggleRule(state.rule));
        }

        dispatch(searchTextAction(state.searchText ? state.searchText : ""));
    });

    return null;
};

export default HistoryContainer;

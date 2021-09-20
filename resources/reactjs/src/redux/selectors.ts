import { RootState } from "./store";

export const getRuleState = (state: RootState) => state.rule;

export const getSeasonState = (state: RootState) => state.season;

export const getTopListState = (state: RootState) => state.topList;

export const getRankDataState = (state: RootState) => state.rankData;

export const getSearchTextState = (state: RootState) => state.searchText;

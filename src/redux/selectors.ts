import { RootState } from "./store";

export const getRuleState = (state: RootState) => state.rs.rule;

export const getSeasonState = (state: RootState) => state.rs.season;

export const getTopListState = (state: RootState) => state.topList;

export const getRankDataState = (state: RootState) => state.rankData;

export const getSearchTextState = (state: RootState) => state.searchText;

export const getActivePokemonState = (state: RootState) => state.activePokemon;

export const getRS = (state: RootState) => state.rs;

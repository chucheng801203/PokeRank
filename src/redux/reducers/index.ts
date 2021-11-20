import { combineReducers } from "redux";
import rule from "./rule";
import season from "./season";
import topList from "./topList";
import rankData from "./rankData";
import searchText from "./searchText";
import activePokemon from "./activePokemon";

export default combineReducers({
    rule,
    season,
    topList,
    rankData,
    searchText,
    activePokemon,
});

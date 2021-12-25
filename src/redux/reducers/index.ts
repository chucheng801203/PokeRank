import { combineReducers } from "redux";
import rs from "./rs";
import topList from "./topList";
import rankData from "./rankData";
import searchText from "./searchText";
import activePokemon from "./activePokemon";

export default combineReducers({
    rs,
    topList,
    rankData,
    searchText,
    activePokemon,
});

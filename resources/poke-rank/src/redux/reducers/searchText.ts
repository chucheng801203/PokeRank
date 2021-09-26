import { SearchTextAction, CHANGE_SEARCH_TEXT } from "../actions/searchText";

export type SearchTextState = string;

export default (state: SearchTextState = "", action: SearchTextAction) => {
    switch (action.type) {
        case CHANGE_SEARCH_TEXT:
            return action.text;
        default:
            return state;
    }
};

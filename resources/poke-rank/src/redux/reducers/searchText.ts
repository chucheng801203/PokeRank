import { SearchTextAction, CHANGE_SEARCH_TEXT } from "../actions/searchText";

export type SearchTextState = string;

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (state: SearchTextState = "", action: SearchTextAction) => {
    switch (action.type) {
        case CHANGE_SEARCH_TEXT:
            return action.text;
        default:
            return state;
    }
};

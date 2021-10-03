export const CHANGE_SEARCH_TEXT = "changeSearchText";

export type SearchTextAction = {
    type: typeof CHANGE_SEARCH_TEXT;
    text: string;
};

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (text: string): SearchTextAction => ({
    type: CHANGE_SEARCH_TEXT,
    text,
});

export const CHANGE_SEARCH_TEXT = "changeSearchText";

export type SearchTextAction = {
    type: typeof CHANGE_SEARCH_TEXT;
    text: string;
};

export default (text: string): SearchTextAction => ({
    type: CHANGE_SEARCH_TEXT,
    text,
});

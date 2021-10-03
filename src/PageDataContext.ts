import React from "react";

export type PageDataType = {
    page_loading: boolean;
    rules: Array<{ value: number; text: string }>;
    seasons: Array<{
        value: number;
        text: string;
        start: string;
        end: string;
    }>;
    items: Array<string>;
    abilities: Array<string>;
    moves: Array<{ name: string; type_id: number }>;
    natures: Array<string>;
    types: Array<string>;
    pokemon: { [id: number]: string };
    pokemon_types: Array<Array<Array<number>>>;
    type_weakness: Array<Array<number>>;
};

export const defaultPageData: PageDataType = {
    page_loading: true,
    rules: [],
    seasons: [],
    items: [],
    abilities: [],
    moves: [],
    natures: [],
    types: [],
    pokemon: {},
    pokemon_types: [],
    type_weakness: [],
};

export default React.createContext(defaultPageData);

import React from "react";

export type PR_DATA = {
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

export const PR_DATA: PR_DATA = JSON.parse(
    document.getElementById("__PR_DATA__")?.textContent as string
);

export default React.createContext(PR_DATA);

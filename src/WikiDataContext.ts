import React from "react";

export type WikiDataType = {
    page_loading: boolean;
    items: {
        [name: string]: {
            description: string;
        };
    };
    abilities: {
        [name: string]: {
            description: string;
        };
    };
    moves: {
        [name: string]: {
            PP: string;
            class: string;
            type: string;
            damage: string;
            hitRate: string;
            description: string;
        };
    };
    natures: {
        [name: string]: {
            advantage: string;
            like: string;
            notlike: string;
            weakness: string;
        };
    };
};

export const defaultWikiData: WikiDataType = {
    page_loading: true,
    items: {},
    abilities: {},
    moves: {},
    natures: {},
};

export default React.createContext(defaultWikiData);

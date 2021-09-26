import React, { useContext } from "react";
import PrContext from "../PrContext";

const PmTypeBlock: React.FC<{
    style?: React.CSSProperties;
    pmType: number; // pokemon 屬性 id
    [otherProps: string]: any;
}> = ({ style, pmType, ...otherProps }) => {
    const prData = useContext(PrContext);

    // pokemon 屬性區塊的背景色
    const pokemonTypeColor: {
        [index: string]: string;
    } = {
        0: "#9099a1",
        1: "#ce406a",
        2: "#8fa8dd",
        3: "#ab6ac8",
        4: "#d97745",
        5: "#c7b78b",
        6: "#90c12d",
        7: "#5369ac",
        8: "#598ea1",
        9: "#ff9c54",
        10: "#4e90d6",
        11: "#63bb5b",
        12: "#f4d23c",
        13: "#f97177",
        14: "#73cec0",
        15: "#0a6dc4",
        16: "#5a5366",
        17: "#ed8fe6",
    };

    let elemStyle = { backgroundColor: pokemonTypeColor[pmType] };

    if (style) {
        elemStyle = { ...elemStyle, ...style };
    }

    return (
        <div style={elemStyle} {...otherProps}>
            {prData.types[pmType]}
        </div>
    );
};

export default PmTypeBlock;

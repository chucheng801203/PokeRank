import React, { useContext } from "react";
import PageDataContext from "../contexts/PageDataContext";
import { getPmTypeColor } from "../util";

export interface PmTypeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
    pmType: number; // pokemon 屬性 id
}

const PmTypeBlock: React.FC<PmTypeBlockProps> = ({
    style,
    pmType,
    ...otherProps
}) => {
    const pageData = useContext(PageDataContext);

    let elemStyle = { backgroundColor: getPmTypeColor(pmType) };

    if (style) {
        elemStyle = { ...elemStyle, ...style };
    }

    return (
        <div style={elemStyle} {...otherProps}>
            {pageData.types[pmType]}
        </div>
    );
};

export default PmTypeBlock;

import React from "react";

export default React.forwardRef<
    HTMLImageElement,
    React.ImgHTMLAttributes<HTMLImageElement>
>((props, ref) => {
    const { alt, ...otherProps } = props;
    return <img ref={ref} alt={props.alt} {...otherProps} />;
});

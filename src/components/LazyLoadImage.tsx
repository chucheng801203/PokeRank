import React, { useEffect, useState, useRef } from "react";
import loadingBlockGray from "../images/loadingBlockGray.png";

const LazyLoadImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (
    props
) => {
    const ref = useRef<HTMLImageElement>(null);

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const windowScrollHandler = () => {
            if (isLoaded) return;

            if (!ref.current) return;

            const { top } = ref.current.getBoundingClientRect();

            if (
                (top < 0 && window.innerHeight * -2 <= top) ||
                (top >= 0 && window.innerHeight * 2 >= top)
            ) {
                setIsLoaded(true);
            }
        };

        windowScrollHandler();

        if (!isLoaded) {
            window.addEventListener("scroll", windowScrollHandler);

            return () => {
                window.removeEventListener("scroll", windowScrollHandler);
            };
        }
    });

    const { src, alt, ...otherProps } = props;

    return (
        <img
            {...otherProps}
            src={isLoaded ? src : loadingBlockGray}
            alt={alt}
            ref={ref}
        />
    );
};

export default LazyLoadImage;

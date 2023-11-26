import React, { useEffect, useRef } from 'react';
import Packery from 'packery';

const IsotopeComponent = ({ children }) => {
    const gridRef = useRef(null);

    useEffect(() => {
        new Packery(gridRef.current, {
            itemSelector: '.grid-item',
            gutter: 0,
        });
    }, [children]);

    return <div ref={gridRef} style={{
        maxWidth: '100vw',
        overflow: 'hidden',
        padding: '0 .5rem',
        margin: '0 auto',
    }}>{children}</div>;
};

export default IsotopeComponent;

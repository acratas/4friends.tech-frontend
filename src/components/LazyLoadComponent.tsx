import { useInView } from 'react-intersection-observer';
import PortfolioComponent from "./PortfolioComponent";

function LazyLoadComponent({ render, placeholderHeight }) {
    const [ref, inView] = useInView({
        triggerOnce: true,
    });

    return (
        inView ? render(): <div ref={ref}><div style={{ height: placeholderHeight }}></div></div>
    );
}
export default LazyLoadComponent;

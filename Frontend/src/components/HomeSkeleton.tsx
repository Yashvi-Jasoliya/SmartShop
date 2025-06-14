import ProductCardSkeleton from '../components/productSceleton';

const HomeSkeleton = () => {
    return (
        <div className='home-skeleton'>
         
            <section className='hero-skeleton'>
                <div className='hero-content-skeleton'></div>
            </section>

            <div className='heading-skeleton'>
                <div className='title-skeleton'></div>
                <div className='findmore-skeleton'></div>
            </div>

            <main className='products-grid-skeleton'>
                {[...Array(4)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </main>
        </div>
    );
};

export default HomeSkeleton;

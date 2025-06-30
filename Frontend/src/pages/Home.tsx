import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/productSceleton";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";
import { RootState } from "../redux/store";
import {
	useGetWishlistQuery,
	useToggleWishlistMutation,
} from "../redux/api/wishlistAPI";
import { responseToast } from "../utils/features";
import Footer from "../components/Footer";

const Home = () => {
	const { user } = useSelector((state: RootState) => state.userReducer);

	const { data, isLoading, isError } = useLatestProductsQuery("");

	const { data: wishlistData, isLoading: wishlistLoading } =
		useGetWishlistQuery(user?._id || "");

	const [toggleWishlist] = useToggleWishlistMutation();

	const toggleHandler = async (productId: string) => {
		if (!user?._id)
			return toast.error("Log in first to add items to wishlist.");

		const res = await toggleWishlist({
			productId,
			userId: user._id,
		});

		responseToast(res, null, "");
	};

	const dispatch = useDispatch();

	const addToCartHandler = (cartItem: CartItem) => {
		if (cartItem.stock < 1) return toast.error("Out of Stock");
		dispatch(addToCart(cartItem));
		toast.success("Added to cart");
	};

	if (isError) toast.error("Can not fetch products");

	return (
		<div className="home">
			{/* Hero Section */}
			<section className="hero">
				<div className="hero-content">
					<h2>Explore Latest Collection with Trends</h2>
					<p>
						Explore Today’s Top Trends with Latest Collection and
						Enjoy Unbeatable Discounts
					</p>
					<Link
						to="/search"
						className="inline-flex items-center gap-2 px-4 py-1 text-sm font-medium tracking-wide uppercase transition-all duration-300 hover:bg-blue-400 hover:text-black bg-blue-300   text-black rounded-xl"
					>
						Start Now{" "}
						<span
							className="text-xl"
							style={{ marginBottom: "3px" }}
						>
							{" "}
							»
						</span>
					</Link>
				</div>
			</section>

			<div className="featured-container">
				<div className="section-header">
					<h1 className="section-title">Top Products</h1>
					<Link to="/search" className="findmore">
						See more →
					</Link>
				</div>

				<div className="products-grid">
					{isLoading
						? [...Array(4)].map((_, i) => (
								<ProductCardSkeleton key={i} />
						  ))
						: !wishlistLoading &&
						  data?.products.map((product) => (
								<ProductCard
									key={product._id}
									productId={product._id}
									name={product.name}
									price={product.price}
									originalPrice={product.originalPrice}
									category={product.category}
									stock={product.stock}
									handler={addToCartHandler}
									image={product.images[0]}
									toggleHandler={toggleHandler}
									isWishlisted={
										wishlistData?.items.some(
											(item) =>
												item.product._id === product._id
										) || false
									}
								/>
						  ))}
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default Home;

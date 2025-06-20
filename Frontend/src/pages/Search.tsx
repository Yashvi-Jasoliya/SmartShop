import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import {
	useCategoriesQuery,
	useSearchProductsQuery,
} from "../redux/api/productAPI";
import { CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import ProductCardSkeleton from "../components/productSceleton";
import { CartItem } from "../types/types";
import { addToCart } from "../redux/reducer/cartReducer";
import { useDispatch, useSelector } from "react-redux";
import {
	useGetWishlistQuery,
	useToggleWishlistMutation,
} from "../redux/api/wishlistAPI";
import { RootState } from "../redux/store";
import { responseToast } from "../utils/features";
import Footer from "../components/Footer";
import Pagination from "@mui/material/Pagination";
import ChatWindow from "../components/ChatWindow";
import { Product } from "../types/types";
import { IoFilterSharp } from "react-icons/io5";

type ChatMessage = {
	text: string;
	fromUser: boolean;
	products?: Product[];
};

const Search = () => {
	const dispatch = useDispatch();
	const { user } = useSelector((state: RootState) => state.userReducer);

	const [searchParams, setSearchParams] = useSearchParams();
	const initialCategory = searchParams.get("category") || "";
	const discountFilter = searchParams.get("discount");

	const {
		data: CategoriesResponse,
		isLoading: LoadingCategories,
		isError,
		error,
	} = useCategoriesQuery("");

	const [search, setSearch] = useState("");
	const [sort, setSort] = useState("");
	const [maxPrice, setMaxPrice] = useState(200000);
	const [category, setCategory] = useState(initialCategory);
	const [page, setPage] = useState(1);
	const [chatbotOpen, setChatbotOpen] = useState(false);
	const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
	const [isBotTyping, setIsBotTyping] = useState(false);
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

	useEffect(() => {
		const urlCategory = searchParams.get("category") || "";
		setCategory(urlCategory);
		setPage(1);
	}, [searchParams]);

	const {
		data: searchedData,
		isLoading: productLoading,
		isError: productIsError,
		error: productError,
	} = useSearchProductsQuery({
		category,
		page,
		search,
		sort,
		price: maxPrice,
		discount: discountFilter ? parseInt(discountFilter) : undefined,
	});

	const productsToShow = searchedData?.products || [];

	const { data: wishlistData, isLoading: wishlistLoading } =
		useGetWishlistQuery(user?._id || "", {
			skip: !user?._id,
		});

	const [toggleWishlist] = useToggleWishlistMutation();

	const toggleHandler = async (productId: string) => {
		if (!user?._id) return toast.error("Please log in to add to wishlist");
		const res = await toggleWishlist({
			productId,
			userId: user._id,
		});
		responseToast(res, null, "");
	};

	const addToCartHandler = (cartItem: CartItem) => {
		if (cartItem.stock < 1) return toast.error("Out of Stock");
		dispatch(addToCart(cartItem));
		toast.success("Added to cart");
	};

	const handleChatSubmit = async (query: string) => {
		setChatMessages((prev) => [...prev, { text: query, fromUser: true }]);
		setIsBotTyping(true);

		try {
			console.log("Sending request to backend...");

			const response = await fetch("http://localhost:3005/api/ai", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query,
					userId: user?._id,
					currentProducts: searchedData?.products,
				}),
			});

			console.log("Response status:", response.status);

			if (!response.ok) {
				const errorText = await response.text();
				console.error("Response error:", errorText);
				throw new Error(`HTTP ${response.status}: ${errorText}`);
			}

			const data = await response.json();
			console.log("Response data:", data);

			setChatMessages((prev) => [
				...prev,
				{
					text: data.response,
					fromUser: false,
					products: data.products || [],
				},
			]);
		} catch (error) {
			console.error("Frontend error:", error);

			toast.error(`Unauthorized access! please login`);
			setChatMessages((prev) => [
				...prev,
				{
					text: "Sorry, I'm having trouble helping right now. Please try again later.",
					fromUser: false,
				},
			]);
		} finally {
			setIsBotTyping(false);
		}
	};

	useEffect(() => {
		if (isError) toast.error((error as CustomError).data.message);
		if (productIsError)
			toast.error((productError as CustomError).data.message);
	}, [isError, error, productIsError, productError]);

	return (
		<>
			<div className="search-page">
				{mobileFiltersOpen && (
					<div className="mobile-filters-overlay md:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
						<div className="mobile-filters-sidebar bg-white h-full w-4/5 max-w-sm p-4 overflow-y-auto">
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-bold">Filters</h2>
								<button
									onClick={() => setMobileFiltersOpen(false)}
									className="text-gray-500 hover:text-gray-700"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>

							<div className="filter-group mb-4">
								<label className="block mb-2 font-medium">
									Sort By
								</label>
								<select
									value={sort}
									onChange={(e) => setSort(e.target.value)}
									className="w-full p-2 border rounded"
								>
									<option value="">Default</option>
									<option value="asc">
										Price (Low to High)
									</option>
									<option value="dsc">
										Price (High to Low)
									</option>
								</select>
							</div>

							<div className="filter-group mb-4">
								<label className="block mb-2 font-medium">
									Max Price: ₹{maxPrice}
								</label>
								<input
									type="range"
									min={100}
									max={200000}
									value={maxPrice}
									onChange={(e) =>
										setMaxPrice(Number(e.target.value))
									}
									className="w-full"
								/>
							</div>

							<div className="filter-group mb-4">
								<label className="block mb-2 font-medium">
									Category
								</label>
								<select
									value={category}
									onChange={(e) =>
										setCategory(e.target.value)
									}
									className="w-full p-2 border rounded"
								>
									<option value="">All Categories</option>
									{!LoadingCategories &&
										CategoriesResponse?.categories.map(
											(i) => (
												<option key={i} value={i}>
													{i.toUpperCase()}
												</option>
											)
										)}
								</select>
							</div>

							<div className="filter-group mb-4">
								<label className="block mb-2 font-medium">
									Sort By
								</label>
								<select
									value={sort}
									onChange={(e) => setSort(e.target.value)}
									className="w-full p-2 border rounded"
								>
									<option value="">Default</option>
									<option value="newest">Newest</option>
									<option value="oldest">Oldest</option>
								</select>
							</div>

							<button
								onClick={() => setMobileFiltersOpen(false)}
								className="w-full bg-blue-600 text-white py-2 rounded mt-4"
							>
								Apply Filters
							</button>
						</div>
					</div>
				)}
                
				<aside className="filters-sidebar hidden md:block">
					<h2 className="filters-title">Filters</h2>

					<div className="filter-group">
						<label>Sort By</label>
						<select
							value={sort}
							onChange={(e) => setSort(e.target.value)}
							className="filter-select"
						>
							<option value="">Default</option>
							<option value="asc">Price (Low to High)</option>
							<option value="dsc">Price (High to Low)</option>
						</select>
					</div>

					<div className="filter-group">
						<label>Max Price: ₹{maxPrice}</label>
						<input
							type="range"
							min={20}
							max={200000}
							value={maxPrice}
							onChange={(e) =>
								setMaxPrice(Number(e.target.value))
							}
							className="price-slider"
						/>
					</div>

					<div className="filter-group">
						<label>Category</label>
						<select
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className="filter-select"
						>
							<option value="">All Categories</option>
							{!LoadingCategories &&
								CategoriesResponse?.categories.map((i) => (
									<option key={i} value={i}>
										{i.toUpperCase()}
									</option>
								))}
						</select>
					</div>

					<div className="filter-group">
						<label>Sort By</label>
						<select
							value={sort}
							onChange={(e) => setSort(e.target.value)}
							className="filter-select"
						>
							<option value="">Default</option>
							<option value="newest">Newest </option>
							<option value="oldest">Oldest </option>
						</select>
					</div>
				</aside>

				<main className="products-main">
					<div className="search-header">
						<h1 className="page-title">
							{discountFilter
								? `Products with ${discountFilter}% Off`
								: "All Products"}
						</h1>
						<div className="search-and-filter">
							<input
								type="text"
								placeholder="Search by name..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="search-input"
							/>

							<button
								onClick={() => setMobileFiltersOpen(true)}
								className="mobile-filter-button md:hidden flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg mt-5"
							>
								<IoFilterSharp />
								<span>Filters</span>
							</button>
						</div>
					</div>

					{discountFilter && (
						<div className="mb-4 p-4 bg-purple-50 rounded-lg">
							<h3 className="text-lg font-semibold text-purple-800">
								Products with {discountFilter}% discount
							</h3>
							<button
								onClick={() => {
									searchParams.delete("discount");
									setSearchParams(searchParams);
								}}
								className="mt-2 text-purple-600 hover:text-purple-800 text-sm"
							>
								Clear discount filter
							</button>
						</div>
					)}

					<div className="product-grid">
						{productLoading
							? [...Array(6)].map((_, i) => (
									<ProductCardSkeleton key={i} />
							  ))
							: !wishlistLoading &&
							  productsToShow?.map((product) => (
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
													item.product._id ===
													product._id
											) || false
										}
									/>
							  ))}
					</div>

					{searchedData && searchedData.totalPage > 1 && (
						<div className="pagination flex justify-center mt-4">
							<Pagination
								count={searchedData.totalPage}
								page={page}
								onChange={(event, value) => setPage(value)}
								variant="outlined"
								shape="rounded"
								color="primary"
								className="gap-3"
							/>
						</div>
					)}
				</main>

				<button
					onClick={() => setChatbotOpen(true)}
					className="chatbot-button fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-8 w-8"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
						/>
					</svg>
				</button>

				{chatbotOpen && (
					<div className="fixed bottom-24 right-8 w-96 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
						<ChatWindow
							messages={chatMessages}
							onSubmit={handleChatSubmit}
							onClose={() => setChatbotOpen(false)}
							isTyping={isBotTyping}
						/>
					</div>
				)}
			</div>

			<Footer />
		</>
	);
};

export default Search;

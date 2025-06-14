import React, { useEffect, useState } from "react";
import { useProductDetailsQuery } from "../redux/api/productAPI";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ProductCardSkeleton from "../components/productSceleton";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";
import ReviewForm from "./ReviewForm";
import Footer from "../components/Footer";
import { useGetProductReviewsQuery } from "../redux/api/reviewAPI";

const ProductPage: React.FC = () => {
	const [selectedColor, setSelectedColor] = useState<string>("Black");
	const [mainImage, setMainImage] = useState<string>(
		"https://res.cloudinary.com/djsewrcyo/image/upload/v1726149377/cld-sample-3.jpg"
	);

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const params = useParams();
	const { data, isError, isLoading } = useProductDetailsQuery(params.id!);

	const product = data?.product;
	const { data: reviews = [] } = useGetProductReviewsQuery(
		product?._id || ""
	);

	useEffect(() => {
		if (product?.images?.length) {
			setMainImage(product.images[0].replace("200x200", "800x800"));
		}
	}, [product]);

	if (isError) return <Navigate to={"/404"} />;
	if (isLoading) return <ProductCardSkeleton />;
	if (!product) {
		toast.error("Product Not Found");
		return <Navigate to="/404" />;
	}

	const discountPercentage = Math.round(
		((product.originalPrice - product.price) / product.originalPrice) * 100
	);

	const handleThumbnailClick = (img: string) => {
		setMainImage(img.replace("200x200", "800x800"));
	};

	const getColorClass = (color: string) => {
		return color.toLowerCase().replace(/\s+/g, "") + "-color";
	};

	const addToCartHandler = (cartItem: CartItem) => {
		if (cartItem.stock < 1) return toast.error("Out of Stock");
		dispatch(addToCart(cartItem));
		toast.success("Added to cart");
	};

	return (
		<>
			<div className="product-container">
				<aside className="product-gallery">
					<div className="main-image-container">
						<img
							src={mainImage}
							alt={product.name}
							className="main-image"
						/>
					</div>
					<div className="thumbnail-container">
						{product.images.slice(0).map((img, index) => (
							<img
								key={index}
								src={img}
								alt={`${product.name} angle ${index + 1}`}
								className={`thumbnail ${
									mainImage ===
									img.replace("200x200", "800x800")
										? "active"
										: ""
								}`}
								onClick={() => handleThumbnailClick(img)}
							/>
						))}
					</div>
					<div className="action-buttons">
						<button
							className="btn btn-primary"
							onClick={() =>
								addToCartHandler({
									productId: product._id,
									name: product.name,
									price: product.price,
									image: mainImage,
									stock: product.stock,
									quantity: 1,
								})
							}
						>
							<i className="fas fa-shopping-cart"></i> Add to Cart
						</button>
						<button
							className="btn btn-secondary"
							onClick={() => {
								addToCartHandler({
									productId: product._id,
									name: product.name,
									price: product.price,
									image: mainImage,
									stock: product.stock,
									quantity: 1,
								});
								navigate("/cart");
							}}
						>
							<i className="fas fa-bolt"></i> Buy Now
						</button>
					</div>
				</aside>

				<main className="product-info">
					<div className="product-header">
						<h1 className="product-title">{product.name}</h1>
						<div className="product-brand">{product.brand}</div>
					</div>

					<div className="price-container">
						<span className="current-price">
							₹{product.price.toFixed(2)}
						</span>
						<span className="original-price">
							₹{product.originalPrice.toFixed(2)}
						</span>
						<span className="discount-badge">
							{discountPercentage}% OFF
						</span>
					</div>
					<div className="rating text-blue-600">
						{reviews.length}{" "}
						{reviews.length === 1 ? "review" : "reviews"}
					</div>

					{product.stock < 30 && (
						<div className="availability">
							<span className={`stock-indicator ${""}`}>
								{product.stock === 0
									? "Sold Out"
									: `Only ${product.stock} left in stock`}
							</span>
						</div>
					)}

					<div className="product-description">
						{product.description}
					</div>

					<div className="features">
						<h3 className="section-title">
							<i className="fas fa-bolt"></i> Key Features
						</h3>
						<ul className="features-list">
							{product.features.map((feature, index) => (
								<li key={index}>{feature}</li>
							))}
						</ul>
					</div>

					<div className="color-options">
						<h3 className="section-title">
							<i className="fas fa-palette"></i> Color Options
						</h3>
						<div className="color-selector">
							{product.colors.map((color) => (
								<div
									key={color}
									className={`color-option ${getColorClass(
										color
									)} ${
										selectedColor === color
											? "selected"
											: ""
									}`}
									title={color}
									onClick={() => setSelectedColor(color)}
								></div>
							))}
						</div>
					</div>

					<div className="info-cards">
						<div className="info-card">
							<div className="review-summary mb-5">
								<div className="overall-rating">
									<span className="rating">4.5</span>
									<span className="total-reviews">
										Based on 128 reviews
									</span>
								</div>

								<div className="rating-bars">
									{[5, 4, 3, 2, 1].map((star) => (
										<div key={star} className="rating-bar">
											<span className="star-label">
												{star} star
											</span>
											<div className="bar-container">
												<div
													className="bar"
													style={{
														width: `${
															star === 5
																? 70
																: star === 4
																? 20
																: star === 3
																? 5
																: star === 2
																? 3
																: 2
														}%`,
													}}
												></div>
											</div>
											<span className="percentage">
												{star === 5
													? "70%"
													: star === 4
													? "20%"
													: star === 3
													? "5%"
													: star === 2
													? "3%"
													: "2%"}
											</span>
										</div>
									))}
								</div>
							</div>

							<ReviewForm productId={product._id} />
						</div>
					</div>
				</main>
			</div>
			<Footer />
		</>
	);
};

export default ProductPage;
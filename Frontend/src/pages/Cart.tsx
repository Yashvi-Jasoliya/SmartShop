import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CartItemCard from "../components/CartItem";
import {
	addToCart,
	calculatePrice,
	discountApplied,
	removeCartItem,
} from "../redux/reducer/cartReducer";
import { CartReducerInitialState } from "../types/reducer-types";
import { CartItem } from "../types/types";
import axios from "axios";
import { server } from "../redux/store";

const Cart = () => {
	const { cartItems, subTotal, tax, discount, total, shippingCharges } =
		useSelector(
			(state: { cartReducer: CartReducerInitialState }) =>
				state.cartReducer
		);

	const { user } = useSelector(
		(state: {
			userReducer: { user: { _id: string; name: string; email: string } };
		}) => state.userReducer
	);

	const [couponCode, setCouponCode] = useState<string>("");
	const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);
	const [isCouponApplied, setIsCouponApplied] = useState<boolean>(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const incrementHandler = (cartItem: CartItem) => {
		if (cartItem.quantity >= cartItem.stock)
			return toast.error(`We have only ${cartItem.stock} in Stock!`);
		dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
	};

	const decrementHandler = (cartItem: CartItem) => {
		if (cartItem.quantity <= 1) return;
		dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
	};

	const removeHandler = (productId: string) => {
		dispatch(removeCartItem(productId));
	};

	const proceedToCheckoutHandler = () => {
		if (!user) {
			toast.error("Please login to proceed to checkout");
			navigate("/login");
			return;
		}
		navigate("/shipping");
	};

	useEffect(() => {
		if (!couponCode) return;

		const { token: cancelToken, cancel } = axios.CancelToken.source();

		const timeOutId = setTimeout(() => {
			axios
				.post(
					`${server}/api/v1/payment/discount`,
					{ couponCode },
					{ cancelToken }
				)
				.then((res) => {
					const discount = res.data.discount;

					dispatch(discountApplied(discount));
					setIsValidCouponCode(true);
					setIsCouponApplied(true);
					dispatch(calculatePrice());

					toast.success("Coupon applied successfully!");
				})
				.catch((e) => {
					console.log(
						e?.response?.data?.message || "Error applying coupon"
					);
					dispatch(discountApplied(0));
					setIsValidCouponCode(false);
					dispatch(calculatePrice());
				});
		}, 1000);

		return () => {
			clearTimeout(timeOutId);
			cancel("Request Cancel due to new request");
			setIsValidCouponCode(false);
		};
	}, [couponCode, dispatch]);

	useEffect(() => {
		dispatch(calculatePrice());
	}, [cartItems, dispatch]);

	useEffect(() => {
		if (isCouponApplied && total <= 0) {
			toast.error("Add more products to continue.");
			navigate("/search");
		}
	}, [total, isCouponApplied, navigate]);

	return (
		<div className="cart-container">
			<div className="cart-header">
				<h1>Your Shopping Cart</h1>
				{cartItems.length > 0 && (
					<p>
						{cartItems.length}{" "}
						{cartItems.length === 1 ? "item" : "items"}
					</p>
				)}
			</div>

			<div className="cart-content">
				<main className="cart-items">
					{cartItems.length > 0 ? (
						cartItems.map((i, idx) => (
							<CartItemCard
								incrementHandler={incrementHandler}
								decrementHandler={decrementHandler}
								removeHandler={removeHandler}
								key={idx}
								cartItem={i}
							/>
						))
					) : (
						<div className="empty-cart">
							<h2>Your cart is empty</h2>
							<p>
								Looks like you haven't added anything to your
								cart yet
							</p>
							<Link to="/store" className="continue-shopping">
								Continue Shopping
							</Link>
						</div>
					)}
				</main>

				{cartItems.length > 0 && (
					<aside className="cart-summary">
						<h3>Order Summary</h3>

						<div className="price-breakdown">
							<div className="summary-row">
								<span>Subtotal</span>
								<span>₹{subTotal.toFixed(2)}</span>
							</div>

							<div className="summary-row">
								<span>Shipping</span>
								<span>₹{shippingCharges.toFixed(2)}</span>
							</div>

							<div className="summary-row">
								<span>Tax</span>
								<span>₹{tax.toFixed(2)}</span>
							</div>

							{isCouponApplied && isValidCouponCode && (
								<div className="summary-row discount">
									<span>Discount ({couponCode})</span>
									<span>- ₹{discount.toFixed(2)}</span>
								</div>
							)}
						</div>

						<div className="coupon-section">
							<div className="coupon-input">
								<input
									type="text"
									placeholder="Enter coupon code"
									value={couponCode}
									onChange={(e) =>
										setCouponCode(
											e.target.value
												.toUpperCase()
												.replace(/\s/g, "")
										)
									}
								/>
							</div>

							{couponCode && !isValidCouponCode && (
								<div className="coupon-error">
									<VscError />
									<span>Invalid coupon code</span>
								</div>
							)}
						</div>

						<div className="summary-row total">
							<span>Total</span>
							<span>₹{total.toFixed(2)}</span>
						</div>

						<button
							onClick={proceedToCheckoutHandler}
							className={`checkout-button ${
								total <= 0 ? "disabled" : ""
							}`}
							disabled={total <= 0}
						>
							Proceed to Checkout
						</button>

						{total <= 0 && (
							<p className="text-sm text-red-600 mt-2">
								Add more products to proceed — total amount is
								not sufficient.
							</p>
						)}

						<Link to="/store" className="continue-shopping">
							Continue Shopping
						</Link>
					</aside>
				)}
			</div>
		</div>
	);
};

export default Cart;

import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingInfo } from "../redux/reducer/cartReducer";
import { RootState, server } from "../redux/store";
import { getAuth } from "firebase/auth";

const Shipping = () => {
	const { cartItems, total } = useSelector(
		(state: RootState) => state.cartReducer
	);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const auth = getAuth();
	const user = auth.currentUser;

	const [shippingInfo, setShippingInfo] = useState({
		address: "",
		city: "",
		state: "",
		country: "",
		pinCode: "",
		phoneNo: "",
	});

	const changeHandler = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		const trimmed = value.trimStart();

		if (name === "phoneNo") {
			let cleaned = trimmed.replace(/\D/g, "").slice(0, 10);
			if (cleaned.length > 5) {
				cleaned = cleaned.slice(0, 5) + " " + cleaned.slice(5);
			}
			setShippingInfo((prev) => ({
				...prev,
				[name]: cleaned,
			}));
		} else if (name === "pinCode") {
			const cleaned = trimmed.replace(/\D/g, "");
			if (cleaned.length <= 6) {
				setShippingInfo((prev) => ({
					...prev,
					[name]: cleaned,
				}));
			}
		} else if (name === "city" || name === "state") {
			const onlyLetters = trimmed.replace(/[^A-Za-z\s]/g, "");
			setShippingInfo((prev) => ({
				...prev,
				[name]: onlyLetters,
			}));
		} else {
			setShippingInfo((prev) => ({
				...prev,
				[name]: trimmed,
			}));
		}
	};

	const isValidAddress = (value: string) =>
		/^[a-zA-Z0-9\s,.-]+$/.test(value) && /[a-zA-Z]/.test(value);

	const isAlphaString = (value: string) =>
		/^[a-zA-Z\s]+$/.test(value) && !/^\s*$/.test(value);

	const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!user) {
			toast.error("User not authenticated.");
			return;
		}

		const cleanedShippingInfo = {
			...shippingInfo,
			address: shippingInfo.address.trim(),
			city: shippingInfo.city.trim(),
			state: shippingInfo.state.trim(),
			country: shippingInfo.country.trim(),
			pinCode: shippingInfo.pinCode.trim(),
			phoneNo: shippingInfo.phoneNo.replace(/\s/g, "").trim(),
		};

		// Basic validations
		if (
			!isAlphaString(cleanedShippingInfo.city) ||
			!isAlphaString(cleanedShippingInfo.state) ||
			!isValidAddress(cleanedShippingInfo.address)
		) {
			toast.error("Address must be valid text only.");
			return;
		}

		if (!/^\d{10}$/.test(cleanedShippingInfo.phoneNo)) {
			toast.error("Please enter a valid 10-digit phone number.");
			return;
		}

		if (!/^\d{6}$/.test(cleanedShippingInfo.pinCode)) {
			toast.error("Please enter a valid 6-digit pin code.");
			return;
		}

		dispatch(saveShippingInfo(cleanedShippingInfo));

		const token = await user.getIdToken();
		try {
			const { data } = await axios.post(
				`${server}/api/v1/payment/create`,
				{ amount: total },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			navigate("/pay", {
				state: data.client_secret,
			});
		} catch (error) {
			console.error(error);
			toast.error("Payment initiation failed");
		}
	};

	useEffect(() => {
		if (cartItems.length <= 0) return navigate("/cart");
	}, [cartItems]);

	return (
		<div className="shipping min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
			<div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all hover:shadow-2xl">
				<form onSubmit={submitHandler} className="space-y-5">
					<div className="text-center">
						<h1 className="text-3xl font-bold text-blue-600 mb-2">
							Shipping Details
						</h1>
						<p className="text-gray-500">
							Enter your delivery information
						</p>
					</div>

					<div className="space-y-4">
						<div>
							<label
								htmlFor="address"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Address
							</label>
							<input
								required
								type="text"
								placeholder="123 Main Street"
								name="address"
								value={shippingInfo.address}
								onChange={changeHandler}
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="city"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									City
								</label>
								<input
									required
									type="text"
									placeholder="Your City"
									name="city"
									value={shippingInfo.city}
									onChange={changeHandler}
									className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
								/>
							</div>

							<div>
								<label
									htmlFor="state"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									State
								</label>
								<input
									required
									type="text"
									placeholder="Your State"
									name="state"
									value={shippingInfo.state}
									onChange={changeHandler}
									className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="country"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Country
							</label>
							<select
								required
								name="country"
								value={shippingInfo.country}
								onChange={changeHandler}
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-white"
							>
								<option value="">Select Country</option>
								<option value="India">India</option>
								<option value="USA">United States</option>
								<option value="UK">United Kingdom</option>
								<option value="Canada">Canada</option>
							</select>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="pinCode"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									PIN Code
								</label>
								<input
									required
									type="text"
									placeholder="400001"
									name="pinCode"
									value={shippingInfo.pinCode}
									onChange={changeHandler}
									className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
								/>
							</div>

							<div>
								<label
									htmlFor="phoneNo"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Phone Number
								</label>
								<input
									required
									type="text"
									placeholder="98765 43210"
									name="phoneNo"
									value={shippingInfo.phoneNo}
									onChange={changeHandler}
									className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition tracking-widest"
									maxLength={11}
								/>
							</div>
						</div>
					</div>

					<button
						type="submit"
						className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95 transform"
					>
						<span className="font-semibold">
							Continue to Payment
						</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 inline-block ml-2"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</form>
			</div>
		</div>
	);
};

export default Shipping;

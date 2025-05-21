import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
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

		if (name === "phoneNo") {
			let cleaned = value.replace(/\D/g, "").slice(0, 10); // allow only digits, max 10
			if (cleaned.length > 5) {
				cleaned = cleaned.slice(0, 5) + " " + cleaned.slice(5);
			}
			setShippingInfo((prev) => ({
				...prev,
				[name]: cleaned,
			}));
		} else if (name === "pinCode") {
			const cleaned = value.replace(/\D/g, "");
			if (cleaned.length <= 6) {
				setShippingInfo((prev) => ({
					...prev,
					[name]: cleaned,
				}));
			}
		} else {
			setShippingInfo((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!user) {
			toast.error("User not authenticated.");
			return;
		}

	const phoneNo = shippingInfo.phoneNo.replace(/\s/g, "");
	if (!/^\d{10}$/.test(phoneNo)) {
		toast.error("Please enter a valid 10-digit phone number.");
		return;
	}

		if (!/^\d{6}$/.test(shippingInfo.pinCode)) {
			toast.error("Please enter a valid 6-digit pin code.");
			return;
		}

		dispatch(
			saveShippingInfo({
				...shippingInfo,
				phoneNo,
			})
		);

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
		<div className="shipping min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-50 to-blue-100 p-4">
			<div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
				{/* <button
					className="mb-2 text-blue-600 hover:text-blue-800 flex items-center"
					onClick={() => navigate("/cart")}
				>
					<BiArrowBack className="mr-1" /> Back
				</button> */}

				<form onSubmit={submitHandler} className="space-y-4">
					<h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
						Shipping Address
					</h1>

					<input
						required
						type="text"
						placeholder="Address"
						name="address"
						value={shippingInfo.address}
						onChange={changeHandler}
						className="w-full p-3 border rounded-lg"
					/>

					<input
						required
						type="text"
						placeholder="City"
						name="city"
						value={shippingInfo.city}
						onChange={changeHandler}
						className="w-full p-3 border rounded-lg"
					/>

					<input
						required
						type="text"
						placeholder="State"
						name="state"
						value={shippingInfo.state}
						onChange={changeHandler}
						className="w-full p-3 border rounded-lg"
					/>

					<select
						required
						name="country"
						value={shippingInfo.country}
						onChange={changeHandler}
						className="w-full p-3 border rounded-lg"
					>
						<option value="">Choose Country</option>
						<option value="India">India</option>
					</select>

					<input
						required
						type="text"
						placeholder="Pin Code"
						name="pinCode"
						value={shippingInfo.pinCode}
						onChange={changeHandler}
						className="w-full p-3 border rounded-lg"
					/>

					<input
						required
						type="text"
						placeholder="Phone Number (e.g. 95412 12364)"
						name="phoneNo"
						value={shippingInfo.phoneNo}
						onChange={changeHandler}
						className="w-full p-3 border rounded-lg tracking-widest"
						maxLength={11}
					/>

					<button
						type="submit"
						className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
					>
						Pay Now
					</button>
				</form>
			</div>
		</div>
	);
};

export default Shipping;

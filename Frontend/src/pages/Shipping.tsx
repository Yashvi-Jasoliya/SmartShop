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
        phoneNo: ""
	});

	const changeHandler = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setShippingInfo((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!user) {
			toast.error("User not authenticated.");
			return;
		}

		

		dispatch(saveShippingInfo(shippingInfo));
        const token = await user.getIdToken();
		try {
			const { data } = await axios.post(
				`${server}/api/v1/payment/create`,
				{
					amount: total, // total should be in rupees
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`, // Firebase token
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
		<div className="shipping">
			<button className="back-btn" onClick={() => navigate("/cart")}>
				<BiArrowBack />
			</button>

			<form onSubmit={submitHandler}>
				<h1>Shipping Address</h1>

				<input
					required
					type="text"
					placeholder="Address"
					name="address"
					value={shippingInfo.address}
					onChange={changeHandler}
				/>
				<input
					required
					type="text"
					placeholder="City"
					name="city"
					value={shippingInfo.city}
					onChange={changeHandler}
				/>
				<input
					required
					type="text"
					placeholder="State"
					name="state"
					value={shippingInfo.state}
					onChange={changeHandler}
				/>
				<select
					required
					name="country"
					value={shippingInfo.country}
					onChange={changeHandler}
				>
					<option value="">Choose Country</option>
					<option value="india">India</option>
				</select>
				<input
					required
					type="number"
					placeholder="Pin Code"
					name="pinCode"
					value={shippingInfo.pinCode}
					onChange={changeHandler}
				/>

				<input
					required
					type="number"
					placeholder="Phone No."
					name="phoneNo"
					value={shippingInfo.phoneNo}
					onChange={changeHandler}
				/>

				<button type="submit">Pay Now</button>
			</form>
		</div>
	);
};

export default Shipping;

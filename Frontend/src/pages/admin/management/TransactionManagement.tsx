import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import {
	useDeleteOrderMutation,
	useOrderDetailsQuery,
	useUpdateOrderMutation,
} from "../../../redux/api/orderAPI";
import { UserReducerInitialState } from "../../../types/reducer-types";
import { OrderItem, OrderType } from "../../../types/types";
import { responseToast } from "../../../utils/features";
import { IoCloseOutline } from "react-icons/io5";

const defaultData: OrderType = {
	shippingInfo: {
		address: "",
		city: "",
		state: "",
		country: "",
		pinCode: "",
		phoneNo: "",
	},
	orderItems: [],
	status: "",
	subTotal: 0,
	discount: 0,
	shippingCharges: 0,
	tax: 0,
	total: 0,
	user: {
		name: "",
		_id: "",
	},
	_id: "",
};

const TransactionManagement = () => {
	const { user } = useSelector(
		(state: { userReducer: UserReducerInitialState }) => state.userReducer
	);

	const params = useParams();
	const navigate = useNavigate();

	const { data, isError } = useOrderDetailsQuery(params.id!);

	const {
		shippingInfo: { address, city, country, pinCode, state },
		orderItems,
		user: { name },
		discount,
		shippingCharges,
		status,
		subTotal,
		tax,
		total,
	} = data?.order || defaultData;

	const [deleteOrder] = useDeleteOrderMutation();
	const [updateOrder] = useUpdateOrderMutation();

	const updateHander = async () => {
		const res = await updateOrder({
			userId: user?._id!,
			orderId: data?.order._id!,
		});

		responseToast(res, navigate, "/admin/transaction");
	};

	const deleteHandler = async () => {
		const res = await deleteOrder({
			userId: user?._id!,
			orderId: data?.order._id!,
		});

		responseToast(res, navigate, "/admin/transaction");
	};

	if (isError) return <Navigate to={"/404"} />;

	return (
		<div className="adminContainer">
			<AdminSidebar />
			<main className="productManagementContainer">
				<section
					style={{ padding: "2rem" }}
					className="product-display"
				>
					<div className="product-header">
						<span className="product-id">
							ID: {data?.order._id.slice(-10)}
						</span>
						<button onClick={deleteHandler} className="delete-btn">
							<FaTrash />
						</button>
					</div>
					<h2>Order Items</h2>

					{orderItems.map((i) => (
						<ProductCard
							key={i._id}
							name={i.name}
							image={i.image}
							productId={i.productId}
							price={i.price}
							quantity={i.quantity}
							_id={i._id}
						/>
					))}
				</section>

				<article className="shippingInfoCard relative">
					<button
						type="button"
						onClick={() => navigate("/admin/transaction")}
						aria-label="Close transaction form"
						className="absolute top-7 right-10 text-gray-800 hover:text-gray-500"
						style={{ fontSize: "25px" }}
					>
						<IoCloseOutline />
					</button>
					<div>
						<h1>Order Info</h1>

						<h5>User Info</h5>
						<p>Name: {name}</p>
						<p>
							Address:{" "}
							{`${address}, ${city}, ${state}, ${country} ${pinCode}`}
						</p>
						<h5>Amount Info</h5>
						<p>Subtotal: {subTotal}</p>
						<p>
							Shipping Charges:{" "}
							{(subTotal ?? 0) >= 1000
								? "0.00"
								: shippingCharges ?? 200}
						</p>
						<p>Tax: {tax}</p>
						<p>Discount: {discount}</p>
						<p>Total: {total}</p>
						<h5>Status Info</h5>
						<p>
							Status:{" "}
							<span
								className={
									status === "Delivered"
										? "purple"
										: status === "Shipped"
										? "green"
										: "red"
								}
							>
								{status}
							</span>
						</p>
						<button onClick={updateHander}>Process Status</button>
					</div>
				</article>
			</main>
		</div>
	);
};

const ProductCard = ({
	name,
	image,
	price,
	quantity,
	productId,
}: OrderItem) => (
	<div className="transactionProductCard">
		<img src={image} alt={name} />
		<Link to={`/products/${productId}`}>{name}</Link>
		<span>
			₹{price} X {quantity} = ₹{price * quantity}
		</span>
	</div>
);

export default TransactionManagement;

import React, { useRef } from "react";
import { useOrderDetailsQuery } from "../redux/api/orderAPI";
import Loading from "./Loading";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface OrderDetailsProps {
	orderId: string;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId }) => {
	const { data, isLoading } = useOrderDetailsQuery(orderId);
	const contentRef = useRef<HTMLDivElement>(null);

	if (!data) return null;

	const formatDate = (timestamp: string | Date) => {
		const date = new Date(timestamp);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const handleStructuredPDF = () => {
		if (!data) return;

		const doc = new jsPDF();

		doc.setFontSize(18);
		doc.text(`Order #${data.order._id}`, 14, 22);
		doc.setFontSize(12);
		doc.text(`Status: ${data.order.status}`, 14, 32);

		doc.setFontSize(14);
		doc.text("Shipping Information:", 14, 42);
		doc.setFontSize(12);
		const shipping = data.order.shippingInfo;
		const shippingLines = [
			shipping.address,
			`${shipping.city}, ${shipping.state} ${shipping.pinCode}`,
			shipping.country,
			`Phone: ${shipping.phoneNo}`,
		];
		shippingLines.forEach((line, i) => {
			doc.text(line, 14, 50 + i * 7);
		});

		doc.setFontSize(14);
		doc.text("Order Dates:", 14, 85);
		doc.setFontSize(12);
		doc.text(`Order Date: ${formatDate(data.order.createdAt!)}`, 14, 93);
		doc.text(`Last Updated: ${formatDate(data.order.updatedAt!)}`, 14, 100);

		const tableColumn = ["Product", "Price", "Quantity", "Total"];
		const tableRows = data.order.orderItems.map((item: any) => [
			item.name,
			`Rs. ${item.price.toFixed(2)}`,
			item.quantity.toString(),
			`Rs. ${(item.price * item.quantity).toFixed(2)}`,
		]);

		autoTable(doc, {
			startY: 110,
			head: [tableColumn],
			body: tableRows,
			styles: { fontSize: 10 },
			headStyles: { fillColor: [0, 115, 255] },
			theme: "striped",
		});

		const finalY = (doc as any).lastAutoTable?.finalY || 110;
		const summaryStartY = finalY + 15;

		doc.setFontSize(14);
		doc.text("", 14, summaryStartY - 8);
        const shippingAmount =
			(data.order.subTotal ?? 0) >= 1000
				? 0
				: data.order.shippingCharges ?? 200;

		const summaryData = [
			["Subtotal", `Rs. ${data.order.subTotal.toFixed(2)}`],
			["Shipping", `Rs. ${shippingAmount.toFixed(2)}`],
			[
				`Tax (${((data.order.tax / data.order.subTotal) * 100).toFixed(
					2
				)}%)`,
				`Rs. ${data.order.tax.toFixed(2)}`,
			],
			["Discount", `-Rs. ${data.order.discount.toFixed(2)}`],
			["Total", `Rs. ${data.order.total.toFixed(2)}`],
		];

		autoTable(doc, {
			startY: summaryStartY,
			body: summaryData,
			theme: "plain",
			styles: { fontSize: 12 },
			columnStyles: {
				0: { halign: "left", fontStyle: "bold" },
				1: { halign: "right" },
			},
			didParseCell: (data) => {
				if (data.row.index === summaryData.length - 1) {
					data.cell.styles.fontStyle = "bold";
					data.cell.styles.fillColor = [0, 115, 255];
					data.cell.styles.textColor = [255, 255, 255];
				}
			},
		});

		doc.save(`order-${orderId}.pdf`);
	};

	return isLoading ? (
		<Loading />
	) : (
		<div className="order-details" ref={contentRef}>
			<div className="order-header">
				<h2>Order #{data.order._id}</h2>
				<span
					className={`order-status status-${data.order.status.toLowerCase()}`}
				>
					{data.order.status}
				</span>
			</div>

			<div className="order-info-grid">
				<div className="shipping-info">
					<h3>Shipping Information</h3>
					<p>
						{data.order.shippingInfo.address}
						<br />
						{data.order.shippingInfo.city},{" "}
						{data.order.shippingInfo.state}{" "}
						{data.order.shippingInfo.pinCode}
						<br />
						{data.order.shippingInfo.country}
						<br />
						Phone: {data.order.shippingInfo.phoneNo}
					</p>
				</div>

				<div className="order-meta">
					<div className="date-info">
						<h3>Order Date</h3>
						<p>{formatDate(data.order.createdAt!)}</p>
					</div>
					<div className="date-info">
						<h3>Last Updated</h3>
						<p>{formatDate(data.order.updatedAt!)}</p>
					</div>
				</div>
			</div>

			<div className="order-items-section">
				<h3>Order Items</h3>
				<table className="order-items-table">
					<thead>
						<tr>
							<th>Product</th>
							<th>Price</th>
							<th>Quantity</th>
							<th>Total</th>
						</tr>
					</thead>
					<tbody>
						{data.order.orderItems.map((item) => (
							<tr key={item._id}>
								<td>
									<div className="product-info">
										<img
											src={item.image}
											alt={item.name}
											className="product-image"
											onError={(e) => {
												(
													e.target as HTMLImageElement
												).src =
													"/images/placeholder-product.jpg";
											}}
										/>
										<div className="product-details">
											<div className="product-name">
												{item.name}
											</div>
											<div className="product-id">
												SKU: {item.productId.slice(-6)}
											</div>
										</div>
									</div>
								</td>
								<td>₹{item.price.toFixed(2)}</td>
								<td>{item.quantity}</td>
								<td>
									₹{(item.price * item.quantity).toFixed(2)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="order-summary">
				<table>
					<tbody>
						<tr>
							<td>Subtotal:</td>
							<td>{data.order.subTotal}</td>
						</tr>
						<tr>
							<td>Shipping:</td>
							<td>
								{(data.order.subTotal ?? 0) >= 1000
									? "0.00"
									: (
											data.order.shippingCharges ?? 200
									  )}
							</td>
						</tr>
						<tr>
							<td>
								Tax (
								{(data.order.tax / data.order.subTotal) * 100}
								%)  
							</td>
							<td>{data.order.tax}</td>
						</tr>
						<tr>
							<td>Discount:</td>
							<td>-{data.order.discount}</td>
						</tr>
						<tr className="total-row">
							<td>Total:</td>
							<td>{data.order.total}</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div className="flex flex-col sm:flex-row gap-3 mt-4">
				<button
					onClick={handleStructuredPDF}
					className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-300"
				>
					Download PDF
				</button>
			</div>
		</div>
	);
};

export default OrderDetails;

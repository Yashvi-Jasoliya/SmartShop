import React, { useState, useEffect } from "react";
import { FaRegBell } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

type NotificationType = "user" | "product" | "order" | "review";

interface Notification {
	id: number;
	type: NotificationType;
	refId: string;
	isRead: boolean;
	createdAt: string; // API returns string ISO format
}

const AdminNotification: React.FC = () => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [open, setOpen] = useState<boolean>(false);
	const { user } = useSelector((state: RootState) => state.userReducer);

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const res = await axios.get("/api/admin/notifications", {
					// headers: {
					// 	Authorization: `Bearer ${user?.token}`, // Optional: secure admin route
					// },
				});

				const storedReadIds = JSON.parse(
					localStorage.getItem("readNotificationIds") || "[]"
				);

				const enriched: Notification[] = res.data.map(
					(n: Notification) => ({
						...n,
						isRead: storedReadIds.includes(n.id),
					})
				);

				setNotifications(enriched);
			} catch (err) {
				console.error("Failed to fetch notifications:", err);
			}
		};

		if (user) fetchNotifications();
	}, [user]);

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	const togglePanel = () => {
		setOpen((prev) => !prev);
		if (!open) {
			const readIds = notifications.map((n) => n.id);
			localStorage.setItem(
				"readNotificationIds",
				JSON.stringify(readIds)
			);

			setNotifications((prev) =>
				prev.map((n) => ({ ...n, isRead: true }))
			);
		}
	};

	const renderMessage = (n: Notification) => {
		switch (n.type) {
			case "user":
				return `New user registered (ID: ${n.refId})`;
			case "product":
				return `New product added (ID: ${n.refId})`;
			case "order":
				return `New order placed (ID: ${n.refId})`;
			case "review":
				return `New review posted (ID: ${n.refId})`;
			default:
				return `New activity (ID: ${n.refId})`;
		}
	};

	return (
		<div style={{ position: "relative", display: "inline-block" }}>
			<div
				onClick={togglePanel}
				style={{ cursor: "pointer", position: "relative" }}
			>
				<FaRegBell size={20} />
				{unreadCount > 0 && (
					<span
						style={{
							position: "absolute",
							top: -5,
							right: -5,
							background: "red",
							color: "white",
							fontSize: "12px",
							borderRadius: "50%",
							padding: "2px 6px",
						}}
					>
						{unreadCount}
					</span>
				)}
			</div>

			{open && (
				<div
					style={{
						position: "absolute",
						top: "30px",
						right: 0,
						width: "280px",
						background: "#fff",
						boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
						borderRadius: "8px",
						padding: "10px",
						zIndex: 999,
					}}
				>
					<strong>Notifications</strong>
					<ul
						style={{
							listStyle: "none",
							padding: 0,
							marginTop: "10px",
						}}
					>
						{notifications.map((n) => (
							<li
								key={n.id}
								style={{
									padding: "6px 0",
									borderBottom: "1px solid #eee",
									fontSize: "14px",
								}}
							>
								{renderMessage(n)}
								<br />
								<small style={{ color: "#888" }}>
									{new Date(n.createdAt).toLocaleString()}
								</small>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default AdminNotification;
